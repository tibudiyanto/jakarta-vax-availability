import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="id">
        <Head>
          <meta charSet="UTF-8" />
          <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
          <meta content="Vaksin Jakarta" name="application-name" />
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="default" name="apple-mobile-web-app-status-bar-style" />
          <meta content="Vaksin Jakarta" name="apple-mobile-web-app-title" />
          <meta content="Jadwal dan Lokasi Vaksin Jakarta" name="description" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta content="#2B5797" name="msapplication-TileColor" />
          <meta content="#ffffff" name="theme-color" />
          <link href="/icons/apple-touch-icon.png" rel="apple-touch-icon" />
          <link href="/icons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/icons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/manifest.json" rel="manifest" />
          <link href="/favicon.ico" rel="shortcut icon" />
        </Head>
        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
