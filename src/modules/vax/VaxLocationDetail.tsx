import * as React from 'react';

import { Kuota } from '~/data/types';
import { hasQuota } from '~helpers/QuotaHelpers';

import { VaccinationDataWithDistance } from './types';

import { ArrowBackIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorMode,
  useDisclosure,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { format, formatDistanceToNow, parse } from 'date-fns';
import idLocale from 'date-fns/locale/id';

export interface VaxLocationDetailProps {
  loading: boolean;
  isUserLocationExist: boolean;
  location: VaccinationDataWithDistance;
}

/**
 * `VaxLocationDetail` card, separated from the main VaxLocation component for display on the map page.
 * Accepts the same props as `VaxLocation`
 */
export default function VaxLocationDetail({ loading, isUserLocationExist, location }: VaxLocationDetailProps) {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    nama_lokasi_vaksinasi: namaLokasi,
    alamat_lokasi_vaksinasi: alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    rt: ignored_rt,
    rw: ignored_rw,
    jadwal,
    detail_lokasi,
    last_updated_at: lastUpdated
  } = location;

  const isCurrentLocationHasQuota = hasQuota(jadwal);

  const renderLocationDistance = () => {
    if (loading) {
      return null;
    }

    if (isUserLocationExist && typeof detail_lokasi !== 'undefined' && detail_lokasi.length > 0) {
      return (
        <Tooltip hasArrow label={<Text>Jarak dari lokasi Anda: {detail_lokasi[0].distance} km</Text>}>
          <Text align="right" fontSize="2xl" fontWeight="semibold">
            {detail_lokasi[0].distance} km
          </Text>
        </Tooltip>
      );
    }

    return null;
  };

  const mapsUrl = detail_lokasi?.[0]
    ? `https://www.google.com/maps/search/${encodeURIComponent(`${detail_lokasi[0].lat}, ${detail_lokasi[0].lon}`)}`
    : `https://www.google.com/maps/search/${encodeURIComponent(namaLokasi)}`;

  return (
    <>
      <Flex
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        onClick={onOpen}
        p={4}
        style={{ cursor: 'pointer' }}
      >
        <Stack spacing={2}>
          <Heading as="h2" isTruncated size="md" textTransform="capitalize" whiteSpace="break-spaces">
            {namaLokasi}
          </Heading>
          <Tooltip hasArrow label={new Date(lastUpdated).toString()}>
            <Text as="span" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'} gridArea="timestamp" isTruncated>
              Diperbarui{' '}
              <Text as="time" dateTime={new Date(lastUpdated).toISOString()}>
                {formatDistanceToNow(Date.parse(lastUpdated), { locale: idLocale, addSuffix: true })}
              </Text>
            </Text>
          </Tooltip>
        </Stack>
        <Stack ml={4} spacing={2}>
          {!isCurrentLocationHasQuota && (
            <Box>
              <Badge align="right" colorScheme="red">
                Kuota Habis
              </Badge>
            </Box>
          )}
          {renderLocationDistance()}
        </Stack>
      </Flex>
      <Stack pb={6} px={4} spacing={4}>
        <Stack spacing={1}>
          <Text textTransform="capitalize">
            Kec/Kel: {kecamatan.toLowerCase()} / {kelurahan.toLowerCase()}
          </Text>
          <Text textTransform="capitalize">{wilayah.toLowerCase()}</Text>
        </Stack>
        <Wrap>
          {jadwal.map(({ id: jadwalId, waktu }) => (
            <WrapItem key={jadwalId}>
              <Popover isLazy>
                <PopoverTrigger>
                  <Button size="sm" variant="outline">
                    {jadwalId}
                  </Button>
                </PopoverTrigger>
                <PopoverContent w={['95vw', '30vw']}>
                  <PopoverArrow />
                  <PopoverBody>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Waktu</Th>
                          <Th>Sisa Kuota</Th>
                          <Th>Total Kuota</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {waktu.map(({ id, kuota }) => {
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          const { sisaKuota = 0, totalKuota = 0 } = kuota as Kuota;
                          return (
                            <Tr key={id}>
                              <Td>{id}</Td>
                              <Td>{sisaKuota}</Td>
                              <Td>{totalKuota}</Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </WrapItem>
          ))}
        </Wrap>
      </Stack>

      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="md">
        <DrawerOverlay />
        <DrawerContent>
          <Badge
            fontSize="0.8em"
            onClick={() => {
              onClose();
            }}
            p={4}
            style={{ cursor: 'pointer' }}
          >
            <ArrowBackIcon h={4} w={4} /> Kembali
          </Badge>
          <DrawerHeader borderBottomWidth="1px">
            <Text as="h1" fontSize="xl" fontWeight={700}>
              {namaLokasi}
            </Text>
            <Text as="h3" color="gray.500" fontSize="xs" fontWeight={500} textTransform="capitalize">
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
                      {formatDistanceToNow(Date.parse(lastUpdated), { locale: idLocale, addSuffix: true })}
                    </Text>
                  </Text>
                </Badge>
              </Text>
            </Box>
            <Divider mb={2} />
            <Stack direction="column" spacing={8}>
              {jadwal.map(({ id: jadwalId, waktu }) => (
                <Box key={jadwalId}>
                  <Text as="h3" color="gray.500" fontSize="sm" fontWeight={600} mb={2}>
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
                            <Td color={sisaKuota > 0 ? 'green' : 'red'} fontWeight={800}>
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
    </>
  );
}
