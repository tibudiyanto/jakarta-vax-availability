import Footer from '../components/Footer';
import ToggleColorMode from '../components/ToggleColorMode';
import theme from '../theme';
import '../styles/global.css';

import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" name="viewport" />
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <ToggleColorMode />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </>
  );
}
