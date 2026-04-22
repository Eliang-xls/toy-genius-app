/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // === Toy Genius Visual Language V2.0 Design Tokens ===
      // Source: Visual Language V2.0 - Natural Earth Tone System
      colors: {
        // Primary: Deep Brown (Natural, organic, premium)
        primary: {
          DEFAULT: '#5D4037',       // Deep brown - main text, primary actions
          light: '#795548',         // Medium brown - secondary text, borders
          dark: '#3E2723',          // Dark brown - emphasis text, dark backgrounds
        },
        // Accent: Natural Green (Science, nature, trust)
        accent: {
          DEFAULT: '#6B8E23',       // Olive green - primary accent, CTAs, highlights
          light: '#9ACD32',         // Yellow-green - hover states, secondary accents
          dark: '#556B2F',          // Dark green - active states, pressed buttons
        },
        // Secondary: Earth Tones
        secondary: {
          DEFAULT: '#D2B48C',       // Tan - secondary accents, tags
          light: '#F5DEB3',         // Wheat - subtle backgrounds, dividers
          dark: '#BC8F8F',          // Rosy brown - warning states
        },
        // Surface: Neutral Palette
        surface: {
          DEFAULT: '#FFFAF0',       // Floral white - main background
          card: '#FFFFFF',          // White - card backgrounds
          dark: '#D1D5DB',          // Gray - unselected filter chips, disabled states
          muted: '#F5F5DC',         // Beige - subtle backgrounds, dividers
          'muted-light': '#FAF0E6', // Linen - very subtle backgrounds
          alt: '#FAF0E6',           // Linen - alternate card backgrounds
        },
        // Text: Color hierarchy
        text: {
          DEFAULT: '#3E2723',       // Dark brown - primary text
          secondary: '#5D4037',     // Brown - secondary text, labels
          muted: '#8D6E63',         // Light brown - placeholder text, disabled
        },
        // Semantic Colors
        success: '#6B8E23',        // Olive green - positive actions, confirmations, high scores
        warning: '#CD853F',        // Peru - caution, medium scores
        danger: '#CD5C5C',         // Indian red - errors, deletions, low scores
        info: '#5F9EA0',           // Cadet blue - information, links
        
        // Gamification Colors
        
        // Age Stage Badges
        'age-0-1': '#9370DB',       // Medium purple - infant
        'age-1-3': '#DB7093',       // Pale violet red - toddler
        'age-3-5': '#3CB371',       // Medium sea green - preschool
        'age-5-8': '#6495ED',       // Cornflower blue - early school
        'age-8+': '#DAA520',        // Goldenrod - school age
        
        // Rarity Tiers (Achievements)
        'rarity-common': '#A9A9A9',   // Dark gray
        'rarity-rare': '#4682B4',     // Steel blue
        'rarity-epic': '#9370DB',     // Medium purple
        'rarity-legendary': '#FFD700', // Gold
        
        // Achievement Tiers
        'achievement-bronze': '#CD7F32', // Bronze
        'achievement-silver': '#C0C0C0', // Silver
        'achievement-gold': '#FFD700',   // Gold
        'achievement-diamond': '#B9E0FF', // Light steel blue
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
        'caption': ['10px', { lineHeight: '14px' }],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
        pill: '9999px',
      },
      spacing: {
        '0': '0px',
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
      boxShadow: {
        'small': '0 1px 2px 0 rgba(93, 64, 55, 0.1)',
        'medium': '0 4px 6px -1px rgba(93, 64, 55, 0.15)',
        'large': '0 8px 10px -2px rgba(93, 64, 55, 0.2)',
      },
    },
  },
  plugins: [],
};