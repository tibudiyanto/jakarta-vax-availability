import breakpoints from './breakpoints';
import icons from './icons';

import { extendTheme, theme as defaultTheme, ThemeOverride } from '@chakra-ui/react';

export default extendTheme(<ThemeOverride>{
  breakpoints,

  colors: {
    black: '#16161D',
    red: '#e74c3c',
    darkred: '#eaa29b'
  },

  fonts: {
    mono: `'Menlo', ${defaultTheme.fonts.mono}`
  },

  icons,

  styles: {
    global: {
      body: {
        cursor: 'default'
      }
    }
  }
});
