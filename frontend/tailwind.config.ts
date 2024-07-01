import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'selector',
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(77.39% 146.71% at 50% -46.71%, var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        button: '0 1px 3px 0 rgba(0, 0, 0, 0.07)',
        card: '0px 2px 6px 0 rgba(0, 0, 0, 0.05), 0px 6px 24px 0 rgba(0, 0, 0, 0.05)',
      },
      colors: {
        brand: {
          600: 'oklch(var(--myds-brand-600))',
          700: 'oklch(var(--myds-brand-700))',
        },
        foreground: 'oklch(var(--myds-black-900))',
        background: {
          DEFAULT: 'oklch(var(--myds-background-50))',
        },
        washed: {
          100: 'oklch(var(--myds-washed-100))',
        },
        outline: {
          200: 'oklch(var(--myds-outline-200))',
          300: 'oklch(var(--myds-outline-300))',
          400: 'oklch(var(--myds-outline-400))',
        },
        dim: {
          500: 'oklch(var(--myds-dim-500))',
        },
        black: {
          700: 'oklch(var(--myds-black-700))',
          800: 'oklch(var(--myds-black-800))',
          900: 'oklch(var(--myds-black-900))',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },
      spacing: {
        4.5: '18px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
