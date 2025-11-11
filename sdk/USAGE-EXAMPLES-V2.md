# SDK v2.0 - Usage Examples

## Quick Start with New Instance-Based API

```typescript
import { ServiceBookingSDK } from '@your-organization/service-booking-sdk';

// Initialize the SDK (replaces old static method approach)
const sdk = new ServiceBookingSDK({
  apiUrl: 'https://avaliable.pro/api',
  debug: true, // Enable debug logging
  cache: true, // Enable intelligent caching
  cacheTTL: 60000, // Cache for 1 minute
  timeout: 10000, // 10 second timeout
  retries: 3, // Retry failed requests 3 times
});

// Now use the SDK with shared configuration
const tenant = await sdk.tenant.getBySubdomain('demo');
const availability = await sdk.availability.getCalendar(tenant.id);
const booking = await sdk.booking.create({
  tenantId: tenant.id,
  locationId: 1,
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  clientPhone: '+1234567890',
  serviceType: 'consultation',
  startDate: '2024-01-15',
  endDate: '2024-01-15',
  durationHours: 2,
});
```

## Key Features

### 1. Automatic Retry with Exponential Backoff

```typescript
// Automatically retries failed requests
try {
  const data = await sdk.tenant.getBySubdomain('demo');
} catch (error) {
  // Only throws after all retry attempts exhausted
  console.error('Failed after retries:', error);
}
```

### 2. Intelligent Caching

```typescript
// First call hits the API
const tenant1 = await sdk.tenant.getBySubdomain('demo');

// Second call within cache TTL returns cached data
const tenant2 = await sdk.tenant.getBySubdomain('demo'); // Cached!

// Clear cache when needed
sdk.clearCache(); // Clear all
sdk.clearCache('/tenants/'); // Clear by pattern
```

### 3. Request Deduplication

```typescript
// Multiple simultaneous identical requests are deduplicated
const [result1, result2, result3] = await Promise.all([
  sdk.tenant.getBySubdomain('demo'),
  sdk.tenant.getBySubdomain('demo'),
  sdk.tenant.getBySubdomain('demo'),
]); // Only ONE actual API call is made!
```

### 4. Enhanced Error Handling

```typescript
import { SDKError, ErrorType } from '@your-organization/service-booking-sdk';

try {
  await sdk.booking.create(invalidData);
} catch (error) {
  if (error instanceof SDKError) {
    // Get user-friendly message
    console.log(error.getUserMessage());

    // Check if retryable
    if (error.isRetryable()) {
      console.log(`Retry after ${error.getRetryDelay()}ms`);
    }

    // Handle specific error types
    switch (error.type) {
      case ErrorType.VALIDATION_ERROR:
        console.log('Invalid input:', error.details);
        break;
      case ErrorType.NETWORK_ERROR:
        console.log('Check your connection');
        break;
      case ErrorType.RATE_LIMIT_ERROR:
        console.log(`Rate limited. Retry after ${error.details?.retryAfter}s`);
        break;
    }
  }
}
```

### 5. Request Cancellation

```typescript
// Cancel a specific request
sdk.cancelRequest('/tenants/demo');

// Cancel all pending requests (useful on component unmount)
sdk.cancelAllRequests();
```

### 6. Configuration Management

```typescript
// Update configuration dynamically
sdk.updateConfig({
  debug: false,
  timeout: 5000,
  retries: 5,
});

// Get current config
const config = sdk.getConfig();
console.log('Current API URL:', config.apiUrl);
```

### 7. Request/Response Interceptors

```typescript
const sdk = new ServiceBookingSDK({
  apiUrl: 'https://avaliable.pro/api',

  // Add custom headers to all requests
  onRequest: async (url, options) => {
    options.headers = {
      ...options.headers,
      'X-Custom-Header': 'my-value',
      Authorization: `Bearer ${getToken()}`,
    };
    return { url, options };
  },

  // Transform all responses
  onResponse: async (response) => {
    console.log('Response received:', response.status);
    return response;
  },

  // Handle all errors
  onError: async (error) => {
    console.error('SDK Error:', error.toJSON());
    // Send to error tracking service
    trackError(error);
    return error;
  },
});
```

## Full Example: Booking Flow

```typescript
import { ServiceBookingSDK, SDKError, ErrorType } from '@your-organization/service-booking-sdk';

async function createBookingFlow() {
  // Initialize SDK
  const sdk = new ServiceBookingSDK({
    apiUrl: 'https://avaliable.pro/api',
    debug: true,
    cache: true,
  });

  try {
    // 1. Get tenant info
    const tenant = await sdk.tenant.getBySubdomain('demo');
    console.log('Tenant:', tenant.name);

    // 2. Check availability
    const availability = await sdk.availability.getCalendar(tenant.id, '2024-01-01', '2024-01-31');
    console.log(`${availability.length} available slots`);

    // 3. Get touring schedule
    const locations = await sdk.availability.getTouringSchedule(tenant.id);
    console.log('Touring:', locations);

    // 4. Create booking
    const booking = await sdk.booking.create({
      tenantId: tenant.id,
      locationId: locations[0].locationId,
      clientName: 'Jane Doe',
      clientEmail: 'jane@example.com',
      clientPhone: '+1234567890',
      serviceType: 'consultation',
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      durationHours: 2,
      specialRequests: 'Please call before arriving',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'winter-2024',
    });
    console.log('Booking created:', booking.id);

    // 5. Process payment
    const payment = await sdk.payment.create({
      bookingId: booking.id,
      amount: 150,
      currency: 'AUD',
      paymentMethod: 'stripe',
      processorPaymentId: 'pi_abc123',
    });
    console.log('Payment processed:', payment.id);

    // 6. Confirm booking
    await sdk.booking.confirm(booking.id);
    console.log('Booking confirmed!');

    return { booking, payment };
  } catch (error) {
    if (error instanceof SDKError) {
      console.error('Booking failed:', error.getUserMessage());

      if (error.type === ErrorType.VALIDATION_ERROR) {
        console.error('Invalid data:', error.details);
      } else if (error.type === ErrorType.NETWORK_ERROR) {
        console.error('Network issue. Please try again.');
      }
    }
    throw error;
  }
}
```

## Analytics Integration

```typescript
// Initialize analytics session
const sessionId = await sdk.analytics.initialize('demo', {
  utmSource: 'google',
  utmMedium: 'cpc',
  utmCampaign: 'winter-2024',
});

// Track events
await sdk.analytics.track('page_view', {
  page: '/booking',
});

await sdk.analytics.track('booking_started', {
  serviceType: 'consultation',
});

// Get analytics summary
const summary = await sdk.analytics.getSummary('demo', '2024-01-01', '2024-01-31');
console.log('Conversion rate:', summary.conversionRate);
```

## Advanced Analytics

```typescript
// Tenant performance
const performance = await sdk.tenantAnalytics.getPerformance('demo');
console.log('Total bookings:', performance.bookings);
console.log('Conversion rate:', performance.conversionRate);

// Traffic sources
const sources = await sdk.tenantAnalytics.getTrafficSources('demo');
sources.forEach((source) => {
  console.log(`${source.source}/${source.medium}: ${source.conversions} conversions`);
});

// Social media analytics
const posts = await sdk.socialAnalytics.getTopPosts('demo', 10);
posts.forEach((post) => {
  console.log(
    `${post.platform}: ${post.engagement.likes} likes, ${post.conversions.bookings} bookings`
  );
});
```

## Migration from v1.x

### Old Way (Static Methods)

```typescript
import { TenantDataSource } from '@your-organization/service-booking-sdk';

// Had to call static methods
const tenant = await TenantDataSource.getBySubdomain('demo');
```

### New Way (Instance-Based)

```typescript
import { ServiceBookingSDK } from '@your-organization/service-booking-sdk';

// Create SDK instance
const sdk = new ServiceBookingSDK({
  apiUrl: 'https://avaliable.pro/api',
});

// Call instance methods
const tenant = await sdk.tenant.getBySubdomain('demo');
```

### Benefits

1. **Shared Configuration**: All datasources use same config (timeout, retries, cache, etc.)
2. **Better Error Handling**: Enhanced error classes with recovery suggestions
3. **Automatic Retries**: No need to manually retry failed requests
4. **Request Caching**: Reduces API calls and improves performance
5. **Request Deduplication**: Prevents duplicate simultaneous requests
6. **Interceptors**: Add custom logic to all requests/responses
7. **Better TypeScript Support**: Improved type inference and autocomplete

## Best Practices

1. **Create one SDK instance per app** and reuse it:

   ```typescript
   // sdk.ts
   export const sdk = new ServiceBookingSDK({ ... });

   // app.ts
   import { sdk } from './sdk';
   ```

2. **Handle errors appropriately**:

   ```typescript
   try {
     await sdk.booking.create(data);
   } catch (error) {
     if (error instanceof SDKError && error.isRetryable()) {
       // Maybe show a retry button
     }
   }
   ```

3. **Clean up on unmount** (React example):

   ```typescript
   useEffect(() => {
     return () => sdk.cancelAllRequests();
   }, []);
   ```

4. **Use debug mode in development**:

   ```typescript
   const sdk = new ServiceBookingSDK({
     apiUrl: '...',
     debug: process.env.NODE_ENV === 'development',
   });
   ```

5. **Clear cache strategically**:
   ```typescript
   // After creating a booking, clear availability cache
   await sdk.booking.create(data);
   sdk.clearCache('/availability/');
   ```
