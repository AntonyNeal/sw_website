/**
 * Demo Tenant Theme Configuration
 * Professional blue theme for template demonstration
 */
import type { TenantTheme } from '../../core/types/tenant.types';

export const theme: TenantTheme = {
  // Color Palette - Professional Blue Theme
  colors: {
    primary: '#2563EB', // Blue-600 - Professional blue
    secondary: '#1E40AF', // Blue-700 - Deeper blue for contrast
    accent: '#3B82F6', // Blue-500 - Lighter blue for highlights
    background: '#FFFFFF', // Pure white background
    text: '#1F2937', // Gray-800 - Dark text for readability
    textLight: '#6B7280', // Gray-500 - Lighter text for subtitles
    success: '#10B981', // Emerald-500 - Success states
    error: '#EF4444', // Red-500 - Error states
    warning: '#F59E0B', // Amber-500 - Warning states
  },

  // Typography
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },

  // Layout Style
  layout: 'modern',

  // Spacing
  spacing: 'comfortable',

  // Border Radius
  borderRadius: '8px',

  // Shadow Intensity
  shadowIntensity: 'medium',
};
