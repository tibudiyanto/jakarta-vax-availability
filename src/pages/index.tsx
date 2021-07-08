import * as React from 'react';

import { getSchedule } from '~data/getSchedule';
import type { VaccinationDataWithDistance } from '~modules/vax/types';
import VaxLocation from '~modules/vax/VaxLocation';

import Searchbox from '../components/Searchbox';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Heading, Stack } from '@chakra-ui/react';
import { VaccinationData } from 'data/types';
import useFuzzySearch from 'hooks/useFuzzySearch';
import Head from 'next/head';
import Link from 'next/link';
import Autosizer from 'react-virtualized-auto-sizer';
import { VariableSizeGrid as Grid } from 'react-window';
import { getDistanceFromLatLonInKm } from 'utils/location';

export async function getStaticProps() {
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

export default function HomePage({ schedule }: Props) {
  const [userLocation, setUserLocation] = React.useState({
    loading: false,
    lat: 0,
    lon: 0,
    error: ''
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const filtered = useFuzzySearch(schedule, searchKeyword);

  const getUserLocation = () => {
    setUserLocation(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({
          loading: false,
          lat: coords.latitude,
          lon: coords.longitude,
          error: ''
        });
      },
      error => {
        console.error(`Get geolocation error: ${error.message}`);
        setUserLocation({
          loading: false,
          lat: 0,
          lon: 0,
          error: 'Get geolocation error'
        });
      },
      {
        enableHighAccuracy: false,
        timeout: Infinity,
        maximumAge: 0
      }
    );
  };

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    document.querySelector('input')?.focus();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (window.navigator.permissions) {
      window.navigator.permissions
        .query({ name: 'geolocation' })
        .then(status => {
          if (status.state === 'granted') {
            getUserLocation();
          }
        })
        .catch(() => {});
    }
  }, []);

  const filteredSchedule = React.useMemo(() => {
    if (!searchKeyword.length && !userLocation.lat && !userLocation.lon) {
      return schedule;
    }

    const filteredSchedules = searchKeyword ? filtered.map(s => s.item) : schedule;

    if (userLocation.lat && userLocation.lon) {
      /**
       * Add distance from current location to the vax location
       * for each item in `detail_lokasi` and sort it by the nearest.
       */
      return (
        filteredSchedules
          .map(item => ({
            ...item,
            detail_lokasi:
              (item.detail_lokasi?.length || 0) > 0
                ? item.detail_lokasi
                    ?.map(loc => ({
                      ...loc,
                      distance: getDistanceFromLatLonInKm(
                        userLocation.lat,
                        userLocation.lon,
                        Number(loc.lat),
                        Number(loc.lon)
                      )
                    }))
                    .sort((a, b) => (a.distance > b.distance ? 1 : -1))
                : item.detail_lokasi
          }))
          // @ts-expect-error `distance` is added to `detail_lokasi` in the previous .map() call
          .sort((a: VaccinationDataWithDistance, b: VaccinationDataWithDistance) => {
            if (!a.detail_lokasi?.[0]) {
              return 1;
            } else if (!b.detail_lokasi?.[0]) {
              return -1;
            } else if (a.detail_lokasi[0].distance && b.detail_lokasi[0].distance) {
              return a.detail_lokasi[0].distance < b.detail_lokasi[0].distance ? -1 : 1;
            }

            return 0;
          })
      );
    }

    return filteredSchedules;
    // Resorting to a typecast here for a quick workaround.
    // TODO: Type this function better
  }, [schedule, searchKeyword, filtered, userLocation]) as VaccinationDataWithDistance[];

  const handleButtonClickUserLocation = () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      setUserLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported'
      }));
      return;
    }

    getUserLocation();
  };

  function getRowHeight(row: number) {
    const maxJadwal = Math.max(filteredSchedule[row * 2].jadwal.length, filteredSchedule[row * 2 + 1].jadwal.length);

    return 260 + Math.ceil(maxJadwal / 4) * 40;
  }

  return (
    <>
      <Head>
        <title>Lokasi dan Jadwal Vaksinasi DKI Jakarta</title>
      </Head>

      <Stack align="center" height="100vh" p={[2, 4]} spacing={[2, 4]}>
        <Heading textAlign="center">😷 Lokasi dan Jadwal Vaksinasi DKI Jakarta</Heading>

        <Link href="/map" passHref>
          <Button as="a" leftIcon={<ExternalLinkIcon />} variant="solid">
            Peta
          </Button>
        </Link>

        <Stack direction={['column', 'row']} maxW="4xl" pb={4} w="full">
          <Button
            flexShrink={0}
            isDisabled={Boolean(userLocation.lat && userLocation.lon)}
            isLoading={userLocation.loading}
            onClick={handleButtonClickUserLocation}
          >
            {userLocation.lat && userLocation.lon ? 'Lokasi Ditemukan' : 'Dapatkan Lokasi Anda'}
          </Button>
          <Searchbox keyword={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
        </Stack>
        <Container as="section" flexGrow={1} flexShrink={1} maxW="container.lg" px={0} w="full">
          <Autosizer>
            {({ height, width }) => (
              <Grid
                key={filteredSchedule}
                columnCount={2}
                columnWidth={() => (width - 40) / 2}
                height={height}
                rowCount={Math.floor(filteredSchedule.length / 2)}
                rowHeight={getRowHeight}
                width={width}
              >
                {({
                  columnIndex,
                  rowIndex,
                  style
                }: {
                  columnIndex: number;
                  rowIndex: number;
                  style: React.CSSProperties;
                }) => {
                  const location = filteredSchedule[rowIndex * 2 + columnIndex];
                  return (
                    <Box
                      key={location.kode_lokasi_vaksinasi}
                      as="li"
                      listStyleType="none"
                      marginLeft={columnIndex === 1 ? '20px' : 0}
                      style={style}
                      w="full"
                    >
                      <VaxLocation
                        isUserLocationExist={Boolean(userLocation.lat && userLocation.lon)}
                        loading={userLocation.loading}
                        location={location}
                      />
                    </Box>
                  );
                }}
              </Grid>
            )}
          </Autosizer>
        </Container>
      </Stack>
    </>
  );
}
