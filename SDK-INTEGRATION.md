# SDK Integration Guide

The Companion SDK is now available in `/sdk` directory as a separate package. Here's how to use it in this project and other companion sites.

## Local Development (This Project)

Since the SDK is in the same repository, you can use it directly:

### Option 1: TypeScript Path Mapping (Recommended)

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@clairehamilton/companion-sdk": ["./sdk/src/index.ts"]
    }
  }
}
```

Then import:

```typescript
import { TenantDataSource, BookingDataSource } from '@clairehamilton/companion-sdk';
```

### Option 2: Relative Imports

```typescript
import { TenantDataSource } from '../sdk/src/index';
```

## Usage in React Components

### Example: Booking Component

```typescript
// src/components/BookingForm.tsx
import { useState, useEffect } from 'react';
import {
  TenantDataSource,
  AvailabilityDataSource,
  BookingDataSource,
  type Tenant,
  type AvailabilitySlot
} from '@clairehamilton/companion-sdk';

export function BookingForm() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        // Get current tenant
        const currentTenant = await TenantDataSource.getCurrent();
        setTenant(currentTenant);

        // Load available dates for next 3 months
        const today = new Date();
        const threeMonths = new Date(today.setMonth(today.getMonth() + 3));

        const dates = await AvailabilityDataSource.getAvailableDates(
          parseInt(currentTenant.id),
          new Date().toISOString().split('T')[0],
          threeMonths.toISOString().split('T')[0]
        );

        setAvailableDates(dates);
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  async function handleSubmit(formData: FormData) {
    if (!tenant) return;

    const booking = await BookingDataSource.create({
      tenantId: parseInt(tenant.id),
      locationId: parseInt(formData.get('locationId') as string),
      clientName: formData.get('name') as string,
      clientEmail: formData.get('email') as string,
      clientPhone: formData.get('phone') as string,
      serviceType: formData.get('service') as string,
      startDate: formData.get('date') as string,
      endDate: formData.get('date') as string,
      durationHours: parseInt(formData.get('duration') as string),
    });

    console.log('Booking created:', booking);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      {/* Form fields */}
      <select name="date">
        {availableDates.map(date => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>
      {/* More fields... */}
      <button type="submit">Book Now</button>
    </form>
  );
}
```

### Example: Analytics Integration

```typescript
// src/App.tsx
import { useEffect } from 'react';
import { TenantDataSource, AnalyticsDataSource } from '@clairehamilton/companion-sdk';

function App() {
  useEffect(() => {
    async function initAnalytics() {
      const tenant = await TenantDataSource.getCurrent();

      // Extract UTM parameters from URL
      const params = new URLSearchParams(window.location.search);
      const utmParams = {
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
      };

      // Initialize session tracking
      await AnalyticsDataSource.initialize(parseInt(tenant.id), utmParams);
    }

    initAnalytics();
  }, []);

  return <div>{/* Your app */}</div>;
}
```

## Publishing SDK to NPM

To make the SDK available as a real npm package:

1. **Update package.json** with correct repository URL
2. **Login to npm**:

   ```bash
   npm login
   ```

3. **Publish**:

   ```bash
   cd sdk
   npm publish --access public
   ```

4. **Install in other projects**:
   ```bash
   npm install @clairehamilton/companion-sdk
   ```

## Hosting on CDN

For non-build environments, host the built files on a CDN:

### Option 1: GitHub Pages

1. Create `gh-pages` branch
2. Copy `sdk/dist/*` to root
3. Enable GitHub Pages
4. Access at: `https://antonyneal.github.io/sw_website/companion-sdk@1.0.0.js`

### Option 2: DigitalOcean Spaces

1. Upload `sdk/dist/index.mjs` to Spaces
2. Set public read permissions
3. Access at: `https://cdn.clairehamilton.vip/companion-sdk@1.0.0.js`

### Option 3: jsDelivr (GitHub CDN)

Automatically available after pushing to GitHub:

```html
<script type="module">
  import { TenantDataSource } from 'https://cdn.jsdelivr.net/gh/AntonyNeal/sw_website@main/sdk/dist/index.mjs';
</script>
```

## Building Companion Sites

New companion sites can use the SDK immediately:

```bash
# Create new companion site
npm create vite@latest companion-site -- --template react-ts
cd companion-site

# Install SDK (if published to npm)
npm install @clairehamilton/companion-sdk

# Or use CDN in index.html
```

```html
<!-- index.html -->
<script type="module">
  import {
    TenantDataSource,
    AnalyticsDataSource,
  } from 'https://cdn.jsdelivr.net/gh/AntonyNeal/sw_website@main/sdk/dist/index.mjs';

  // Initialize
  const tenant = await TenantDataSource.getBySubdomain('claire');
  await AnalyticsDataSource.initialize(tenant.id);
</script>
```

## API Reference

See [sdk/README.md](../sdk/README.md) for complete API documentation.

## Examples

- **Full example**: [sdk/example.ts](../sdk/example.ts)
- **Integration patterns**: See above React examples
- **Type definitions**: [sdk/src/types.ts](../sdk/src/types.ts)
