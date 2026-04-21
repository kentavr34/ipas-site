import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Фирменные цвета IPAS — ярче и ближе к theipi.org:
        // насыщенный синий + сочное золото, белый/кремовый фон
        brand: {
          gold:   '#D4AF37',   // насыщенное золото
          gold2:  '#F5D27A',   // светлое golden-highlight
          gold3:  '#B8912A',   // тёмное золото для текста на светлом
          blue:   '#1E73BE',   // яркий синий IPI-style (ссылки, hover)
          blue2:  '#4A9BE8',   // светлее для бейджей
          navy:   '#0B1E44',   // глубокий navy — основной тёмный фон
          navy2:  '#142B5C',   // навигация / карточки в тёмной теме
          ink:    '#061327',   // самый тёмный — футер, края
          cream:  '#F7F1E0',   // тёплый кремовый (под бумажный сертификат)
          paper:  '#FFFFFF',   // чистый белый для светлой темы
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          muted:   'rgb(var(--surface-muted) / <alpha-value>)',
          border:  'rgb(var(--border) / <alpha-value>)',
        },
        fg: {
          DEFAULT: 'rgb(var(--fg) / <alpha-value>)',
          muted:   'rgb(var(--fg-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-line': 'linear-gradient(90deg, transparent 0%, #C9A24B 50%, transparent 100%)',
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(201,162,75,0.35)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
