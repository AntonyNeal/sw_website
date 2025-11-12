/**
 * Service Booking SDK - Main SDK Class
 * Instance-based SDK with shared configuration across all data sources
 */

import { EnhancedApiClient, SDKConfig } from './enhancedClient';
import { TenantDataSource } from './datasources/tenant';
import { AvailabilityDataSource } from './datasources/availability';
import type { CreateBookingRequest, UpdateStatusRequest } from './datasources/booking';
import { BookingDataSource } from './datasources/booking';
import type { RefundResponse } from './datasources/payment';
import { PaymentDataSource } from './datasources/payment';
import type {
  CreateSessionRequest,
  SessionResponse,
  CreateEventRequest,
} from './datasources/analytics';
import { AnalyticsDataSource } from './datasources/analytics';
import { TenantAnalyticsDataSource } from './datasources/tenantAnalytics';
import { SocialAnalyticsDataSource } from './datasources/socialAnalytics';
import { SimplybookDataSource } from './datasources/simplybook';

export class ServiceBookingSDK {
  private client: EnhancedApiClient;

  // Data source instances
  public readonly tenant: TenantDataSourceInstance;
  public readonly availability: AvailabilityDataSourceInstance;
  public readonly location: LocationDataSourceInstance;
  public readonly booking: BookingDataSourceInstance;
  public readonly payment: PaymentDataSourceInstance;
  public readonly analytics: AnalyticsDataSourceInstance;
  public readonly tenantAnalytics: TenantAnalyticsDataSourceInstance;
  public readonly socialAnalytics: SocialAnalyticsDataSourceInstance;
  public readonly simplybook: SimplybookDataSourceInstance;

  constructor(config: SDKConfig) {
    this.client = new EnhancedApiClient(config);

    // Initialize data sources with shared client
    this.tenant = new TenantDataSourceInstance(this.client);
    this.availability = new AvailabilityDataSourceInstance(this.client);
    this.location = new LocationDataSourceInstance(this.client);
    this.booking = new BookingDataSourceInstance(this.client);
    this.payment = new PaymentDataSourceInstance(this.client);
    this.analytics = new AnalyticsDataSourceInstance(this.client);
    this.tenantAnalytics = new TenantAnalyticsDataSourceInstance(this.client);
    this.socialAnalytics = new SocialAnalyticsDataSourceInstance(this.client);
    this.simplybook = new SimplybookDataSourceInstance(this.client);
  }

  /**
   * Update SDK configuration
   */
  public updateConfig(config: Partial<SDKConfig>): void {
    this.client.updateConfig(config);
  }

  /**
   * Get current configuration
   */
  public getConfig(): SDKConfig {
    return this.client.getConfig();
  }

  /**
   * Clear cache (optionally by pattern)
   */
  public clearCache(pattern?: string): void {
    this.client.clearCache(pattern);
  }

  /**
   * Cancel a pending request
   */
  public cancelRequest(endpoint: string, method?: string): void {
    this.client.cancelRequest(endpoint, method);
  }

  /**
   * Cancel all pending requests
   */
  public cancelAllRequests(): void {
    this.client.cancelAllRequests();
  }
}

// Instance-based data source classes
class TenantDataSourceInstance {
  constructor(private client: EnhancedApiClient) {}

  async getBySubdomain(subdomain: string) {
    return TenantDataSource.getBySubdomain.call({ client: this.client }, subdomain);
  }

  async getByDomain(domain: string) {
    return TenantDataSource.getByDomain.call({ client: this.client }, domain);
  }

  async getCurrent() {
    return TenantDataSource.getCurrent.call({ client: this.client });
  }

  async list(page = 1, limit = 20) {
    return TenantDataSource.list.call({ client: this.client }, page, limit);
  }
}

class AvailabilityDataSourceInstance {
  constructor(private client: EnhancedApiClient) {}

  async getCalendar(tenantId: string | number, startDate?: string, endDate?: string) {
    return AvailabilityDataSource.getCalendar.call(
      { client: this.client },
      tenantId,
      startDate,
      endDate
    );
  }

  async checkDate(tenantId: string | number, date: string) {
    return AvailabilityDataSource.checkDate.call({ client: this.client }, tenantId, date);
  }

  async getAvailableDates(tenantId: string | number, startDate: string, endDate: string) {
    return AvailabilityDataSource.getAvailableDates.call(
      { client: this.client },
      tenantId,
      startDate,
      endDate
    );
  }

  async getTouringSchedule(tenantId: string | number, daysAhead = 90) {
    return AvailabilityDataSource.getTouringSchedule.call(
      { client: this.client },
      tenantId,
      daysAhead
    );
  }

  async getCurrentLocation(tenantId: string | number) {
    return AvailabilityDataSource.getCurrentLocation.call({ client: this.client }, tenantId);
  }

  async checkAvailabilityForDate(tenantId: string | number, date: string, durationHours?: number) {
    return AvailabilityDataSource.checkAvailabilityForDate.call(
      { client: this.client },
      tenantId,
      date,
      durationHours
    );
  }

  async getAvailableDatesList(tenantId: string | number, startDate: string, endDate: string) {
    return AvailabilityDataSource.getAvailableDatesList.call(
      { client: this.client },
      tenantId,
      startDate,
      endDate
    );
  }
}

class LocationDataSourceInstance {
  constructor(private client: EnhancedApiClient) {}

  async getAll(tenantId: string | number, filters?: Record<string, string | number>) {
    return this.client.get(`/locations/${tenantId}`, filters);
  }

  async getById(locationId: string | number) {
    return this.client.get(`/locations/details/${locationId}`);
  }
}

class BookingDataSourceInstance {
  constructor(private client: EnhancedApiClient) {}

  async create(booking: Parameters<typeof BookingDataSource.create>[0]) {
    return BookingDataSource.create.call({ client: this.client }, booking);
  }

  async getById(bookingId: string | number) {
    return BookingDataSource.getById.call({ client: this.client }, bookingId);
  }

  async updateStatus(
    bookingId: string | number,
    update: Parameters<typeof BookingDataSource.updateStatus>[1]
  ) {
    return BookingDataSource.updateStatus.call({ client: this.client }, bookingId, update);
  }

  async getByTenant(tenantId: string | number, status?: string, page = 1, limit = 20) {
    return BookingDataSource.getByTenant.call(
      { client: this.client },
      tenantId,
      status,
      page,
      limit
    );
  }

  async cancel(bookingId: string | number, reason?: string) {
    return BookingDataSource.cancel.call({ client: this.client }, bookingId, reason);
  }

  async confirm(bookingId: string | number) {
    return BookingDataSource.confirm.call({ client: this.client }, bookingId);
  }
}

class PaymentDataSourceInstance {
  constructor(private client: EnhancedApiClient) {}

  async create(payment: Parameters<typeof PaymentDataSource.create>[0]) {
    return PaymentDataSource.create.call({ client: this.client }, payment);
  }

  async getById(paymentId: string | number) {
    return PaymentDataSource.getById.call({ client: this.client }, paymentId);
  }

  async getByBooking(bookingId: string | number) {
    return PaymentDataSource.getByBooking.call({ client: this.client }, bookingId);
  }

  async getByTenant(tenantId: string | number, status?: string, page = 1, limit = 20) {
    return PaymentDataSource.getByTenant.call(
      { client: this.client },
      tenantId,
      status,
      page,
      limit
    );
  }

  async refund(
    paymentId: string | number,
    refundData?: Parameters<typeof PaymentDataSource.refund>[1]
  ) {
    return PaymentDataSource.refund.call({ client: this.client }, paymentId, refundData);
  }

  async getStatus(paymentId: string | number) {
    return PaymentDataSource.getStatus.call({ client: this.client }, paymentId);
  }

  async isCompleted(paymentId: string | number) {
    return PaymentDataSource.isCompleted.call({ client: this.client }, paymentId);
  }

  async getTotalRevenue(tenantId: string | number, startDate?: string, endDate?: string) {
    return PaymentDataSource.getTotalRevenue.call(
      { client: this.client },
      tenantId,
      startDate,
      endDate
    );
  }
}

class AnalyticsDataSourceInstance {
  constructor(private client: EnhancedApiClient) {}

  async createSession(data: Parameters<typeof AnalyticsDataSource.createSession>[0]) {
    return AnalyticsDataSource.createSession.call({ client: this.client }, data);
  }

  async trackEvent(event: Parameters<typeof AnalyticsDataSource.trackEvent>[0]) {
    return AnalyticsDataSource.trackEvent.call({ client: this.client }, event);
  }

  async track(
    eventType: string,
    eventData?: Record<string, unknown>,
    pageUrl?: string,
    pageTitle?: string
  ) {
    return AnalyticsDataSource.track.call(
      { client: this.client },
      eventType,
      eventData,
      pageUrl,
      pageTitle
    );
  }

  async getSession(sessionId: string) {
    return AnalyticsDataSource.getSession.call({ client: this.client }, sessionId);
  }

  async getSummary(tenantId: string | number, startDate?: string, endDate?: string) {
    return AnalyticsDataSource.getSummary.call(
      { client: this.client },
      tenantId,
      startDate,
      endDate
    );
  }

  async initialize(tenantId: string | number, utmParams?: Record<string, string>) {
    return AnalyticsDataSource.initialize.call({ client: this.client }, tenantId, utmParams);
  }

  getSessionId() {
    return AnalyticsDataSource.getSessionId();
  }

  getSessionToken() {
    return AnalyticsDataSource.getSessionToken();
  }
}

class TenantAnalyticsDataSourceInstance {
  constructor(private client: EnhancedApiClient) {}

  async getPerformance(tenantId: string | number) {
    return TenantAnalyticsDataSource.getPerformance.call({ client: this.client }, tenantId);
  }

  async getTrafficSources(tenantId: string | number) {
    return TenantAnalyticsDataSource.getTrafficSources.call({ client: this.client }, tenantId);
  }

  async getLocationBookings(tenantId: string | number) {
    return TenantAnalyticsDataSource.getLocationBookings.call({ client: this.client }, tenantId);
  }

  async getAvailabilityUtilization(
    tenantId: string | number,
    startDate?: string,
    endDate?: string
  ) {
    return TenantAnalyticsDataSource.getAvailabilityUtilization.call(
      { client: this.client },
      tenantId,
      startDate,
      endDate
    );
  }

  async getConversionFunnel(tenantId: string | number, startDate?: string, endDate?: string) {
    return TenantAnalyticsDataSource.getConversionFunnel.call(
      { client: this.client },
      tenantId,
      startDate,
      endDate
    );
  }

  async getABTestResults(tenantId: string | number) {
    return TenantAnalyticsDataSource.getABTestResults.call({ client: this.client }, tenantId);
  }
}

class SocialAnalyticsDataSourceInstance {
  constructor(private client: EnhancedApiClient) {}

  async getPostPerformance(tenantId: string | number, platform?: string, limit = 50) {
    return SocialAnalyticsDataSource.getPostPerformance.call(
      { client: this.client },
      tenantId,
      platform,
      limit
    );
  }

  async getPlatformPerformance(tenantId: string | number) {
    return SocialAnalyticsDataSource.getPlatformPerformance.call({ client: this.client }, tenantId);
  }

  async getTopPosts(tenantId: string | number, limit = 10) {
    return SocialAnalyticsDataSource.getTopPosts.call({ client: this.client }, tenantId, limit);
  }

  async getTopHashtags(tenantId: string | number, days = 90, limit = 20) {
    return SocialAnalyticsDataSource.getTopHashtags.call(
      { client: this.client },
      tenantId,
      days,
      limit
    );
  }

  async getDailyMetrics(
    tenantId: string | number,
    platform?: string,
    startDate?: string,
    endDate?: string,
    limit = 90
  ) {
    return SocialAnalyticsDataSource.getDailyMetrics.call(
      { client: this.client },
      tenantId,
      platform,
      startDate,
      endDate,
      limit
    );
  }

  async getFollowerGrowth(tenantId: string | number, platform?: string, days = 90) {
    return SocialAnalyticsDataSource.getFollowerGrowth.call(
      { client: this.client },
      tenantId,
      platform,
      days
    );
  }
}

class SimplybookDataSourceInstance {
  constructor(private client: EnhancedApiClient) {}

  async getServices() {
    return SimplybookDataSource.getServices.call({ client: this.client });
  }

  async getServiceById(serviceId: string | number) {
    return SimplybookDataSource.getServiceById.call({ client: this.client }, serviceId);
  }

  async getCompanyInfo() {
    return SimplybookDataSource.getCompanyInfo.call({ client: this.client });
  }

  async getTimeSlots(serviceId: string | number, date: string, providerId?: string | number) {
    return SimplybookDataSource.getTimeSlots.call({ client: this.client }, serviceId, date, providerId);
  }

  async getProviders() {
    return SimplybookDataSource.getProviders.call({ client: this.client });
  }

  async getProvidersForService(serviceId: string | number) {
    return SimplybookDataSource.getProvidersForService.call({ client: this.client }, serviceId);
  }

  async createBooking(bookingData: Parameters<typeof SimplybookDataSource.createBooking>[0]) {
    return SimplybookDataSource.createBooking.call({ client: this.client }, bookingData);
  }

  async getBookingById(bookingId: string | number) {
    return SimplybookDataSource.getBookingById.call({ client: this.client }, bookingId);
  }

  async getBookingByCode(bookingCode: string) {
    return SimplybookDataSource.getBookingByCode.call({ client: this.client }, bookingCode);
  }

  async cancelBooking(bookingId: string | number) {
    return SimplybookDataSource.cancelBooking.call({ client: this.client }, bookingId);
  }

  async getIntakeFormFields(serviceId: string | number) {
    return SimplybookDataSource.getIntakeFormFields.call({ client: this.client }, serviceId);
  }

  async getAvailableDates(serviceId: string | number, startDate: string, endDate: string, providerId?: string | number) {
    return SimplybookDataSource.getAvailableDates.call({ client: this.client }, serviceId, startDate, endDate, providerId);
  }

  async checkTimeAvailability(serviceId: string | number, datetime: string, providerId?: string | number) {
    return SimplybookDataSource.checkTimeAvailability.call({ client: this.client }, serviceId, datetime, providerId);
  }

  async getCompanyParam(param: string) {
    return SimplybookDataSource.getCompanyParam.call({ client: this.client }, param);
  }

  async getBookings(startDate: string, endDate: string) {
    return SimplybookDataSource.getBookings.call({ client: this.client }, startDate, endDate);
  }
}
