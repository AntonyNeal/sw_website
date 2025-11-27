import type { TenantPhotos } from '../../core/types/tenant.types';

export const photos: TenantPhotos = {
  hero: {
    control: {
      id: 'hero-main',
      url: 'https://images.unsplash.com/photo-1541542684-efb8f10b53ad?w=1200&h=800&fit=crop',
      alt: 'Warm boutique hospitality experience',
      caption: 'A welcoming and private setting',
    },
    variants: [],
  },
  gallery: [],
  about: {
    id: 'about-main',
    url: 'https://images.unsplash.com/photo-1520975911836-9b56ea6b5d06?w=600&h=400&fit=crop',
    alt: 'Elegant boutique environment',
    caption: 'An intimate and comfortable setting',
  },
  testimonials: [],
};
