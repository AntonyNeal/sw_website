/**
 * SDK Configuration
 * Initialize and export the ServiceBookingSDK instance
 */

import { ServiceBookingSDK } from '../../sdk/src/index';
import config from './app.config';

// Create SDK instance with backend API configuration
export const sdk = new ServiceBookingSDK({
  apiUrl: config.apiBaseUrl,
  debug: import.meta.env.DEV, // Enable debug logging in development
  cache: true, // Enable intelligent caching
  cacheTTL: 60000, // Cache for 1 minute
  timeout: 30000, // 30 second timeout
  retries: 2, // Retry failed requests twice
});

export default sdk;
