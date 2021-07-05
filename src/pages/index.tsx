import React from 'react';

import { Container } from '../components/Container';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { getSchedule } from '../data/getSchedule';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';

export async function getStaticProps({ params }) {
  const schedule = await getSchedule();
  return {
    props: {
      schedule
    },
    revalidate: 60
  };
}

const ignoredVaxLocationDetail = _location => {};

const VaxLocation = location => {
  const {
    nama_lokasi_vaksinasi: namaLokasi,
    alamat_lokasi_vaksinasi: alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    rt,
    rw,
    jadwal
  } = location;

  return (
    <Container alignItems="start" border="1px solid black" minHeight={['10em']}>
      <Stack padding={1} w="100%">
        <Text>{namaLokasi}</Text>
        <Text>
          KEC/KEL: {kecamatan} / {kelurahan}
        </Text>
        <Text>{wilayah}</Text>
        <Stack direction="row" gridRowGap={2} paddingBlockEnd={2} wrap="wrap">
          {jadwal.map(({ id, waktu }) => {
            return (
              <Popover key={id}>
                <PopoverTrigger>
                  <Button>{id}</Button>
                </PopoverTrigger>
                <PopoverContent w={['95vw', '30vw']}>
                  <PopoverCloseButton />
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
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
};

const Index = ({ schedule }) => {
  const [searchBy, setSearchBy] = React.useState('kecamatan');
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const scheduleToRender = ({ schedule, searchBy, searchKeyword }) => {
    if (!searchKeyword.length) {
      return schedule;
    }
    return schedule.filter(props => {
      return props[searchBy].toLowerCase().includes(searchKeyword.toLowerCase());
    });
  };

  return (
    <Container minHeight="100vh" overflowX="hidden">
      <DarkModeSwitch />
      <Link href="/map">
        <Button leftIcon={<ExternalLinkIcon />} position="absolute" right={20} top={2} variant="solid">
          Peta
        </Button>
      </Link>
      <Stack paddingInline={[4, 6]} width="100%">
        <Heading paddingBlockStart="8">Lokasi dan Jadwal Vaksinasi DKI Jakarta</Heading>

        <Flex direction="row">
          <Select
            flexShrink={0}
            marginRight={1}
            onChange={e => {
              setSearchBy(e.target.value);
            }}
            value={searchBy}
            width="auto"
          >
            <option value="kecamatan">Kecamatan</option>
            <option value="kelurahan">Kelurahan</option>
          </Select>
          <Input
            onChange={e => setSearchKeyword(e.target.value)}
            placeholder="cari kecamatan / kelurahan"
            value={searchKeyword}
          />
        </Flex>

        <SimpleGrid columns={[1, 2, 3]} spacing={2}>
          {scheduleToRender({ schedule, searchBy, searchKeyword }).map((l, index) => {
            return <VaxLocation key={index} {...l} />;
          })}
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default Index;
