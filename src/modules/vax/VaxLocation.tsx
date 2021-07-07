import * as React from 'react';

import VaxLocationDetail, { VaxLocationDetailProps } from './VaxLocationDetail';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';

type VaxLocationProps = VaxLocationDetailProps;

export default function VaxLocation({ loading, location, isUserLocationExist }: VaxLocationProps) {
  const { nama_lokasi_vaksinasi: namaLokasi, detail_lokasi } = location;

  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  const mapsUrl = detail_lokasi?.[0]
    ? `https://www.google.com/maps/search/${encodeURIComponent(`${detail_lokasi[0].lat}, ${detail_lokasi[0].lon}`)}`
    : `https://www.google.com/maps/search/${encodeURIComponent(namaLokasi)}`;

  return (
    <Flex borderColor={borderColor} borderRadius="md" borderWidth={1} direction="column" overflow="hidden">
      <VaxLocationDetail isUserLocationExist={isUserLocationExist} loading={loading} location={location} />
      <Flex
        borderTop="1px solid"
        borderTopColor={borderColor}
        sx={{
          '> :not([hidden]) ~ :not([hidden])': {
            borderRightWidth: '1px',
            borderLeftWidth: '1px',
            borderColor
          }
        }}
      >
        <Flex flex="1 1 0%" w={0}>
          <Link
            _hover={{
              color: 'blue.500'
            }}
            alignItems="center"
            color="blue.300"
            display="inline-flex"
            flex="1 1 0%"
            fontWeight="semibold"
            href={mapsUrl}
            isExternal
            justifyContent="center"
            position="relative"
            py={4}
          >
            <ExternalLinkIcon aria-hidden mx={2} /> <Text>Lihat Lokasi</Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
