/**
 * Custom Error Classes for SDK
 * Provides detailed error information with recovery suggestions
 */

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
}

export interface ErrorDetails {
  field?: string;
  code?: string;
  retryable?: boolean;
  retryAfter?: number;
  [key: string]: unknown;
}

export class SDKError extends Error {
  public readonly type: ErrorType;
  public readonly status?: number;
  public readonly details?: ErrorDetails;
  public readonly timestamp: Date;
  public readonly requestId?: string;

  constructor(
    type: ErrorType,
    message: string,
    status?: number,
    details?: ErrorDetails,
    requestId?: string
  ) {
    super(message);
    this.name = 'SDKError';
    this.type = type;
    this.status = status;
    this.details = details;
    this.timestamp = new Date();
    this.requestId = requestId;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SDKError);
    }
  }

  /**
   * Get a user-friendly error message with recovery suggestions
   */
  getUserMessage(): string {
    switch (this.type) {
      case ErrorType.VALIDATION_ERROR:
        return `Validation failed: ${this.message}. Please check your input and try again.`;

      case ErrorType.NETWORK_ERROR:
        return `Network connection failed: ${this.message}. Please check your internet connection and try again.`;

      case ErrorType.TIMEOUT_ERROR:
        return `Request timed out: ${this.message}. The server is taking too long to respond. Please try again.`;

      case ErrorType.AUTHENTICATION_ERROR:
        return `Authentication failed: ${this.message}. Please check your API credentials.`;

      case ErrorType.RATE_LIMIT_ERROR:
        const retryAfter = this.details?.retryAfter || 60;
        return `Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`;

      case ErrorType.NOT_FOUND_ERROR:
        return `Resource not found: ${this.message}. The requested item may have been deleted or doesn't exist.`;

      case ErrorType.API_ERROR:
        return `Server error: ${this.message}. Please try again later or contact support if the issue persists.`;

      case ErrorType.CONFIGURATION_ERROR:
        return `Configuration error: ${this.message}. Please check your SDK configuration.`;

      default:
        return this.message;
    }
  }

  /**
   * Check if this error is retryable
   */
  isRetryable(): boolean {
    if (this.details?.retryable !== undefined) {
      return Boolean(this.details.retryable);
    }

    // By default, these errors are retryable
    return (
      this.type === ErrorType.NETWORK_ERROR ||
      this.type === ErrorType.TIMEOUT_ERROR ||
      this.type === ErrorType.RATE_LIMIT_ERROR ||
      (this.type === ErrorType.API_ERROR && this.status !== undefined && this.status >= 500)
    );
  }

  /**
   * Get suggested retry delay in milliseconds
   */
  getRetryDelay(): number {
    if (this.type === ErrorType.RATE_LIMIT_ERROR && this.details?.retryAfter) {
      return this.details.retryAfter * 1000;
    }

    // Exponential backoff suggestions
    if (this.isRetryable()) {
      return 1000; // Start with 1 second
    }

    return 0;
  }

  /**
   * Convert to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp,
      requestId: this.requestId,
      stack: this.stack,
    };
  }
}

/**
 * Create an SDK error from an HTTP response
 */
export async function createErrorFromResponse(
  response: Response,
  requestId?: string
): Promise<SDKError> {
  let errorData: any;
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: response.statusText };
  }

  const status = response.status;
  const message = errorData.message || errorData.error || response.statusText;

  // Determine error type based on status code
  let type: ErrorType;
  if (status === 401 || status === 403) {
    type = ErrorType.AUTHENTICATION_ERROR;
  } else if (status === 404) {
    type = ErrorType.NOT_FOUND_ERROR;
  } else if (status === 422 || status === 400) {
    type = ErrorType.VALIDATION_ERROR;
  } else if (status === 429) {
    type = ErrorType.RATE_LIMIT_ERROR;
  } else if (status >= 500) {
    type = ErrorType.API_ERROR;
  } else {
    type = ErrorType.API_ERROR;
  }

  const details: ErrorDetails = {
    retryable: status >= 500 || status === 429,
    ...(errorData.details || {}),
  };

  // Extract retry-after header for rate limiting
  if (status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    if (retryAfter) {
      details.retryAfter = parseInt(retryAfter, 10);
    }
  }

  return new SDKError(type, message, status, details, requestId);
}

/**
 * Create an SDK error from a network error
 */
export function createNetworkError(error: Error, requestId?: string): SDKError {
  if (error.name === 'AbortError') {
    return new SDKError(
      ErrorType.TIMEOUT_ERROR,
      'Request was cancelled or timed out',
      undefined,
      { retryable: true },
      requestId
    );
  }

  return new SDKError(
    ErrorType.NETWORK_ERROR,
    error.message || 'Network request failed',
    undefined,
    { retryable: true },
    requestId
  );
}
