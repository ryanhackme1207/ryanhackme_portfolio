/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#050209",
          dark: "#0b0514",
          purple: "#9d4edd",
          green: "#00f0ff", /* Note: We use neon green/greenish colors for gradient points */
          neonGreen: "#39ff14",
          neonPurple: "#b100e8",
          card: "#120a21",
          text: "#d6cbf5",
          heading: "#ffffff"
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 15px rgba(177, 0, 232, 0.4)',
        'glow-green': '0 0 15px rgba(57, 255, 20, 0.4)',
        'glow-purple-lg': '0 0 30px rgba(177, 0, 232, 0.6)',
        'glow-gradient': '0 0 20px rgba(177, 0, 232, 0.3), 0 0 20px rgba(57, 255, 20, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 6s linear infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          'from, to': { color: 'transparent' },
          '50%': { color: 'inherit' },
        }
      }
    },
  },
  plugins: [],
}
