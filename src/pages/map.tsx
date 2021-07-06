/* eslint-disable react/style-prop-object */
import 'mapbox-gl/dist/mapbox-gl.css';

import React from 'react';

import { getSchedule } from '../data/getSchedule';
import { SearchFilter, VALID_SEARCH_FILTERS } from '../types';

import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  Select,
  useColorMode,
  useColorModeValue,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader
} from '@chakra-ui/react';
import VaxLocation, { VaccinationDataWithDistance } from 'components/VaxLocation';
import { Coordinate, DetailLokasi, Jadwal, VaccinationData } from 'data/types';
import MapboxGl from 'mapbox-gl';
import type { GetStaticPropsContext } from 'next';
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
    borderColor="darkred"
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
  const [searchBy, setSearchBy] = React.useState<SearchFilter>('kecamatan');
  const [activeLoc, setActiveLoc] = React.useState<LocationData | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const mapFlyoutBackgroundColor = useColorModeValue('white', 'gray.900');

  const scheduleToRender = () => {
    if (!searchKeyword.length) {
      return schedule;
    }

    const result = schedule.filter(props => {
      const fieldValue = props[searchBy].toLowerCase();

      return (
        fieldValue.includes(searchKeyword.toLowerCase()) && props.detail_lokasi != null && props.detail_lokasi.length
      );
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
                <VaxLocation isUserLocationExist={false} loading={false} location={activeLoc.parent} />
              </Box>
            </Popup>
          )}
        </>
      </Map>
      <Box height="80px" left={0} maxWidth="450px" position="fixed" top={0} width="100%" zIndex={999999}>
        <Box backgroundColor={mapFlyoutBackgroundColor} borderRadius={10} margin={2} padding={2}>
          <HStack spacing="8px">
            <Link href="/" passHref>
              <IconButton aria-label="Back to Home" as="a" borderRadius={4} icon={<ArrowBackIcon />} />
            </Link>
            <Button
              aria-label="Gunakan Lokasi Anda"
              label="Gunakan Lokasi Anda"
              borderRadius={4}
              onClick={() => setGetGeoPermission(true)}
            >
              📍
            </Button>
            <Select
              flexShrink={0}
              fontSize={[14, 16]}
              marginRight={1}
              onChange={e => {
                setSearchBy(e.target.value as SearchFilter);
              }}
              value={searchBy}
              width="auto"
            >
              {VALID_SEARCH_FILTERS.map(v => (
                <option
                  key={v}
                  style={{
                    textTransform: 'capitalize'
                  }}
                  value={v}
                >
                  {v}
                </option>
              ))}
            </Select>
            <Input
              fontSize={[14, 16]}
              onChange={e => {
                setSearchKeyword(e.target.value);
                setTimeout(() => {
                  if (lokasiMap.length && lokasiMap[0] && map !== undefined) {
                    map.easeTo({
                      center: {
                        lat: parseFloat(lokasiMap[0].lat ?? ''),
                        lng: parseFloat(lokasiMap[0].lon ?? '')
                      }
                    });
                    setActiveLoc(lokasiMap[0]);
                  } else {
                    setActiveLoc(undefined);
                  }
                }, 100);
              }}
              placeholder={`Cari ${searchBy}`}
              value={searchKeyword}
            />
          </HStack>
        </Box>
      </Box>
    </Container>
  );
};

export default MapPage;
