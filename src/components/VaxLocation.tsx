import {
  Button,
  Heading,
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
  Box,
  useColorModeValue as mode,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { hasQuota } from '../helpers/QuotaHelpers';

export default function VaxLocation({ location }) {
  const {
    nama_lokasi_vaksinasi: namaLokasi,
    // alamat_lokasi_vaksinasi: alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    // rt,
    // rw,
    jadwal
  } = location;

  const isCurrentLocationHasQuota = hasQuota(jadwal);

  return (
    <Stack
      borderColor={isCurrentLocationHasQuota ? mode('blackAlpha.200', 'whiteAlpha.200') : 'red'}
      borderRadius="md"
      borderWidth={1}
      h="full"
      p={4}
      w="full"
    >
      <Heading size="sm">{namaLokasi}</Heading>
      <Text>
        KEC/KEL: {kecamatan} / {kelurahan}
      </Text>
      <Text>{wilayah}</Text>
      <Spacer />
      {!isCurrentLocationHasQuota && <Box color="red">Kuota Habis</Box>}
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
                <PopoverBody opacity={1}>
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
  );
}
