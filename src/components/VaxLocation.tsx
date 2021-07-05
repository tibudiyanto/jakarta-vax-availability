import { hasQuota } from '../helpers/QuotaHelpers';

import {
  Box,
  Button,
  Heading,
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
  Tr,
  useColorModeValue as mode,
  Wrap,
  WrapItem
} from '@chakra-ui/react';

export default function VaxLocation({ loading, location, isUserLocationExist }) {
  const {
    nama_lokasi_vaksinasi: namaLokasi,
    // alamat_lokasi_vaksinasi: alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    // rt,
    // rw,
    jadwal,
    detail_lokasi
  } = location;

  const mapsUrl =
    detail_lokasi[0] == null
      ? `https://www.google.com/maps/search/${encodeURIComponent(namaLokasi)}`
      : `https://www.google.com/maps/search/${encodeURIComponent(`${detail_lokasi[0].lat}, ${detail_lokasi[0].lon}`)}`;
  const isCurrentLocationHasQuota = hasQuota(jadwal);

  return (
    <Stack
      borderColor={isCurrentLocationHasQuota ? mode('blackAlpha.200', 'whiteAlpha.200') : 'red'}
      borderRadius="md"
      borderWidth={1}
      h="full"
      w="full"
    >
      {!loading && isUserLocationExist && detail_lokasi.length > 0 ? (
        <Box
          bg={mode('gray.100', 'gray.600')}
          borderBottomWidth={1}
          borderColor={mode('blackAlpha.200', 'whiteAlpha.200')}
          borderTopRadius="md"
          p={2}
          w="100%"
        >
          <Text align="center">
            JARAK DARI LOKASI ANDA: <b>{detail_lokasi[0].distance}</b> KM
          </Text>
        </Box>
      ) : (
        ''
      )}

      <Stack h="full" p={4} w="full">
        <Link href={mapsUrl} isExternal>
          <Heading size="sm">{namaLokasi}</Heading>
        </Link>
        <Text>
          KEC/KEL: {kecamatan} / {kelurahan}
        </Text>
        <Text>{wilayah}</Text>
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
                          <Th>Jaki Kuota</Th>
                          <Th>Total Kuota</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {waktu.map(({ label, id, kuota }) => {
                          const { sisaKuota = 0, jakiKuota = 0, totalKuota = 0 } = kuota;
                          return (
                            <Tr key={id}>
                              <Td>{label}</Td>
                              <Td>{sisaKuota}</Td>
                              <Td>{jakiKuota}</Td>
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
    </Stack>
  );
}
