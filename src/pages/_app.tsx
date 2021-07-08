import * as React from 'react';

import ToggleColorMode from '~components/ToggleColorMode';
import theme from '~theme';

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" name="viewport" />
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <ToggleColorMode />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
