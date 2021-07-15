/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/extensions */
import vercelBanner from '~/assets/images/powered-by-vercel.svg';
import config from '~config';

import { Img, Link, Stack, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Stack align="center" fontSize="sm" justify="center" px={2} py={[8, 16]} spacing={4} textAlign="center">
      <Text>
        Made using Next.js and Chakra UI.{' '}
        <Link href={config.repoUrl} isExternal>
          View repository
        </Link>
      </Text>
      <Link href={config.vercelBannerUrl} isExternal>
        <Img alt="Powered by Vercel" height={8} src={(vercelBanner as StaticImageData).src} />
      </Link>
    </Stack>
  );
}
