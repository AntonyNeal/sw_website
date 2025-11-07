# Service Booking Platform SDK

TypeScript/JavaScript SDK for the Service Booking Platform API. Provides clean, type-safe data sources for building service booking websites and applications.

## Installation

### NPM (recommended for build tools)

```bash
npm install @your-organization/service-booking-sdk
```

### CDN (for direct browser use)

```html
<script type="module" src="https://unpkg.com/@your-organization/service-booking-sdk/dist/index.mjs"></script>
```

### Local Development

```javascript
// Import from local source (when SDK is in same repository)
import { ServiceBookingSDK } from "../sdk/src/index.js";
```

## Quick Start

```javascript
import { ServiceBookingSDK } from "@your-organization/service-booking-sdk";

const sdk = new ServiceBookingSDK({
  apiUrl: "https://your-api-domain.com/api",
  tenantId: "demo"
});

// Get tenant configuration
const config = await sdk.tenant.getConfig();
console.log("Business:", config.businessName);

// Get available services
const services = await sdk.tenant.getServices();
console.log("Services:", services);

// Create a booking
const booking = await sdk.bookings.create({
  serviceId: "service-1",
  datetime: "2024-01-15T10:00:00Z",
  customerInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890"
  }
});
console.log("Booking created:", booking.id);
```

## Configuration

```javascript
const config = {
  apiUrl: "https://your-api-domain.com/api",    // Required: Your API endpoint
  tenantId: "your-tenant-id",                   // Required: Tenant identifier
  timeout: 10000,                               // Optional: Request timeout (ms)
  retries: 3,                                   // Optional: Retry attempts
  debug: false,                                 // Optional: Enable debug logging
  apiKey: "your-api-key",                       // Optional: API key for auth
  headers: {                                    // Optional: Custom headers
    "Custom-Header": "value"
  }
};

const sdk = new ServiceBookingSDK(config);
```

## API Reference

### Tenant Management

#### `sdk.tenant.getConfig()`
Get tenant configuration including business info, branding, and services.

```javascript
const config = await sdk.tenant.getConfig();
// Returns: TenantConfig object
```

#### `sdk.tenant.getServices()`
Get list of available services for the tenant.

```javascript
const services = await sdk.tenant.getServices();
// Returns: Service[] array
```

#### `sdk.tenant.getAvailability(options)`
Check availability for a specific service and date.

```javascript
const availability = await sdk.tenant.getAvailability({
  serviceId: "service-1",
  date: "2024-01-15",
  timezone: "America/New_York"
});
// Returns: Availability object with available slots
```

### Booking Management

#### `sdk.bookings.create(data)`
Create a new booking.

```javascript
const booking = await sdk.bookings.create({
  serviceId: "service-1",
  datetime: "2024-01-15T10:00:00Z",
  duration: 60,
  customerInfo: {
    name: "Customer Name",
    email: "customer@example.com", 
    phone: "+1234567890"
  },
  notes: "Special requests",
  location: {
    type: "business", // or "customer", "remote"
    address: "123 Main St"
  }
});
// Returns: Booking object
```

#### `sdk.bookings.get(bookingId)`
Get booking details by ID.

```javascript
const booking = await sdk.bookings.get("booking-123");
// Returns: Booking object
```

#### `sdk.bookings.update(bookingId, updates)`
Update an existing booking.

```javascript
const updated = await sdk.bookings.update("booking-123", {
  datetime: "2024-01-16T14:00:00Z",
  notes: "Updated notes"
});
// Returns: Updated Booking object
```

#### `sdk.bookings.cancel(bookingId, reason?)`
Cancel a booking.

```javascript
const cancelled = await sdk.bookings.cancel("booking-123", "Customer requested");
// Returns: Cancelled Booking object
```

### Analytics

#### `sdk.analytics.getStats(options)`
Get booking statistics for a date range.

```javascript
const stats = await sdk.analytics.getStats({
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  groupBy: "day" // or "week", "month"
});
// Returns: Analytics stats object
```

#### `sdk.analytics.getRevenue(options)`
Get revenue data for a specific period.

```javascript
const revenue = await sdk.analytics.getRevenue({
  period: "month",
  year: 2024,
  month: 1
});
// Returns: Revenue data object
```

## TypeScript Support

The SDK includes full TypeScript definitions. Import types as needed:

```typescript
import { 
  ServiceBookingSDK, 
  TenantConfig, 
  Service, 
  Booking, 
  BookingData,
  SDKConfig 
} from "@your-organization/service-booking-sdk";

const sdk: ServiceBookingSDK = new ServiceBookingSDK({
  apiUrl: "https://your-api-domain.com/api",
  tenantId: "demo"
});

const booking: Booking = await sdk.bookings.create({
  serviceId: "service-1",
  datetime: "2024-01-15T10:00:00Z",
  customerInfo: {
    name: "John Doe",
    email: "john@example.com"
  }
} as BookingData);
```

## Error Handling

The SDK throws typed errors for different scenarios:

```javascript
import { ServiceBookingSDK, SDKError } from "@your-organization/service-booking-sdk";

try {
  const booking = await sdk.bookings.create(bookingData);
} catch (error) {
  if (error instanceof SDKError) {
    switch (error.type) {
      case "VALIDATION_ERROR":
        console.log("Invalid data:", error.details);
        break;
      case "NETWORK_ERROR":
        console.log("Connection failed:", error.message);
        break;
      case "API_ERROR":
        console.log("Server error:", error.status, error.message);
        break;
      case "TIMEOUT_ERROR":
        console.log("Request timed out");
        break;
      default:
        console.log("Unknown error:", error);
    }
  }
}
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Development Mode

```bash
npm run dev
```

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-username/service-booking-platform-template/issues)
- Documentation: [Full documentation](../README.md)
- Examples: [Usage examples](../SDK-USAGE-GUIDE.md)
