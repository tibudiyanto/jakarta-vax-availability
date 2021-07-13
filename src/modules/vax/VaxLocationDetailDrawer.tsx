import * as React from 'react';

import { Kuota } from '~/data/types';

import { VaccinationDataWithDistance } from './types';

import { ArrowBackIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { format, formatDistanceToNow, parse } from 'date-fns';
import idLocale from 'date-fns/locale/id';

export interface VaxLocationDetailDrawerProps {
  locationData: VaccinationDataWithDistance;
  isOpen: boolean;
  onClose: () => void;
}

export default function VaxLocationDetailDrawer({ isOpen, onClose, locationData }: VaxLocationDetailDrawerProps) {
  const { colorMode } = useColorMode();
  const subtextColor = useColorModeValue('gray.600', 'gray.300');
  const kuotaAvailableTextColor = useColorModeValue('green.600', 'green.400');
  const kuotaEmptyTextColor = useColorModeValue('red.600', 'red.400');

  const {
    nama_lokasi_vaksinasi: namaLokasi,
    alamat_lokasi_vaksinasi: alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    jadwal,
    detail_lokasi,
    last_updated_at: lastUpdated
  } = locationData;

  const mapsUrl = detail_lokasi?.[0]
    ? `https://www.google.com/maps/search/${encodeURIComponent(`${detail_lokasi[0].lat}, ${detail_lokasi[0].lon}`)}`
    : `https://www.google.com/maps/search/${encodeURIComponent(namaLokasi)}`;
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="md">
      <DrawerOverlay />
      <DrawerContent>
        <Badge
          fontSize="0.8em"
          onClick={() => {
            onClose();
          }}
          p={4}
          style={{
            cursor: 'pointer'
          }}
        >
          <ArrowBackIcon h={4} w={4} />
          Kembali
        </Badge>
        <DrawerHeader borderBottomWidth="1px">
          <Stack direction="column" spacing={2}>
            <Text as="h1" fontSize="xl" fontWeight={700}>
              {namaLokasi}
            </Text>
            <Text as="h3" color={subtextColor} fontSize="xs" fontWeight={500} textTransform="capitalize">
              {alamatLokasi
                ? alamatLokasi.toLowerCase()
                : `Kec. ${kecamatan.toLowerCase()}, Kel. ${kelurahan.toLowerCase()}`}
            </Text>
            <Text as="h3" fontSize="sm" fontWeight={600} textTransform="capitalize">
              {wilayah.toLowerCase()}
            </Text>
            <Link
              _focus={{
                outline: 'none'
              }}
              _hover={{
                color: 'blue.500'
              }}
              color="blue.300"
              fontWeight="semibold"
              href={mapsUrl}
              isExternal
            >
              <Text fontSize="md">
                📍 Cari Lokasi
                <ExternalLinkIcon aria-hidden mx={2} />
              </Text>
            </Link>
          </Stack>
        </DrawerHeader>
        <DrawerBody>
          <Box mb={2}>
            <Text as="h3" fontSize="lg" fontWeight={700}>
              💉 Jadwal Vaksinasi{' '}
              <Badge borderRadius="10">
                <Text
                  as="span"
                  color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                  fontSize="xs"
                  fontWeight={400}
                  gridArea="timestamp"
                  isTruncated
                >
                  <Text as="time" dateTime={new Date(lastUpdated).toISOString()}>
                    {formatDistanceToNow(Date.parse(lastUpdated), {
                      locale: idLocale,
                      addSuffix: true
                    })}
                  </Text>
                </Text>
              </Badge>
            </Text>
          </Box>
          <Divider mb={2} />
          <Stack direction="column" spacing={8}>
            {jadwal.map(({ id: jadwalId, waktu }) => (
              <Box key={jadwalId}>
                <Text as="h3" color={subtextColor} fontSize="sm" fontWeight={600} mb={2}>
                  {format(parse(jadwalId, 'yyyy-MM-dd', new Date()), 'PPPP', { locale: idLocale })}
                </Text>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Waktu</Th>
                      <Th>Sisa Kuota</Th>
                      <Th>Total Kuota</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {waktu.map(({ id, kuota }) => {
                      const { sisaKuota = 0, totalKuota = 0 } = kuota as Kuota;
                      return (
                        <Tr key={id}>
                          <Td>{format(parse(id, 'k:m:s', new Date()), 'p')}</Td>
                          <Td
                            color={sisaKuota != null && sisaKuota > 0 ? kuotaAvailableTextColor : kuotaEmptyTextColor}
                            fontWeight={800}
                          >
                            {sisaKuota}
                          </Td>
                          <Td>{totalKuota}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            ))}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
