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
      secondary: 'rgba(15, 15, 15, 0.8)',
    },
    
    // Glass Card Colors
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      backgroundHover: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.1)',
      borderHover: 'rgba(255, 255, 255, 0.15)',
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
        from: '#3b82f6',
        to: '#2563eb',
        hover: '#1d4ed8',
        shadow: 'rgba(59, 130, 246, 0.3)',
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
  glassCard: 'bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl',
  glassCardHover: 'hover:bg-white/8 hover:border-white/15 transition-all duration-300',
  
  // Button Base Classes
  buttonBase: 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-white',
  buttonRed: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-[0_8px_16px_rgba(239,68,68,0.3)] hover:-translate-y-0.5',
  buttonYellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-[0_8px_16px_rgba(234,179,8,0.3)] hover:-translate-y-0.5',
  buttonGreen: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-[0_8px_16px_rgba(34,197,94,0.3)] hover:-translate-y-0.5',
  buttonBlue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_8px_16px_rgba(59,130,246,0.3)] hover:-translate-y-0.5',
  
  // Text Classes
  textPrimary: 'text-white',
  textSecondary: 'text-white/70',
  textTertiary: 'text-white/50',
  textMuted: 'text-white/40',
  
  // Badge Classes
  badgeBase: 'inline-block px-3 py-1 rounded-full text-xs font-semibold border',
  badgeGreen: 'bg-green-500/20 text-green-400 border-green-500/30',
  badgeYellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  badgeRed: 'bg-red-500/20 text-red-400 border-red-500/30',
  badgeBlue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  badgeGray: 'bg-white/10 text-white/70 border-white/20',
  
  // Input Classes
  input: 'bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
  
  // Tab Classes
  tabContainer: 'bg-white/5 rounded-xl border border-white/10',
  tabButton: 'flex-1 px-6 py-4 text-left border-r border-white/10 last:border-r-0 transition-all duration-200',
  tabButtonActive: 'bg-white/10 border-b-2',
  tabButtonInactive: 'hover:bg-white/5',
} as const;

// Component-specific styles
export const components = {
  // Competition Card
  competitionCard: {
    container: `${tw.glassCard} ${tw.glassCardHover} overflow-hidden`,
    image: 'h-32 relative',
    content: 'p-6',
    title: 'font-semibold text-white mb-2',
    description: 'text-sm text-white/70 mb-3',
    details: 'flex items-center justify-between text-sm text-white/70 mb-4',
  },
  
  // Stats Card
  statsCard: {
    container: `${tw.glassCard} p-6 text-center`,
    number: 'text-4xl font-bold text-white mb-2',
    label: 'text-sm text-white/60',
  },
  
  // Post Card
  postCard: {
    container: `${tw.glassCard} p-6 ${tw.glassCardHover}`,
    header: 'flex items-center mb-4',
    avatar: 'w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-blue-500 mr-3',
    author: 'font-semibold text-white',
    time: 'text-sm text-white/50',
    content: 'text-white/80 mb-4 leading-relaxed',
    actions: 'flex gap-5 text-sm text-white/60',
  },
  
  // Tab Navigation
  tabNavigation: {
    container: `${tw.glassCard} mb-8`,
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
    container: `${tw.glassCard} max-w-2xl mx-auto mt-20 p-8`,
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