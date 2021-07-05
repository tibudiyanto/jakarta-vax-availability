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
  Text
} from '@chakra-ui/react';
import { useGeolocation } from 'rooks';
import { sortByDistance, Location } from 'utils/sortByDistance';

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
    jadwal,
    distanceFromCurrentLocation
  } = location as Location;

  return (
    <Container alignItems="start" border="1px solid black" minHeight={['10em']}>
      <Stack padding={1} w="100%">
        <Text>{namaLokasi}</Text>
        <Text>
          KEC/KEL: {kecamatan} / {kelurahan}
        </Text>

        {distanceFromCurrentLocation && (
          <Text>{`Estimasi jarak dari lokasi anda: ${distanceFromCurrentLocation.toFixed(1)} KM`}</Text>
        )}

        <Stack direction="row" gridRowGap={2} paddingBlockEnd={2} wrap="wrap">
          {jadwal.map(({ id, waktu }) => {
            return (
              <Popover key={id}>
                <PopoverTrigger>
                  <Button>{id}</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Stack>
                      {waktu.map(({ label, id }) => {
                        return <Text key={id}>{label}</Text>;
                      })}
                    </Stack>
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
  const [listOfLocation, setlistOfLocation] = React.useState<Location[]>([]);
  const userGeoData = useGeolocation();

  React.useEffect(() => {
    setlistOfLocation(scheduleToRender({ schedule, searchBy, searchKeyword, userGeoData }));
  }, [schedule, searchBy, searchKeyword, userGeoData, userGeoData]);

  const scheduleToRender = ({ schedule, searchBy, searchKeyword, userGeoData }): Location[] => {
    const sortedSchadule = sortByDistance({ lat: userGeoData?.lat, lon: userGeoData?.lng }, schedule);
    if (!searchKeyword.length) {
      return sortedSchadule;
    }
    return sortedSchadule.filter(props => {
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
          {listOfLocation.map((l, index) => {
            return <VaxLocation key={`${index}+ ${l.distanceFromCurrentLocation}`} {...l} />;
          })}
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default Index;
