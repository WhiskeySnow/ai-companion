import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wechat: {
          green: '#07C160',
          bubble: '#95EC69',
          bg: '#EDEDED',
          sidebar: '#2C2C2C',
        },
        background: {
          DEFAULT: '#EDEDED',
          secondary: '#F5F5F5',
        },
      },
      animation: {
        'pulse-dot': 'pulse 1.4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'typing': 'typing 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' },
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
