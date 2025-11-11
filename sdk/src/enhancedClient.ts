/**
 * Enhanced API Client with interceptors, caching, retry logic, and request management
 */

import { SDKError, createErrorFromResponse, createNetworkError } from './errors';

// Node.js HTTPS agent for SSL bypass (development only)
let customFetch: typeof fetch = fetch;

if (
  typeof process !== 'undefined' &&
  typeof process.versions !== 'undefined' &&
  process.versions.node
) {
  try {
    const { Agent, setGlobalDispatcher } = require('undici');
    const agent = new Agent({
      connect: {
        rejectUnauthorized: false,
      },
    });
    setGlobalDispatcher(agent);
  } catch {
    // If undici setup fails, fall back to default fetch
  }
}

export interface SDKConfig {
  apiUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTTL?: number;
  debug?: boolean;
  headers?: Record<string, string>;
  onRequest?: RequestInterceptor;
  onResponse?: ResponseInterceptor;
  onError?: ErrorInterceptor;
}

export type RequestInterceptor = (
  url: string,
  options: RequestOptions
) => Promise<{ url: string; options: RequestOptions }> | { url: string; options: RequestOptions };

export type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

export type ErrorInterceptor = (error: SDKError) => Promise<SDKError> | SDKError;

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  params?: Record<string, string | number>;
  body?: unknown;
  cache?: boolean;
  retry?: boolean;
  timeout?: number;
}

interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number;
}

interface PendingRequest {
  promise: Promise<unknown>;
  controller: AbortController;
}

export class EnhancedApiClient {
  private config: Required<Omit<SDKConfig, 'onRequest' | 'onResponse' | 'onError'>> & {
    onRequest?: RequestInterceptor;
    onResponse?: ResponseInterceptor;
    onError?: ErrorInterceptor;
  };
  private cache = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, PendingRequest>();
  private requestIdCounter = 0;

  constructor(config: SDKConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      cache: true,
      cacheTTL: 60000, // 1 minute default
      debug: false,
      headers: {},
      ...config,
    };
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${++this.requestIdCounter}`;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const baseURL = this.config.apiUrl.endsWith('/')
      ? this.config.apiUrl
      : this.config.apiUrl + '/';
    const url = new URL(cleanEndpoint, baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Generate cache key from URL and options
   */
  private getCacheKey(url: string, options: { method?: string; body?: string }): string {
    const method = options.method || 'GET';
    return `${method}:${url}:${JSON.stringify(options.body || '')}`;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Get data from cache
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && this.isCacheValid(entry)) {
      if (this.config.debug) {
        console.log(`[SDK Cache] HIT: ${key}`);
      }
      return entry.data as T;
    }

    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  /**
   * Store data in cache
   */
  private setCache(key: string, data: unknown, ttl: number = this.config.cacheTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    if (this.config.debug) {
      console.log(`[SDK Cache] SET: ${key} (TTL: ${ttl}ms)`);
    }
  }

  /**
   * Clear cache (optionally by pattern)
   */
  public clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }

    if (this.config.debug) {
      console.log(`[SDK Cache] CLEAR: ${pattern || 'all'}`);
    }
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    retries: number = this.config.retries,
    delay: number = this.config.retryDelay
  ): Promise<T> {
    let lastError: SDKError | null = null;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as SDKError;

        // Don't retry if error is not retryable
        if (!lastError.isRetryable()) {
          throw lastError;
        }

        // Don't retry if we've exhausted attempts
        if (attempt === retries) {
          throw lastError;
        }

        // Calculate delay with exponential backoff
        const retryDelay = lastError.getRetryDelay() || delay * Math.pow(2, attempt);

        if (this.config.debug) {
          console.log(
            `[SDK Retry] Attempt ${attempt + 1}/${retries + 1} failed. Retrying in ${retryDelay}ms...`,
            lastError.toJSON()
          );
        }

        await this.sleep(retryDelay);
        attempt++;
      }
    }

    throw lastError;
  }

  /**
   * Make HTTP request with all enhancements
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    requestId?: string
  ): Promise<T> {
    const { params, body, cache = true, retry = true, timeout, ...fetchOptions } = options;
    const url = this.buildURL(endpoint, params);
    const method = fetchOptions.method || 'GET';
    const reqId = requestId || this.generateRequestId();

    // Check for duplicate in-flight requests
    const requestKey = this.getCacheKey(url, { method, body: JSON.stringify(body) });
    const pendingRequest = this.pendingRequests.get(requestKey);
    if (pendingRequest) {
      if (this.config.debug) {
        console.log(`[SDK Request] Deduplicating: ${requestKey}`);
      }
      return pendingRequest.promise as Promise<T>;
    }

    // Check cache for GET requests
    if (method === 'GET' && cache && this.config.cache) {
      const cached = this.getFromCache<T>(requestKey);
      if (cached !== null) {
        return cached;
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutMs = timeout || this.config.timeout;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const requestPromise = (async () => {
      try {
        // Prepare request options
        let requestUrl = url;
        let requestOptions: RequestOptions = {
          ...fetchOptions,
          method,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': reqId,
            ...this.config.headers,
            ...fetchOptions.headers,
          },
          body,
        };

        // Apply request interceptor
        if (this.config.onRequest) {
          const intercepted = await this.config.onRequest(requestUrl, requestOptions);
          requestUrl = intercepted.url;
          requestOptions = intercepted.options;
        }

        if (this.config.debug) {
          console.log(`[SDK Request] ${method} ${requestUrl}`, {
            requestId: reqId,
            body,
            headers: requestOptions.headers,
          });
        }

        // Execute the request with retry logic
        const executeRequest = async () => {
          try {
            let response = await customFetch(requestUrl, {
              method: requestOptions.method,
              headers: requestOptions.headers,
              signal: requestOptions.signal,
              body: requestOptions.body ? JSON.stringify(requestOptions.body) : undefined,
            });

            // Apply response interceptor
            if (this.config.onResponse) {
              response = await this.config.onResponse(response);
            }

            if (!response.ok) {
              throw await createErrorFromResponse(response, reqId);
            }

            const data = await response.json();

            if (this.config.debug) {
              console.log(`[SDK Response] ${method} ${requestUrl}`, {
                requestId: reqId,
                status: response.status,
                data,
              });
            }

            // Cache successful GET requests
            if (method === 'GET' && cache && this.config.cache) {
              this.setCache(requestKey, data);
            }

            return data;
          } catch (error) {
            if (error instanceof SDKError) {
              // Apply error interceptor
              if (this.config.onError) {
                throw await this.config.onError(error);
              }
              throw error;
            }
            throw createNetworkError(error as Error, reqId);
          }
        };

        const result = retry ? await this.executeWithRetry(executeRequest) : await executeRequest();
        return result;
      } finally {
        clearTimeout(timeoutId);
        this.pendingRequests.delete(requestKey);
      }
    })();

    // Store pending request
    this.pendingRequests.set(requestKey, {
      promise: requestPromise,
      controller,
    });

    return requestPromise;
  }

  /**
   * Cancel a pending request
   */
  public cancelRequest(endpoint: string, method: string = 'GET'): void {
    const url = this.buildURL(endpoint);
    const key = this.getCacheKey(url, { method });
    const pending = this.pendingRequests.get(key);
    if (pending) {
      pending.controller.abort();
      this.pendingRequests.delete(key);
      if (this.config.debug) {
        console.log(`[SDK Request] Cancelled: ${key}`);
      }
    }
  }

  /**
   * Cancel all pending requests
   */
  public cancelAllRequests(): void {
    for (const [key, pending] of this.pendingRequests.entries()) {
      pending.controller.abort();
      this.pendingRequests.delete(key);
    }
    if (this.config.debug) {
      console.log('[SDK Request] Cancelled all pending requests');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
      cache: false,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data,
      cache: false,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      cache: false,
    });
  }

  /**
   * Update SDK configuration
   */
  public updateConfig(config: Partial<SDKConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): SDKConfig {
    return { ...this.config };
  }
}
