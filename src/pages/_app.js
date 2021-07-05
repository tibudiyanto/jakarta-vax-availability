import Footer from '../components/Footer'
import ToggleColorMode from '../components/ToggleColorMode'
import theme from '../theme'

import { ChakraProvider } from '@chakra-ui/react'

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ToggleColorMode />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  )
}
