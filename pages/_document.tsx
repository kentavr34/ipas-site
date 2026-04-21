import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo-192.png" />
      </Head>
      <body className="antialiased">
        {/* Скрипт до гидратации — чтобы не было вспышки светлой темы */}
        <script
          // next-themes всё равно прочитает localStorage, но этот скрипт
          // гарантирует что класс .dark проставится до первого рендера.
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var t = localStorage.getItem('theme');
                  var isDark = !t || t === 'dark' || t === 'system';
                  var el = document.documentElement;
                  el.classList.toggle('dark', isDark);
                  el.classList.toggle('light', !isDark);
                } catch (e) {}
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
