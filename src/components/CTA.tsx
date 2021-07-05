import { Container } from './Container';

import { Button, Link as ChakraLink } from '@chakra-ui/react';

export const CTA = () => (
  <Container bottom="0" flexDirection="row" maxWidth="48rem" position="fixed" py={2} width="100%">
    <ChakraLink flexGrow={1} href="https://chakra-ui.com" isExternal mx={2}>
      <Button bgGradient="linear(to-tr, teal.300,yellow.400)" width="100%">
        chakra-ui
      </Button>
    </ChakraLink>

    <ChakraLink
      flexGrow={3}
      href="https://github.com/vercel/next.js/blob/canary/examples/with-chakra-ui"
      isExternal
      mx={2}
    >
      <Button bgGradient="linear(to-tr, teal.300,yellow.400)" width="100%">
        View Repo
      </Button>
    </ChakraLink>
  </Container>
);
