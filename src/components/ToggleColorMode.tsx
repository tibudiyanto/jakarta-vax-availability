import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Box, Icon, IconButton, useColorMode } from '@chakra-ui/react';

export default function ToggleColorMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box pos="fixed" right={2} top={2}>
      <IconButton
        aria-label="Toggle color mode"
        icon={<Icon as={colorMode == 'dark' ? MoonIcon : SunIcon} />}
        onClick={toggleColorMode}
        rounded="md"
        variant="ghost"
      />
    </Box>
  );
}
