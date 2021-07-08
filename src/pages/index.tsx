import * as React from 'react';

import { getSchedule } from '~data/getSchedule';
import type { VaccinationDataWithDistance } from '~modules/vax/types';
import VaxLocation from '~modules/vax/VaxLocation';

import Searchbox from '../components/Searchbox';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import { VaccinationData } from 'data/types';
import useFuzzySearch from 'hooks/useFuzzySearch';
import Head from 'next/head';
import Link from 'next/link';
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

  return (
    <>
      <Head>
        <title>Lokasi dan Jadwal Vaksinasi DKI Jakarta</title>
      </Head>

      <Stack align="center" p={[2, 4]} spacing={[2, 4]}>
        <Heading textAlign="center">😷 Lokasi dan Jadwal Vaksinasi DKI Jakarta</Heading>

        <Link href="/map" passHref prefetch={false}>
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
        <Container as="section" maxW="container.lg" px={0} w="full">
          <SimpleGrid as="ul" columns={[1, null, null, 2]} listStyleType="none" spacing={4} w="full">
            {filteredSchedule.map((location: VaccinationDataWithDistance, i: number) => (
              <Box key={i} as="li" w="full">
                <VaxLocation
                  isUserLocationExist={Boolean(userLocation.lat && userLocation.lon)}
                  loading={userLocation.loading}
                  location={location}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Stack>
    </>
  );
}
