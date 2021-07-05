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
  Text,
  useColorModeValue as mode,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'

export default function VaxLocation({ location }) {
  const {
    nama_lokasi_vaksinasi: namaLokasi,
    // alamat_lokasi_vaksinasi: alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    // rt,
    // rw,
    jadwal,
  } = location

  return (
    <Stack
      borderColor={mode('blackAlpha.200', 'whiteAlpha.200')}
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
      <Wrap>
        {jadwal.map(({ id: jadwalId, waktu }) => (
          <WrapItem key={jadwalId}>
            <Popover isLazy>
              <PopoverTrigger>
                <Button size="sm" variant="outline">
                  {jadwalId}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                  <Stack>
                    {waktu.map(({ label, id: waktuId }) => (
                      <Text key={waktuId}>{label}</Text>
                    ))}
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </WrapItem>
        ))}
      </Wrap>
    </Stack>
  )
}
