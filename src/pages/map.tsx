/* eslint-disable react/style-prop-object */
import 'mapbox-gl/dist/mapbox-gl.css';

import React from 'react';

import { getSchedule } from '~data/getSchedule';
import type { VaccinationDataWithDistance } from '~modules/vax/types';
import VaxLocationDetail from '~modules/vax/VaxLocationDetail';

import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import Searchbox from 'components/Searchbox';
import { Coordinate, DetailLokasi, Jadwal, VaccinationData } from 'data/types';
import useFuzzySearch from 'hooks/useFuzzySearch';
import MapboxGl from 'mapbox-gl';
import type { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl';
import { useGeolocation } from 'rooks';
import { getMapBounds } from 'utils/map';

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

interface LocationData extends Partial<DetailLokasi> {
  jadwal?: Jadwal[] | null;
  parent: VaccinationDataWithDistance;
}

interface CoordinateData extends Partial<Coordinate> {
  lokasi: LocationData;
}

const Mark = () => (
  <Box
    bg="red"
    borderColor="red.200"
    borderRadius="50%"
    borderStyle="solid"
    borderWidth="4px"
    height="20px"
    width="20px"
  />
);

export async function getStaticProps({ params: _ }: GetStaticPropsContext) {
  const schedule = await getSchedule();
  return {
    props: {
      schedule
    },
    revalidate: 60
  };
}

interface Props {
  schedule: VaccinationData[];
}

const MapPage = ({ schedule }: Props) => {
  const [isGetGeoPermission, setGetGeoPermission] = React.useState(false);
  const geoObj = useGeolocation({
    when: isGetGeoPermission
  });

  const [map, setMap] = React.useState<MapboxGl.Map | undefined>(undefined);
  const [activeLoc, setActiveLoc] = React.useState<LocationData | undefined>(undefined);
  const { colorMode: mode } = useColorMode();
  const mapFlyoutBackgroundColor = useColorModeValue('white', 'gray.900');
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const filtered = useFuzzySearch(schedule, searchKeyword);

  const scheduleToRender = () => {
    if (!searchKeyword.length) {
      return schedule;
    }

    const filteredSchedules = searchKeyword ? filtered.map(s => s.item) : schedule;

    const result = filteredSchedules.filter(props => {
      return props.detail_lokasi?.length;
    });

    return result;
  };

  const lokasiMap: LocationData[] = [];

  scheduleToRender().forEach(l => {
    if (l.detail_lokasi != null) {
      l.detail_lokasi.forEach(lokasi => {
        //@ts-expect-error convert data with distance
        lokasiMap.push({ ...lokasi, jadwal: l.jadwal, parent: l });
      });
    }
  });

  const coordinates: CoordinateData[] = lokasiMap.map(item => ({
    lat: parseFloat(item.lat ?? '0'),
    lng: parseFloat(item.lon ?? '0'),
    lokasi: item
  }));

  const setInitialMapBound = () => {
    if ('permissions' in navigator) {
      window.navigator.permissions
        .query({ name: 'geolocation' })
        .then(data => {
          const permission = data.state === 'granted';
          setGetGeoPermission(permission);
        })
        .catch(() => {});
    }
  };

  React.useEffect(() => {
    const listOfCoordinate = coordinates.map(data => ({
      lat: Number(data.lat),
      lng: Number(data.lng)
    }));
    if (map) {
      if (geoObj?.lat && geoObj.lng) {
        listOfCoordinate.push({ lat: geoObj.lat, lng: geoObj.lng });

        map.fitBounds(getMapBounds(listOfCoordinate), { padding: 100 });
      } else {
        map.fitBounds(getMapBounds(listOfCoordinate), { padding: 100 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoObj?.lat, geoObj?.lng]);

  const jakartaLatLng = { lat: -6.163088, lng: 106.836715 };

  return (
    <Container minHeight="100vh">
      <Head>
        <title>Lokasi dan Jadwal Vaksinasi DKI Jakarta</title>
      </Head>
      <Map
        containerStyle={{
          height: '100vh',
          width: '100%'
        }}
        onDrag={() => setActiveLoc(undefined)}
        onStyleLoad={loadedMap => {
          setMap(loadedMap);
          loadedMap.setCenter(jakartaLatLng);
          setInitialMapBound();
        }}
        style="mapbox://styles/mapbox/streets-v8"
      >
        <>
          {coordinates.map((coordinate, i) => {
            return (
              //@ts-expect-error - coordinate type conflict
              <Marker key={i} coordinates={coordinate}>
                <Box
                  onClick={() => {
                    setActiveLoc(coordinate.lokasi);
                    if (map != null) {
                      map.easeTo({
                        //@ts-expect-error latlng conflict
                        center: {
                          lat: coordinate.lokasi.lat,
                          lng: coordinate.lokasi.lon
                        }
                      });
                    }
                  }}
                >
                  <Mark key={i} />
                </Box>
              </Marker>
            );
          })}
          {geoObj?.lat && geoObj.lng && (
            <Marker coordinates={[geoObj.lng, geoObj.lat]}>
              <Popover>
                <PopoverTrigger>
                  <Box
                    bg="blue.300"
                    borderColor="blue.400"
                    borderRadius="50%"
                    borderStyle="solid"
                    borderWidth="4px"
                    height="20px"
                    width="20px"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>{'Lokasi anda sekarang'}</PopoverHeader>
                </PopoverContent>
              </Popover>
            </Marker>
          )}
          {activeLoc != undefined && (
            <Popup
              key={activeLoc.osm_id}
              anchor="bottom"
              //@ts-expect-error latlng conflict
              coordinates={{ lat: activeLoc.lat, lng: activeLoc.lon }}
              style={{ marginTop: -20, padding: 0 }}
            >
              <Box backgroundColor={mapFlyoutBackgroundColor}>
                <VaxLocationDetail isUserLocationExist={false} loading={false} location={activeLoc.parent} />
              </Box>
            </Popup>
          )}
        </>
      </Map>
      <Box height="80px" left={0} maxWidth="620px" position="fixed" top={0} width="100%" zIndex="sticky">
        <Box
          backgroundColor={mapFlyoutBackgroundColor}
          borderRadius={10}
          boxShadow={mode === 'dark' ? 'dark-lg' : 'lg'}
          margin={2}
          padding={2}
        >
          <HStack spacing="8px">
            <Link href="/" passHref>
              <IconButton aria-label="Back to Home" as="a" borderRadius={4} icon={<ArrowBackIcon />} />
            </Link>
            <Button
              aria-label="Gunakan Lokasi Anda"
              borderRadius={4}
              display={{ base: 'none', md: 'inline-flex', lg: 'inline-flex', xl: 'inline-flex' }}
              flexShrink={0}
              label="Gunakan Lokasi Anda"
              onClick={() =>
                isGetGeoPermission
                  ? map?.easeTo({
                      //@ts-expect-error latlng conflict
                      center: {
                        lat: geoObj?.lat,
                        lng: geoObj?.lng
                      },
                      zoom: 13
                    })
                  : setGetGeoPermission(true)
              }
            >
              {' '}
              📍 Lokasi Saya
            </Button>
            <Searchbox
              keyword={searchKeyword}
              onChange={e => {
                setSearchKeyword(e.target.value);

                setTimeout(() => {
                  if (lokasiMap.length && lokasiMap[0] && map !== undefined) {
                    map.easeTo({
                      center: {
                        lat: parseFloat(lokasiMap[0].lat ?? ''),
                        lng: parseFloat(lokasiMap[0].lon ?? '')
                      },
                      zoom: 13
                    });
                    setActiveLoc(lokasiMap[0]);
                  } else {
                    setActiveLoc(undefined);
                  }
                }, 100);
              }}
            />
            <Button
              aria-label="Gunakan Lokasi Anda"
              borderRadius={4}
              display={{ base: 'inline-flex', md: 'none', lg: 'none', xl: 'none' }}
              flexShrink={0}
              label="Gunakan Lokasi Anda"
              onClick={() =>
                isGetGeoPermission
                  ? map?.easeTo({
                      //@ts-expect-error latlng conflict
                      center: {
                        lat: geoObj?.lat,
                        lng: geoObj?.lng
                      },
                      zoom: 13
                    })
                  : setGetGeoPermission(true)
              }
            >
              {' '}
              📍
            </Button>
          </HStack>
        </Box>
      </Box>
    </Container>
  );
};

export default MapPage;
