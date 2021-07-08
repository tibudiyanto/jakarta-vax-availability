import * as React from 'react';

import Footer from '~components/Footer';
import ToggleColorMode from '~components/ToggleColorMode';
import theme from '~theme';

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps, router }: AppProps) {
  // Hide footer in map page
  const isNotMapPage = React.useMemo(() => router.asPath !== '/map', [router.asPath]);

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(
        registration => {
          console.log('SW regis succeeded:', registration);
        },
        error => {
          console.log('SW regis failed:', error);
        }
      );
    }
  }, []);

  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" name="viewport" />
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <ToggleColorMode />
        <Component {...pageProps} />
        {isNotMapPage && <Footer />}
      </ChakraProvider>
    </>
  );
}
