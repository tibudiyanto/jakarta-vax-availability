import * as React from 'react';

import { hasQuota } from '~helpers/QuotaHelpers';

import { ExternalLinkIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  Grid,
  Heading,
  HStack,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
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
  useColorModeValue,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { DetailLokasi, Kuota, VaccinationData } from 'data/types';
import { formatDistanceToNow } from 'date-fns';
import idLocale from 'date-fns/locale/id';

interface DetailLokasiWithDistance extends DetailLokasi {
  distance?: string | null;
}

export interface VaccinationDataWithDistance extends Omit<VaccinationData, 'detail_lokasi'> {
  detail_lokasi?: DetailLokasiWithDistance[];
}

interface Props {
  loading: boolean;
  isUserLocationExist: boolean;
  location: VaccinationDataWithDistance;
}

export default function VaxLocation({ loading, location, isUserLocationExist }: Props) {
  const {
    nama_lokasi_vaksinasi: namaLokasi,
    // alamat_lokasi_vaksinasi: alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    // rt,
    // rw,
    jadwal,
    detail_lokasi,
    last_updated_at: lastUpdated
  } = location;

  const { colorMode } = useColorMode();
  const hasQuotaBorderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  const mapsUrl = detail_lokasi?.[0]
    ? `https://www.google.com/maps/search/${encodeURIComponent(`${detail_lokasi[0].lat}, ${detail_lokasi[0].lon}`)}`
    : `https://www.google.com/maps/search/${encodeURIComponent(namaLokasi)}`;
  const isCurrentLocationHasQuota = hasQuota(jadwal);

  const renderLocationDetail = () => {
    if (!loading && isUserLocationExist && typeof detail_lokasi !== 'undefined' && detail_lokasi.length > 0) {
      return (
        <HStack gridArea="distance" spacing={2}>
          <Text fontWeight="semibold">{detail_lokasi[0].distance} km</Text>
          <Tooltip hasArrow label={<Text>Jarak dari lokasi Anda: {detail_lokasi[0].distance} km</Text>}>
            <InfoOutlineIcon />
          </Tooltip>
        </HStack>
      );
    }
  };

  return (
    <Stack
      borderColor={isCurrentLocationHasQuota ? hasQuotaBorderColor : 'red'}
      borderRadius="md"
      borderWidth={1}
      h="full"
      w="full"
    >
      <Stack h="full" p={4} w="full">
        <Link href={mapsUrl} isExternal>
          <Heading size="sm" textTransform="capitalize">
            {namaLokasi.toLowerCase()} <ExternalLinkIcon mx="2px" />
          </Heading>
        </Link>
        <Text textTransform="capitalize">
          Kec/Kel: {kecamatan.toLowerCase()} / {kelurahan.toLowerCase()}
        </Text>
        <Text textTransform="capitalize">{wilayah.toLowerCase()}</Text>
        {!isCurrentLocationHasQuota && <Text color="red">Kuota Habis</Text>}
        <Spacer />
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
                        {waktu.map(({ label, id, kuota }) => {
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          const { sisaKuota = 0, totalKuota = 0 } = kuota || {};
                          return (
                            <Tr key={id}>
                              <Td>{label}</Td>
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
        <Grid gap={2} gridTemplateAreas={`"distance timestamp"`} templateColumns="1fr 3fr">
          {renderLocationDetail()}
          <Tooltip hasArrow label={new Date(lastUpdated).toString()}>
            <Text
              align="right"
              as="span"
              color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
              fontStyle="italic"
              gridArea="timestamp"
            >
              Diperbarui{' '}
              <Text as="time" dateTime={new Date(lastUpdated).toISOString()}>
                {formatDistanceToNow(Date.parse(lastUpdated), { locale: idLocale, addSuffix: true })}
              </Text>
            </Text>
          </Tooltip>
        </Grid>
      </Stack>
    </Stack>
  );
}
