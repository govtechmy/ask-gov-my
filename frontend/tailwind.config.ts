import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import colors from 'tailwindcss/colors';

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
          300: 'oklch(var(--myds-brand-300)/<alpha-value>)',
          200: 'oklch(var(--myds-brand-200)/<alpha-value>)',
          50: 'oklch(var(--myds-brand-50)/<alpha-value>)',
          600: 'oklch(var(--myds-brand-600)/<alpha-value>)',
          700: 'oklch(var(--myds-brand-700)/<alpha-value>)',
        },
        askmygovbrand: {
          600: 'oklch(var(--askmygov-brand-600)/<alpha-value>)',
          700: 'oklch(var(--askmygov-brand-700))',
          300: 'oklch(var(--askmygov-brand-300))',
          200: 'oklch(var(--askmygov-brand-200))',
          50: 'oklch(var(--askmygov-brand-50))',
        },
        danger: {
          600: colors.red[600],
          700: colors.red[700],
          300: 'oklch(var(--danger-300)/<alpha-value>)',
          200: 'oklch(var(--danger-200)/<alpha-value>)',
          100: 'oklch(var(--danger-200)/<alpha-value>)',
          50: 'oklch(var(--danger-50)/<alpha-value>)',
        },
        askmygovtextbrand: {
          600: 'oklch(var(--askmygov-text-brand-600))',
        },
        mydstextbrand: {
          600: 'oklch(var(--myds-text-brand-600))',
        },
        foreground: {
          DEFAULT: 'oklch(var(--myds-black-900))',
          danger: 'oklch(var(--text-danger-600))',
        },
        background: {
          DEFAULT: 'oklch(var(--myds-background-50))',
        },
        washed: {
          100: 'oklch(var(--myds-washed-100))',
        },
        outline: {
          200: 'oklch(var(--myds-outline-200)/<alpha-value>)',
          300: 'oklch(var(--myds-outline-300)/<alpha-value>)',
          400: 'oklch(var(--myds-outline-400)/<alpha-value>)',
        },
        dim: {
          500: 'oklch(var(--myds-dim-500))',
        },
        black: {
          700: 'oklch(var(--myds-black-700))',
          800: 'oklch(var(--myds-black-800))',
          900: 'oklch(var(--myds-black-900))',
        },
        white: {
          DEFAULT: 'oklch(var(--myds-white))',
          forcewhite: 'oklch(var(--myds-forcewhite))',
          focuswhite100: 'oklch(var(--myds-focuswhite-100))',
          focuswhite200: 'oklch(var(--myds-focuswhite-200))',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },
      fontSize: {
        xs: ['12px', '18px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '26px'],
        xl: ['20px', '30px'],
        hxs: ['24px', '32px'],
        hsm: ['30px', '38px'],
        hmd: ['36px', '44px'],
        hlg: ['48px', '60px'],
        hxl: ['60px', '72px'],
      },
      spacing: {
        4.5: '18px',
      },
      lineHeight: {
        9.5: '38px',
        7.5: '30px',
        6.5: '26px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
