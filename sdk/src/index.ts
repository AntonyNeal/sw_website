/**
 * Companion SDK - Frontend data sources for companion platform
 * @packageDocumentation
 */

// Export new SDK class (primary export)
export { ServiceBookingSDK } from './sdk';
export type { SDKConfig } from './enhancedClient';

// Export enhanced client
export { EnhancedApiClient } from './enhancedClient';

// Export errors
export { SDKError, ErrorType } from './errors';
export type { ErrorDetails } from './errors';

// Export legacy client for backward compatibility
export { ApiClient } from './client';

// Export types
export * from './types';

// Export data sources (for advanced usage)
export { TenantDataSource } from './datasources/tenant';
export { AvailabilityDataSource } from './datasources/availability';
export { LocationDataSource } from './datasources/location';
export { BookingDataSource } from './datasources/booking';
export { PaymentDataSource } from './datasources/payment';
export { AnalyticsDataSource } from './datasources/analytics';
export { TenantAnalyticsDataSource } from './datasources/tenantAnalytics';
export { SocialAnalyticsDataSource } from './datasources/socialAnalytics';

// Export additional types from new datasources
export type {
  TenantPerformance,
  TrafficSource,
  LocationBooking,
  AvailabilityUtilization,
  ConversionFunnelStage,
  ABTestVariant,
  ABTestResult,
} from './datasources/tenantAnalytics';

export type {
  PostPerformance,
  PostEngagement,
  PostConversions,
  PostAttribution,
  PlatformPerformance,
  TopPost,
  TopHashtag,
  DailyMetric,
  FollowerGrowthPoint,
  FollowerGrowthSummary,
} from './datasources/socialAnalytics';

export type { Payment, RefundResponse } from './datasources/payment';

export type { CreateBookingRequest, UpdateStatusRequest } from './datasources/booking';

export type {
  TouringLocation,
  CurrentLocation,
  DateAvailability,
  AvailableDate,
} from './datasources/availability';

export type {
  SessionResponse,
  CreateSessionRequest,
  CreateEventRequest,
} from './datasources/analytics';
