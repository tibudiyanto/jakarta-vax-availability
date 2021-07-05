import Footer from "../components/Footer";
import ToggleColorMode from "../components/ToggleColorMode";
import theme from "../theme";
import Head from "next/head";

import { ChakraProvider } from "@chakra-ui/react";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <ToggleColorMode />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </>
  );
}
