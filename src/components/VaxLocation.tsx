import * as React from 'react';

import { hasQuota } from '../helpers/QuotaHelpers';

import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  HStack,
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
  useColorModeValue as mode,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import idLocale from 'date-fns/locale/id';

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
    detail_lokasi,
    last_updated_at: lastUpdated
  } = location;

  const { colorMode } = useColorMode();
  const isCurrentLocationHasQuota = hasQuota(jadwal);

  const hasDistanceFromLocation = React.useMemo(
    () => !loading && isUserLocationExist && detail_lokasi.length > 0,
    [loading, isUserLocationExist, detail_lokasi]
  );

  return (
    <Stack
      borderColor={isCurrentLocationHasQuota ? mode('blackAlpha.200', 'whiteAlpha.200') : 'red'}
      borderRadius="md"
      borderWidth={1}
      h="full"
      w="full"
    >
      <Stack h="full" p={4} w="full">
        <Heading size="sm">{namaLokasi}</Heading>
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
        <Flex flexDirection="row" justifyContent="space-between">
          {hasDistanceFromLocation ? (
            <HStack spacing={2}>
              <Text fontWeight="semibold">{detail_lokasi[0].distance} km</Text>
              <Tooltip hasArrow label={<Text>Jarak dari lokasi Anda: {detail_lokasi[0].distance} km</Text>}>
                <InfoOutlineIcon />
              </Tooltip>
            </HStack>
          ) : null}
          <Tooltip hasArrow label={new Date(lastUpdated).toString()}>
            <Text align="right" as="span" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
              Diperbarui{' '}
              <Text as="time" dateTime={new Date(lastUpdated).toISOString()}>
                {formatDistanceToNow(Date.parse(lastUpdated), { locale: idLocale, addSuffix: true })}
              </Text>
            </Text>
          </Tooltip>
        </Flex>
      </Stack>
    </Stack>
  );
}
