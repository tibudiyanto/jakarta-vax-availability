import {
  Box,
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

  return (
    <Stack borderColor={mode('blackAlpha.200', 'whiteAlpha.200')} borderRadius="md" borderWidth={1} h="full" w="full">
      {!loading && isUserLocationExist && detail_lokasi.length > 0 ? (
        <Box
          bg={mode('gray.100', 'gray.600')}
          w="100%"
          p={2}
          borderTopRadius="md"
          borderBottomWidth={1}
          borderColor={mode('blackAlpha.200', 'whiteAlpha.200')}
        >
          <Text align="center">
            JARAK DARI LOKASI ANDA: <b>{detail_lokasi[0].distance}</b> KM
          </Text>
        </Box>
      ) : (
        ''
      )}

      <Stack h="full" w="full" p={4}>
        <Heading size="sm">{namaLokasi}</Heading>
        <Text>
          KEC/KEL: {kecamatan} / {kelurahan}
        </Text>
        <Text>{wilayah}</Text>
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
