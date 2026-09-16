/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#7c87ff',
          light: '#9da7ff',
          hover: '#909bff',
          dark: '#545fc4',
        },
        secondary: {
          DEFAULT: '#5c68e6',
          light: '#7e89f8',
          hover: '#6f7cf0',
          dark: '#3d46b8',
        },
        tertiary: {
          DEFAULT: '#2fd5f6',
          light: '#72e5fc',
          hover: '#4ddbf8',
          dark: '#0aa1c2',
        },
        accent: {
          DEFAULT: '#7c87ff',
          hover: '#909bff',
        },
        nocturne: {
          bg: '#0c0d14',
          canvas: '#0f1019',
          sidebar: '#12131e',
          surface: '#161724',
          card: '#1a1b2b',
          cardHover: '#212338',
          border: '#272a42',
          borderLight: '#373b5c',
          muted: '#676d94',
          subtext: '#989fc2',
          text: '#e2e6ff',
          bright: '#f4f6ff',
        },
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(#272a42 1px, transparent 1px)',
        'synth-gradient': 'linear-gradient(135deg, #7c87ff 0%, #5c68e6 50%, #2fd5f6 100%)',
        'glow-gradient': 'radial-gradient(circle at 50% 0%, rgba(124, 135, 255, 0.15), transparent 70%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
