# Subdomain Routing with prebooking.pro (Partner template)

This document explains how to configure `prebooking.pro` so that each partner gets their own subdomain (e.g., `partner.prebooking.pro`).

## Domain Configuration

**Domain**: `prebooking.pro` (registered with your registrar)

**Subdomain Pattern**: `{subdomain}.prebooking.pro`

**Example**: `partner.prebooking.pro` → Partner's booking page

### DNS Configuration

Configure wildcard DNS or CNAMEs as needed, with examples provided in the original template.

## Application Configuration

Update tenant detection logic to consider partner domains. Example snippet:

```typescript
// src/tenants/TenantProvider.tsx

const detectTenant = (): string | null => {
  const hostname = window.location.hostname;

  // Check for prebooking.pro subdomains
  if (hostname.endsWith('.prebooking.pro')) {
    const subdomain = hostname.split('.')[0];
    if (subdomain !== 'www' && subdomain !== 'prebooking') {
      return subdomain; // e.g., 'partner' from 'partner.prebooking.pro'
    }
  }

  // Check for custom domains
  if (hostname === 'partner.example.com') {
    return 'partner';
  }

  // Development fallback
  if (hostname === 'localhost') {
    return 'partner'; // Or read from localStorage
  }

  return null;
};
```

## Examples

- **Main site**: `https://prebooking.pro`
- **Partner**: `https://partner.prebooking.pro` OR `https://partner.example.com`

This file is a neutral template for subdomain routing; replace example domains accordingly.
