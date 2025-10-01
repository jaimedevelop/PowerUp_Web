// src/styles/theme.ts

/**
 * PowerLift App Theme System
 * Black background with glass morphism cards
 * Red, Yellow, Green, Blue button system
 */

export const theme = {
  // Base Colors
  colors: {
    // Background
    background: {
      primary: '#000000',
      secondary: '#000000',
      texture: 'radial-gradient(1200px_600px_at_50%_-10%, rgba(255,255,255,0.12), rgba(0,0,0,0) 60%), radial-gradient(1000px_500px_at_50%_110%, rgba(255,255,255,0.08), rgba(0,0,0,0) 60%)',
      noise: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 0 0 0.08'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      pattern: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 8px)',
      vignette: 'radial-gradient(120%_80%_at_50%_40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)',
    },
    
    // Glass Card Colors
    glass: {
      background: 'rgba(255,255,255,0.08)',
      backgroundHover: 'rgba(255,255,255,0.12)',
      border: 'rgba(255,255,255,0.16)',
      borderHover: 'rgba(255,255,255,0.22)',
    },
    
    // Text
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
      muted: 'rgba(255, 255, 255, 0.4)',
    },
    
    // Action Buttons
    actions: {
      red: {
        from: '#ef4444',
        to: '#dc2626',
        hover: '#b91c1c',
        shadow: 'rgba(239, 68, 68, 0.3)',
      },
      yellow: {
        from: '#eab308',
        to: '#ca8a04',
        hover: '#a16207',
        shadow: 'rgba(234, 179, 8, 0.3)',
      },
      green: {
        from: '#22c55e',
        to: '#16a34a',
        hover: '#15803d',
        shadow: 'rgba(34, 197, 94, 0.3)',
      },
      blue: {
        from: '#1e40af',
        to: '#1d4ed8',
        hover: '#1e3a8a',
        shadow: 'rgba(30, 64, 175, 0.3)',
      },
    },
    
    // Status Colors
    status: {
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#3b82f6',
    },
    
    // Legacy Purple (for existing components during migration)
    purple: {
      primary: '#a855f7',
      hover: '#9333ea',
    },
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
  },
  
  // Border Radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  
  // Effects
  effects: {
    blur: 'blur(10px)',
    transition: 'all 0.3s ease',
    shadow: {
      sm: '0 4px 6px rgba(0, 0, 0, 0.3)',
      md: '0 8px 16px rgba(0, 0, 0, 0.4)',
      lg: '0 12px 24px rgba(0, 0, 0, 0.5)',
    },
  },
} as const;

// Tailwind Class Utilities
export const tw = {
  // Glass Card Base
  glassCard: 'bg-white/10 backdrop-blur-[12px] border border-white/20 rounded-2xl [box-shadow:inset_0_1px_0_rgba(255,255,255,0.05),0_12px_24px_rgba(0,0,0,0.35)]',
  glassCardHover: 'transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.07),0_16px_32px_rgba(0,0,0,0.45)] hover:scale-[1.02]',

  // Button Base Classes
  buttonBase: 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-white',
  buttonRed: 'bg-gradient-to-r from-[var(--action-red-from)] to-[var(--action-red-to)] hover:from-[var(--action-red-to)] hover:to-[var(--action-red-hover)] hover:shadow-[0_8px_16px_var(--action-red-shadow)] hover:-translate-y-0.5',
  buttonYellow: 'bg-gradient-to-r from-[var(--action-yellow-from)] to-[var(--action-yellow-to)] hover:from-[var(--action-yellow-to)] hover:to-[var(--action-yellow-hover)] hover:shadow-[0_8px_16px_var(--action-yellow-shadow)] hover:-translate-y-0.5',
  buttonGreen: 'bg-gradient-to-r from-[var(--action-green-from)] to-[var(--action-green-to)] hover:from-[var(--action-green-to)] hover:to-[var(--action-green-hover)] hover:shadow-[0_8px_16px_var(--action-green-shadow)] hover:-translate-y-0.5',
  buttonBlue: 'bg-gradient-to-r from-[var(--action-blue-from)] to-[var(--action-blue-to)] hover:from-[var(--action-blue-to)] hover:to-[var(--action-blue-hover)] hover:shadow-[0_8px_16px_var(--action-blue-shadow)] hover:-translate-y-0.5',
  
  // Text Classes
  textPrimary: 'text-white',
  textSecondary: 'text-[color:var(--text-secondary)]',
  textTertiary: 'text-[color:var(--text-tertiary)]',
  textMuted: 'text-[color:var(--text-muted)]',
  
  // Badge Classes
  badgeBase: 'inline-block px-3 py-1 rounded-full text-xs font-semibold border',
  badgeGreen: 'bg-green-500/20 text-green-400 border-green-500/30',
  badgeYellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  badgeRed: 'bg-red-500/20 text-red-400 border-red-500/30',
  badgeBlue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  badgeGray: 'bg-white/10 text-white/70 border-white/20',
  
  // Input Classes
  input: 'bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--action-blue-from)] focus:border-[var(--action-blue-from)]',
  
  // Tab Classes
  tabContainer: 'bg-black rounded-xl border border-white/10',
  tabButton: 'flex-1 px-6 py-4 text-left border-r border-white/10 last:border-r-0 transition-all duration-200',
  tabButtonActive: 'bg-black border-b-2',
  tabButtonInactive: 'hover:bg-black',

  // Global Background Utility
  pageBackground: 'min-h-screen bg-[var(--bg-primary)] text-[color:var(--text-primary)] [background-image:var(--bg-vignette),var(--bg-texture),var(--bg-pattern),var(--bg-noise)] [background-repeat:no-repeat,no-repeat,repeat,repeat] [background-size:100%_100%,1600px_800px,auto,auto] [background-position:center,center,center,center] [background-blend-mode:normal,normal,normal,overlay]',

  featuredGlow: 'ring-1 ring-[color:var(--action-yellow-to)]/40 hover:ring-[color:var(--action-yellow-to)]/60 hover:[box-shadow:0_0_24px_rgba(234,179,8,0.25)]',
} as const;

// Component-specific styles
export const components = {
  // Competition Card
  competitionCard: {
    container: `${tw.glassCard} ${tw.glassCardHover} overflow-hidden bg-[var(--glass-bg)]`,
    image: 'h-32 relative',
    content: 'p-6',
    title: 'font-semibold text-[color:var(--text-primary)] mb-2',
    description: 'text-sm text-[color:var(--text-secondary)] mb-3',
    details: 'flex items-center justify-between text-sm text-[color:var(--text-secondary)] mb-4',
  },

  featuredCard: {
    container: `${tw.glassCard} ${tw.glassCardHover} ${tw.featuredGlow} overflow-hidden bg-[var(--glass-bg)]`,
  },
  
  // Stats Card
  statsCard: {
    container: `${tw.glassCard} p-6 text-center bg-[var(--glass-bg)]`,
    number: 'text-4xl font-bold text-[color:var(--text-primary)] mb-2',
    label: 'text-sm text-[color:var(--text-tertiary)]',
  },
  
  // Post Card
  postCard: {
    container: `${tw.glassCard} p-6 ${tw.glassCardHover} bg-[var(--glass-bg)]`,
    header: 'flex items-center mb-4',
    avatar: 'w-12 h-12 rounded-full bg-gradient-to-r from-[var(--action-red-from)] to-[var(--action-blue-to)] mr-3',
    author: 'font-semibold text-[color:var(--text-primary)]',
    time: 'text-sm text-[color:var(--text-tertiary)]',
    content: 'text-[color:var(--text-secondary)] mb-4 leading-relaxed',
    actions: 'flex gap-5 text-sm text-white/60',
  },
  
  // Tab Navigation
  tabNavigation: {
    container: `${tw.glassCard} mb-8 bg-[var(--glass-bg)]`,
    tabList: 'flex',
    tab: `${tw.tabButton}`,
    tabActive: `${tw.tabButtonActive}`,
    tabInactive: `${tw.tabButtonInactive}`,
    icon: 'w-5 h-5 mr-3',
    label: 'font-medium',
    description: 'text-sm',
  },
  
  // Modal/Dialog
  modal: {
    overlay: 'fixed inset-0 bg-black/80 backdrop-blur-sm',
    container: `${tw.glassCard} max-w-2xl mx-auto mt-20 p-8 bg-[var(--glass-bg)]`,
    title: 'text-2xl font-bold text-white mb-4',
    content: 'text-white/70',
  },
} as const;

// Helper functions for dynamic classes
export const getButtonClass = (variant: 'red' | 'yellow' | 'green' | 'blue') => {
  return `${tw.buttonBase} ${tw[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof tw]}`;
};

export const getBadgeClass = (variant: 'green' | 'yellow' | 'red' | 'blue' | 'gray') => {
  return `${tw.badgeBase} ${tw[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof tw]}`;
};

export const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info') => {
  return theme.colors.status[status];
};

// Animation variants
export const animations = {
  fadeIn: 'animate-[fadeIn_0.3s_ease-in-out]',
  slideUp: 'animate-[slideUp_0.3s_ease-out]',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
} as const;

// Map theme tokens to CSS variables
export const themeVars = {
  '--bg-primary': theme.colors.background.primary,
  '--bg-secondary': theme.colors.background.secondary,
  '--bg-texture': theme.colors.background.texture,
  '--bg-noise': theme.colors.background.noise,
  '--bg-pattern': theme.colors.background.pattern,
  '--bg-vignette': theme.colors.background.vignette,
  '--glass-bg': theme.colors.glass.background,
  '--glass-bg-hover': theme.colors.glass.backgroundHover,
  '--glass-border': theme.colors.glass.border,
  '--glass-border-hover': theme.colors.glass.borderHover,

  '--text-primary': theme.colors.text.primary,
  '--text-secondary': theme.colors.text.secondary,
  '--text-tertiary': theme.colors.text.tertiary,
  '--text-muted': theme.colors.text.muted,

  '--action-red-from': theme.colors.actions.red.from,
  '--action-red-to': theme.colors.actions.red.to,
  '--action-red-hover': theme.colors.actions.red.hover,
  '--action-red-shadow': theme.colors.actions.red.shadow,

  '--action-yellow-from': theme.colors.actions.yellow.from,
  '--action-yellow-to': theme.colors.actions.yellow.to,
  '--action-yellow-hover': theme.colors.actions.yellow.hover,
  '--action-yellow-shadow': theme.colors.actions.yellow.shadow,

  '--action-green-from': theme.colors.actions.green.from,
  '--action-green-to': theme.colors.actions.green.to,
  '--action-green-hover': theme.colors.actions.green.hover,
  '--action-green-shadow': theme.colors.actions.green.shadow,

  // blue is currently black per your preference
  '--action-blue-from': theme.colors.actions.blue.from,
  '--action-blue-to': theme.colors.actions.blue.to,
  '--action-blue-hover': theme.colors.actions.blue.hover,
  '--action-blue-shadow': theme.colors.actions.blue.shadow,
} as const;