import type { TenantContent } from '../../core/types/tenant.types';

export const content: TenantContent = {
  name: 'Miss Dylan (Placeholder)',
  tagline: 'A boutique booking experience',
  bio: 'This is a neutral placeholder bio for the Miss Dylan tenant. Replace with partner-provided copy and images. Please ensure all content complies with local laws and site policy.',
  shortBio: 'Boutique booking experience, private and professional.',
  services: [
    {
      id: 'hourly-session',
      name: 'Hourly Session',
      description: 'A tailored session focused on a private and personalised experience.',
      duration: '60 minutes',
      price: 200,
      priceDisplay: '$200/session',
      featured: true,
      icon: 'calendar',
    },
  ],
  pricing: {
    hourly: 200,
    currency: 'AUD',
    customRates: [],
  },
  contact: {
    email: 'bookings@partner-domain.com',
    phone: '',
    phoneDisplay: '',
    availableHours: 'By appointment',
    responseTime: 'Within 24 hours',
    preferredContact: 'email',
  },
  socialMedia: {},
  availability: {
    location: 'Australia',
    willingToTravel: false,
    travelCities: [],
    timezone: 'Australia/Sydney',
  },
  preferences: {
    minNotice: '24 hours',
    depositRequired: false,
    screeningRequired: false,
  },
  seo: {
    title: 'Miss Dylan - Booking',
    description: 'Private and respectful booking experience',
    keywords: ['private', 'booking', 'boutique'],
    ogImage: 'hero-main',
  },
};
