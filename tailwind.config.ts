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
        // Фирменные цвета IPAS — шалфейно-зелёная палитра в духе theipi.org.
        // Ключи brand-blue / brand-navy сохранены для обратной совместимости,
        // но значения теперь teal/sage — чтобы не править код страниц.
        brand: {
          gold:   '#D4AF37',   // насыщенное золото (акцент, не меняется)
          gold2:  '#F5D27A',   // светлый golden-highlight
          gold3:  '#B8912A',   // тёмное золото для текста на светлом
          blue:   '#4E8B7A',   // светло-зелёный sage (ссылки, hover)
          blue2:  '#8BAFA0',   // светлее sage для бейджей
          navy:   '#1F4A3E',   // глубокий teal-green — основной тёмный фон
          navy2:  '#2B6454',   // навигация / карточки в тёмной теме
          ink:    '#0F2A23',   // самый тёмный teal — футер, края
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
