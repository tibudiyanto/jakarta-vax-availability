import breakpoints from './breakpoints';
import icons from './icons';

import { extendTheme, ThemeOverride } from '@chakra-ui/react';

export default extendTheme(<ThemeOverride>{
  breakpoints,

  colors: {
    black: '#16161D',
    red: '#e74c3c',
    darkred: '#eaa29b'
  },

  fonts: {
    //
  },

  icons,

  styles: {
    global: {
      html: {
        scrollBehavior: 'smooth'
      },
      body: {
        cursor: 'default',

        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility'
      }
    }
  }
});
