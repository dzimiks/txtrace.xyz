import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/ui/toaster';
import { TooltipProvider } from '@/ui/tooltip';
import { GoogleAnalytics } from '@next/third-parties/google';
import '../styles/main.css';

// Shim requestIdleCallback in Safari
if (typeof window !== 'undefined' && !('requestIdleCallback' in window)) {
  // @ts-ignore
  window.requestIdleCallback = fn => setTimeout(fn, 1);
  // @ts-ignore
  window.cancelIdleCallback = e => clearTimeout(e);
}

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />

        <link rel="shortcut icon" type="image/x-icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicons/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/favicons/android-chrome-512x512.png"
        />
        <meta name="robots" content="index,follow" />
        <meta charSet="utf-8" />
      </Head>
      <TooltipProvider>
        <Component {...pageProps} />
        <GoogleAnalytics gaId="G-3Z7RLDTEPH" />
      </TooltipProvider>
      <Analytics />
      <Toaster />
    </>
  );
}

export default App;
