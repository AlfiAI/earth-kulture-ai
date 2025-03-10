
// Typography
export const typography = {
  fontFamily: {
    sans: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
};

// Spacing system
export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

// Effects
export const effects = {
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    primary: '0 10px 15px -3px rgba(16, 185, 129, 0.15)',
  },
  gradients: {
    primary: 'linear-gradient(to right, var(--primary), var(--primary-light))',
    card: 'linear-gradient(to bottom right, var(--card), var(--card-light))',
    feature: 'linear-gradient(to bottom right, var(--primary-light), var(--secondary-light))',
    hero: 'linear-gradient(to right, var(--primary), var(--cyan-500))',
    buttonHover: 'linear-gradient(to right, var(--emerald-600), var(--cyan-600))',
  },
  glassmorphism: {
    light: 'bg-white/80 backdrop-blur-md border border-white/20',
    medium: 'bg-white/60 backdrop-blur-md border border-white/30',
    dark: 'bg-black/40 backdrop-blur-md border border-white/10',
  },
};

// Animation durations
export const durations = {
  fast: '0.15s',
  normal: '0.3s',
  slow: '0.5s',
  verySlow: '0.8s',
};

// Border radius
export const radius = {
  none: '0',
  sm: '0.125rem',
  default: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Common classes for consistent styling
export const commonClasses = {
  cardBase: 'bg-gradient-to-br from-card to-card/80 border-primary/10 shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all',
  glassmorphism: 'bg-white/95 backdrop-blur-md border border-primary/10',
  primaryButton: 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-primary/20 text-white',
  outlineButton: 'border border-primary/20 hover:border-primary/40 hover:bg-primary/5',
  headingGradient: 'bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent',
  pageContainer: 'container mx-auto px-4 py-6',
  sectionContainer: 'container mx-auto px-4 py-8 md:py-12',
};
