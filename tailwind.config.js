/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05050a',
          900: '#0a0a14',
          800: '#10101f',
          700: '#16162a',
        },
        neon: {
          purple: '#a855f7',
          violet: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#22d3ee',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(168,85,247,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.07) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(600px circle at 50% 0%, rgba(139,92,246,0.25), transparent 60%)',
      },
      boxShadow: {
        neon: '0 0 24px rgba(168,85,247,0.35), 0 0 60px rgba(59,130,246,0.15)',
        'neon-pink': '0 0 24px rgba(236,72,153,0.4)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};