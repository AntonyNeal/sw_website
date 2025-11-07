/**
 * Demo Tenant Configuration
 * Generic professional services tenant for template demonstration
 */

import { content } from './content.config';
import { theme } from './theme.config';
import { photos } from './photos.config';
import type { TenantConfig } from '../../core/types/tenant.types';

export const demoTenant: TenantConfig = {
  id: 'demo',
  name: 'Professional Services Demo',
  subdomain: 'demo',
  content,
  theme,
  photos,
  status: 'active',
  customDomain: 'demo.yourdomain.com',
  features: {
    bookingEnabled: true,
    galleryEnabled: true,
    blogEnabled: false,
    reviewsEnabled: true,
    chatEnabled: false,
  },
  analytics: {
    googleAnalyticsId: 'GA_MEASUREMENT_ID',
    trackingEnabled: true,
  },
};

export default demoTenant;
