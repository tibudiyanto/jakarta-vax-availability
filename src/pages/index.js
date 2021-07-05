import { CloseIcon } from '@chakra-ui/icons';
import {
  Button, Flex, Heading, Input, Popover, PopoverBody,
  PopoverCloseButton, PopoverContent, PopoverTrigger,
  Select, Stack, Text,
  SimpleGrid
} from "@chakra-ui/react";
import { Map, Marker } from "pigeon-maps";
import React from "react";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { getSchedule } from "../data/getSchedule";
import { flatten } from '../utils/index'
import { BottomSheet } from '../components/BottomSheet'

export function MapComponent({ locations }) {
  const locationData = flatten(locations.filter((location) => location.detail_lokasi.length).map((location) => {
    return location.detail_lokasi
  }))

  const [selectedLocation, setSelectedLocation] = React.useState(null)

  const onCloseDetailLocation = () => {
    setSelectedLocation(null)
  }

  const JAKARTA_GEO_LOC = [-6.200000, 106.816666]

  return (
    <>
      <Map height={300} defaultCenter={JAKARTA_GEO_LOC} defaultZoom={11}>
        {
          locationData.map((location) => {
            return (
              <Marker
                key={location.place_id}
                width={50}
                onClick={() => setSelectedLocation(location)}
                anchor={[+location.lat, +location.lon]}
              />
            )
          })
        }
      </Map>
        {
          selectedLocation && (
            <BottomSheet onClose={onCloseDetailLocation}>
               <Flex flexDirection="column">
                  <Flex flexDirection="row" justifyContent="space-between">
                    <h4 style={{
                      fontSize: '24px',
                      marginBottom: '18px',
                      verticalAlign: 'center'
                    }}>
                      <strong>Detail Lokasi</strong>
                    </h4>
                    <CloseIcon marginTop="10px" onClick={onCloseDetailLocation} />
                  </Flex>
                  <p>
                    {selectedLocation.display_name}
                  </p>
                </Flex>
            </BottomSheet>
           
          )
        }
    </>
  )
}

export async function getStaticProps({ params }) {
  const schedule = await getSchedule();
  return {
    props: {
      schedule,
    },
    revalidate: 60,
  };
}

const VaxLocation = (location) => {
  const {
    nama_lokasi_vaksinasi: namaLokasi,
    alamat_lokasi_vaksinasi: alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    rt,
    rw,
    jadwal,
  } = location;

  return (
    <Container
      border={"1px solid black"}
      alignItems="start"
      minHeight={["10em"]}
    >
      <Stack padding={1} w="100%">
        <Text>{namaLokasi}</Text>
        <Text>
          KEC/KEL: {kecamatan} / {kelurahan}
        </Text>
        <Text>{wilayah}</Text>
        <Stack direction="row" wrap="wrap" gridRowGap={2} paddingBlockEnd={2}>
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
  const [searchBy, setSearchBy] = React.useState("kecamatan");
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const scheduleToRender = ({ schedule, searchBy, searchKeyword }) => {
    if (!searchKeyword.length) {
      return schedule;
    }
    return schedule.filter((props) => {
      return props[searchBy]
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
    });
  };

  const locations = scheduleToRender({ schedule, searchBy, searchKeyword })

  return (
    <Container minHeight="100vh" overflowX="hidden">
      <DarkModeSwitch />
      <Stack paddingInline={[4, 6]} width="100%">
        <Heading paddingBlockStart="8">Lokasi dan Jadwal Vaksinasi DKI Jakarta</Heading>

        <Flex direction="row">
          <Select
            flexShrink={0}
            value={searchBy}
            marginRight={1}
            width="auto"
            onChange={(e) => {
              setSearchBy(e.target.value);
            }}
          >
            <option value="kecamatan">Kecamatan</option>
            <option value="kelurahan">Kelurahan</option>
          </Select>
          <Input
            placeholder="cari kecamatan / kelurahan"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          ></Input>
        </Flex>

        <MapComponent locations={locations} />

        <SimpleGrid columns={[1,2,3]} spacing={2}>
          {scheduleToRender({ schedule, searchBy, searchKeyword }).map(
            (l, index) => {
              return <VaxLocation key={index} {...l} />;
            }
          )}
        </SimpleGrid>

      </Stack>
    </Container>
  );
};

export default Index;
