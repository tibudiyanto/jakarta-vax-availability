/* eslint-disable react/style-prop-object */
import 'mapbox-gl/dist/mapbox-gl.css';

import React, { Fragment } from 'react';

import { getSchedule } from '../data/getSchedule';
import { SearchFilter, VALID_SEARCH_FILTERS } from '../types';

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
  PopoverTrigger,
  Select,
  Text,
  Button,
  useColorMode
} from '@chakra-ui/react';
import { DetailLokasi, Jadwal, VaccinationData } from 'data/types';
import MapboxGl from 'mapbox-gl';
import type { GetStaticPropsContext } from 'next';
import Link from 'next/link';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import { useGeolocation } from 'rooks';
import { getMapBounds, LngLat } from 'utils/map';

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
}
interface MarkProps {
  lokasi: LocationData;
}

const Mark = ({ lokasi }: MarkProps) => (
  <Popover>
    <PopoverTrigger>
      <div
        style={{
          backgroundColor: '#e74c3c',
          borderRadius: '50%',
          width: 20,
          height: 20,
          border: '4px solid #eaa29b'
        }}
      />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>{lokasi.display_name}</PopoverHeader>
      <PopoverBody>
        {lokasi.jadwal?.map(({ id, waktu }) => {
          return (
            <Fragment key={id}>
              <Text fontWeight="extrabold">{id}</Text>
              {waktu?.map(({ label, id: _id }) => {
                return <Text key={_id}>{label}</Text>;
              })}
            </Fragment>
          );
        })}
      </PopoverBody>
    </PopoverContent>
  </Popover>
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
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const scheduleToRender = () => {
    if (!searchKeyword.length) {
      return schedule;
    }

    const result = schedule.filter(props => {
      const fieldValue = props[searchBy].toLowerCase();

      return fieldValue.includes(searchKeyword.toLowerCase()) && props.detail_lokasi?.length;
    });

    const detail = result[0]?.detail_lokasi;

    if (detail?.[0] && map) {
      map.setCenter({
        lat: parseFloat(detail[0].lat),
        lng: parseFloat(detail[0].lon)
      });
    }

    return result;
  };

  const lokasiMap: LocationData[] = [];

  scheduleToRender().forEach(l => {
    l.detail_lokasi?.forEach(lokasi => {
      lokasiMap.push({ ...lokasi, jadwal: l.jadwal });
    });
  });

  const coordinates = lokasiMap.map(item => ({
    lat: parseFloat(item.lat ?? '0'),
    lng: parseFloat(item.lon ?? '0'),
    lokasi: item
  }));

  const setInitialMapBound = (mapBox: MapboxGl.Map) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if ('permissions' in navigator) {
      window.navigator.permissions.query({ name: 'geolocation' }).then(data => {
        const permission = data.state === 'granted';
        setGetGeoPermission(permission);
        if (!permission) {
          mapBox.fitBounds(getMapBounds(coordinates), { padding: 100 });
        }
      });
    }
  };

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (map && geoObj && geoObj.lat && geoObj.lng) {
      const listOfCoordinate = coordinates.map(data => ({
        lat: data.lat,
        lng: data.lng
      }));
      listOfCoordinate.push({ lat: geoObj.lat, lng: geoObj.lng });
      map.fitBounds(getMapBounds(listOfCoordinate), { padding: 100 });
    }
  }, [coordinates, geoObj, map]);

  const jakartaLatLng = [106.836715, -6.163088];
  return (
    <Container minHeight="100vh">
      <Map
        center={jakartaLatLng}
        containerStyle={{
          height: '100vh',
          width: '100%'
        }}
        onStyleLoad={loadedMap => {
          setMap(loadedMap);
          setInitialMapBound(loadedMap);
        }}
        style="mapbox://styles/mapbox/streets-v8"
      >
        {coordinates.map((coordinate, i) => {
          return (
            // @ts-expect-error - `coordinate` is still untyped
            <Marker key={i} coordinates={coordinate}>
              <Mark key={i} lokasi={coordinate.lokasi} />
            </Marker>
          );
        })}

        {geoObj && geoObj.lat && (
          <Marker coordinates={[geoObj.lng, geoObj.lat]}>
            <Popover>
              <PopoverTrigger>
                <div
                  style={{
                    backgroundColor: 'var(--chakra-colors-blue-300)',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    border: '4px solid var(--chakra-colors-blue-400)'
                  }}
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
      </Map>
      <Box height={80} left={0} maxWidth={450} position="fixed" top={0} width="100%" zIndex={999999999999}>
        <Box bg="black" borderRadius={10} margin={2} padding={2}>
          <HStack spacing="8px">
            ]
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
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder={`cari ${searchBy}`}
              value={searchKeyword}
            />
          </HStack>
        </Box>
      </Box>
    </Container>
  );
};

export default MapPage;
