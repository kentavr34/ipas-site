import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="International Psychotherapy Association — certificate programs, relational psychotherapy education, and professional membership."
        />
        <meta name="theme-color" content="#0A0F1E" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
