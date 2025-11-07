/**
 * Demo Tenant Photos Configuration
 * Professional stock photos for template demonstration
 */
import type { TenantPhotos } from '../../core/types/tenant.types';

export const photos: TenantPhotos = {
  // Hero Photo Configuration with A/B Testing
  hero: {
    control: {
      id: 'hero-main',
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop',
      alt: 'Professional consultation meeting',
      caption: 'Strategic business consultation',
    },
    variants: [
      {
        id: 'hero-variant-1',
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
        alt: 'Team training session',
        weight: 0.3,
      },
      {
        id: 'hero-variant-2',
        url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop',
        alt: 'Professional coaching session',
        weight: 0.3,
      },
    ],
  },

  // Gallery Photos - Service demonstrations
  gallery: [
    {
      id: 'gallery-1',
      url: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=600&fit=crop',
      alt: 'Business strategy workshop',
      caption: 'Strategic planning workshop',
      category: 'workshop',
    },
    {
      id: 'gallery-2',
      url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
      alt: 'Professional training environment',
      caption: 'Skills development training',
      category: 'training',
    },
    {
      id: 'gallery-3',
      url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
      alt: 'Video conference coaching',
      caption: 'Virtual coaching session',
      category: 'coaching',
    },
    {
      id: 'gallery-4',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
      alt: 'Team collaboration session',
      caption: 'Collaborative team building',
      category: 'workshop',
    },
    {
      id: 'gallery-5',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      alt: 'Group discussion and planning',
      caption: 'Strategic group session',
      category: 'consultation',
    },
    {
      id: 'gallery-6',
      url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop',
      alt: 'Professional presentation',
      caption: 'Knowledge sharing session',
      category: 'training',
    },
  ],

  // About/Team photos
  about: {
    id: 'about-main',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop',
    alt: 'Professional office environment',
    caption: 'Modern consultation space',
  },

  // Testimonial/Client photos (generic avatars)
  testimonials: [
    {
      id: 'client-1',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      alt: 'Professional client testimonial',
      caption: 'Satisfied client',
    },
    {
      id: 'client-2',
      url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      alt: 'Business professional testimonial',
      caption: 'Happy client',
    },
    {
      id: 'client-3',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      alt: 'Corporate client testimonial',
      caption: 'Enterprise client',
    },
  ],
};
