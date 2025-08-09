/**
 * Application-wide constants
 */

// Layout constants
export const MOBILE_BOTTOM_NAV_HEIGHT = 80 // Actual height including padding
export const SAFE_AREA_BOTTOM = 20 // Additional safe area for iOS devices
export const MOBILE_PAGE_PADDING_BOTTOM = MOBILE_BOTTOM_NAV_HEIGHT + SAFE_AREA_BOTTOM // 100px total

// Breakpoints
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280
}

// Animation durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500
}

// Z-index levels
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  mobileNav: 50
}

// Colors (for consistency)
export const COLORS = {
  primary: '#a3e635',
  secondary: '#60a5fa',
  background: '#111827',
  surface: '#1f2937',
  text: {
    primary: '#f3f4f6',
    secondary: '#9ca3af',
    muted: '#6b7280'
  },
  error: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981'
}

// Spacing
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px'
}

// Border radius
export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
}

// Font sizes
export const FONT_SIZE = {
  xs: '10px',
  sm: '12px',
  base: '14px',
  lg: '16px',
  xl: '18px',
  '2xl': '20px',
  '3xl': '24px'
}

// Line heights
export const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2
}

// Shadow
export const SHADOW = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)'
}