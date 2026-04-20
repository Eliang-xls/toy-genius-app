/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // === Toy Legion Premium Design Tokens ===
      // Source: ui-ux-pro-max research — Premium Kids palette
      colors: {
        // Primary: Warm Charcoal (not pure black)
        primary: {
          DEFAULT: '#1C1917',
          light: '#292524',
          dark: '#0C0A09',
        },
        // Accent: Warm Gold
        accent: {
          DEFAULT: '#A16207',
          light: '#CA8A04',
          dark: '#854D0E',
        },
        // Surfaces
        surface: {
          DEFAULT: '#FAFAF9',       // Warm white bg
          card: '#FFFFFF',
          dark: '#D1D5DB',          // Unselected filter chips
          muted: '#E8ECF0',
          'muted-light': '#F1F5F9',
          alt: '#F5F5F4',           // Alt surface for cards
        },
        // Text
        text: {
          DEFAULT: '#0C0A09',       // Foreground
          secondary: '#64748B',     // Muted foreground
          muted: '#94A3B8',
        },
        // Semantic
        success: '#059669',
        warning: '#D97706',
        danger: '#DC2626',
        // Age stage colors (gamification)
        'age-0-1': '#8B5CF6',       // Violet
        'age-1-3': '#EC4899',       // Pink
        'age-3-5': '#10B981',       // Emerald
        'age-5-8': '#3B82F6',       // Blue
        'age-8+': '#F59E0B',        // Amber
        // Card rarity (gamification)
        'rarity-common': '#94A3B8',
        'rarity-rare': '#3B82F6',
        'rarity-epic': '#8B5CF6',
        'rarity-legendary': '#F59E0B',
      },
      fontFamily: {
        headline: ['PlayfairDisplay_700Bold', 'PlayfairDisplay_600SemiBold', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em' }],
        'headline-lg': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
        'headline-md': ['22px', { lineHeight: '28px' }],
        'headline-sm': ['18px', { lineHeight: '24px' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        'body-md': ['14px', { lineHeight: '20px' }],
        'label': ['12px', { lineHeight: '16px', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
        pill: '9999px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },
    },
  },
  plugins: [],
};
