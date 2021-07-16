import * as React from 'react';

import VaxLocationDetail, { VaxLocationDetailProps } from './VaxLocationDetail';
import VaxLocationDetailDrawer from './VaxLocationDetailDrawer';

import { CalendarIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Flex, Link, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';

type VaxLocationProps = VaxLocationDetailProps;

export default function VaxLocation({ loading, location, isUserLocationExist }: VaxLocationProps) {
  const { nama_lokasi_vaksinasi: namaLokasi, detail_lokasi } = location;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const floatingButtonFocusColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  const linkColor = useColorModeValue('blue.500', 'blue.300');
  const linkHoverColor = useColorModeValue('blue.700', 'blue.500');

  const mapsUrl = detail_lokasi?.[0]
    ? `https://www.google.com/maps/search/${encodeURIComponent(`${detail_lokasi[0].lat}, ${detail_lokasi[0].lon}`)}`
    : `https://www.google.com/maps/search/${encodeURIComponent(namaLokasi)}`;

  return (
    <>
      <Flex borderColor={borderColor} borderRadius="md" borderWidth={1} direction="column" overflow="hidden">
        <VaxLocationDetail isUserLocationExist={isUserLocationExist} loading={loading} location={location} />
        <Flex
          borderTop="1px solid"
          borderTopColor={borderColor}
          sx={{
            '> :not([hidden]) ~ :not([hidden])': {
              borderLeftWidth: '1px',
              borderColor
            }
          }}
        >
          <Flex flex="1 1 0%" w={0}>
            <Box
              _focus={{
                outline: 'none',
                backgroundColor: floatingButtonFocusColor
              }}
              _hover={{
                color: linkHoverColor
              }}
              alignItems="center"
              as="button"
              color={linkColor}
              display="inline-flex"
              flex="1 1 0%"
              fontWeight="semibold"
              justifyContent="center"
              onClick={onOpen}
              position="relative"
              py={4}
            >
              <CalendarIcon aria-hidden mx={2} /> <Text>Lihat Jadwal</Text>
            </Box>
          </Flex>
          <Flex flex="1 1 0%" w={0}>
            <Link
              _focus={{
                outline: 'none',
                backgroundColor: floatingButtonFocusColor
              }}
              _hover={{
                color: linkHoverColor
              }}
              alignItems="center"
              color={linkColor}
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
      <VaxLocationDetailDrawer isOpen={isOpen} locationData={location} onClose={onClose} />
    </>
  );
}
