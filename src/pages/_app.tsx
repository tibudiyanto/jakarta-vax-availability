import '../styles/global.css';

import * as React from 'react';

import Footer from '../components/Footer';
import ToggleColorMode from '../components/ToggleColorMode';
import theme from '../theme';

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Hide footer in map page
  const isNotMapPage = React.useMemo(() => router.asPath !== '/map', [router.asPath]);

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
