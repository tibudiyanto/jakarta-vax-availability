/* eslint-disable react/style-prop-object */
import 'mapbox-gl/dist/mapbox-gl.css';

import React, { Fragment } from 'react';

import { getSchedule } from '../data/getSchedule';

import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  Select,
  Text,
  useColorMode
} from '@chakra-ui/react';
import MapboxGl from 'mapbox-gl';
import Link from 'next/link';
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl';

function Container(props) {
  const { colorMode } = useColorMode();

  const bgColor = { light: 'gray.50', dark: 'gray.900' };

  const color = { light: 'black', dark: 'white' };
  return (
    <Flex
      alignItems="center"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      direction="column"
      justifyContent="flex-start"
      {...props}
    />
  );
}

const Map = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY
});

export async function getStaticProps({ params: _ }) {
  const schedule = await getSchedule();
  return {
    props: {
      schedule
    },
    revalidate: 60
  };
}

const Mark = () => (
  <Box
    bg="red"
    borderColor="darkred"
    borderRadius="50%"
    width="20px"
    height="20px"
    borderStyle="solid"
    borderWidth="4px"
  />
);

const MapPage = ({ schedule }) => {
  const [map, setMap] = React.useState<MapboxGl.Map | null>(null);
  const [activeLoc, setActiveLoc] = React.useState<any>(null);
  const [searchBy, setSearchBy] = React.useState('kecamatan');
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const scheduleToRender = ({ schedule, searchBy, searchKeyword }) => {
    if (!searchKeyword.length) {
      return schedule;
    }
    const result = schedule.filter(props => {
      return props[searchBy].toLowerCase().includes(searchKeyword.toLowerCase()) && props.detail_lokasi.length;
    });

    return result;
  };

  const lokasiMap: any[] = [];

  scheduleToRender({ schedule, searchBy, searchKeyword }).forEach(l => {
    l.detail_lokasi.forEach(lokasi => {
      lokasiMap.push({ ...lokasi, jadwal: l.jadwal });
    });
  });

  const coordinates = lokasiMap.map(item => ({
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    lokasi: item
  }));

  return (
    <Container minHeight="100vh">
      <Map
        containerStyle={{
          height: '100vh',
          width: '100%'
        }}
        onDrag={(e) => setActiveLoc(null)}
        onStyleLoad={loadedMap => {
          setMap(loadedMap);
          loadedMap.setCenter({ lat: -6.163088, lng: 106.836715 });
        }}
        style="mapbox://styles/mapbox/streets-v8"
      >
        {coordinates.map((coordinate, i) => {
          return (
            //@ts-ignore
            <Marker key={i} coordinates={coordinate}>
            <Box
              onClick={() => {
                setActiveLoc(coordinate.lokasi);
                if (map) {
                  map.easeTo({
                    center: {
                      lat: coordinate.lokasi.lat,
                      lng: coordinate.lokasi.lon,
                    },
                    //@ts-ignore
                    padding: { bottom: 340 },
                  });
                }
              }}
            >
              <Mark key={i} />
            </Box>
          </Marker>
          );
        })}
        {activeLoc && (
            <Popup
              key={activeLoc.osm_id}
              //@ts-ignore
              coordinates={{ lat: activeLoc.lat, lng: activeLoc.lon }}
              style={{ marginLeft: -150, marginTop: 40 }}
            >
              <Popover isOpen={true} autoFocus={false}>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton onClick={() => setActiveLoc(null)} />
                  <PopoverHeader>{activeLoc?.display_name}</PopoverHeader>
                  <PopoverBody maxHeight="300px" overflowY="auto">
                    {activeLoc?.jadwal.map(({ id, waktu }) => {
                      return (
                        <Fragment key={id}>
                          <Text fontWeight="extrabold">{id}</Text>
                          {waktu.map(({ label, id }) => {
                            return <Text key={id}>{label}</Text>;
                          })}
                        </Fragment>
                      );
                    })}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Popup>
          )}
      </Map>
      <Box height="80px" left={0} maxWidth="450px" position="fixed" top={0} width="100%" zIndex={999999}>
        <Box bg="black" borderRadius={10} margin={2} padding={2}>
          <HStack spacing="8px">
            <Link href="/" passHref>
              <IconButton aria-label="Back to Home" as="a" borderRadius={4} icon={<ArrowBackIcon />} />
            </Link>
            <Select
              flexShrink={0}
              fontSize={[14, 16]}
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
              fontSize={[14, 16]}
              onChange={(e) => {
                setSearchKeyword(e.target.value);

                setTimeout(() => {
                  if (lokasiMap.length && lokasiMap[0]) {
                    map && map.easeTo({
                      center: {
                        lat: parseFloat(lokasiMap[0].lat),
                        lng: parseFloat(lokasiMap[0].lon),
                      },
                      //@ts-ignore
                      padding: { bottom: 340 },
                    });
                    setActiveLoc(lokasiMap[0]);
                  } else {
                    setActiveLoc(null);
                  }
                }, 100);
              }}
              placeholder="cari kecamatan / kelurahan"
              value={searchKeyword}
            />
          </HStack>
        </Box>
      </Box>
    </Container>
  );
};

export default MapPage;