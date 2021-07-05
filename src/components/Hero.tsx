import { Flex, Heading } from '@chakra-ui/react';

export const Hero = ({ title }) => (
  <Flex alignItems="center" height="100vh" justifyContent="center">
    <Heading bgClip="text" bgGradient="linear(to-l, #7928CA, #FF0080)" fontSize="10vw">
      {title}
    </Heading>
  </Flex>
);

Hero.defaultProps = {
  title: 'with-chakra-ui'
};
