import * as React from 'react';

import VaxLocation from '../components/VaxLocation';
import { getSchedule } from '../data/getSchedule';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Heading, Input, Select, Stack, Wrap, WrapItem } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

import { getDistanceFromLatLonInKm } from 'utils/location';

export async function getStaticProps() {
  const schedule = await getSchedule();
  console.log(schedule);
  return {
    props: {
      schedule
    },
    revalidate: 60
  };
}

export default function HomePage({ schedule }) {
  const [searchBy, setSearchBy] = React.useState('kecamatan');
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [userLocation, setUserLocation] = React.useState({
    loading: false,
    lat: 0,
    lon: 0,
    error: ''
  });

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    document.querySelector('input')?.focus();

    if (window && window.navigator && window.navigator.permissions) {
      window.navigator.permissions.query({ name: 'geolocation' }).then(status => {
        if (status.state === 'granted') {
          getUserLocation();
        }
      });
    }
  }, []);

  const filteredSchedule = React.useMemo(() => {
    if (!searchKeyword.length && !userLocation.lat && !userLocation.lon) {
      return schedule;
    }

    if (userLocation.lat && userLocation.lon) {
      /**
       * Add distance from current location to the vax location
       * for each item in `detail_lokasi` and sort it by the nearest.
       */
      return schedule
        .filter(props => {
          return props[searchBy].toLowerCase().includes(searchKeyword.toLowerCase());
        })
        .map(item => ({
          ...item,
          detail_lokasi:
            item.detail_lokasi.length > 0
              ? item.detail_lokasi
                  .map(loc => ({
                    ...loc,
                    distance: getDistanceFromLatLonInKm(
                      userLocation.lat,
                      userLocation.lon,
                      Number(loc.lat),
                      Number(loc.lon)
                    )
                  }))
                  .sort((a, b) => a.distance - b.distance)
              : item.detail_lokasi
        }))
        .sort((a, b) => {
          if (a.detail_lokasi[0] === undefined) {
            return 1;
          } else if (b.detail_lokasi[0] === undefined) {
            return -1;
          } else if (a.detail_lokasi[0].distance && b.detail_lokasi[0].distance) {
            return a.detail_lokasi[0].distance < b.detail_lokasi[0].distance ? -1 : 1;
          }
        });
    }

    return schedule.filter(s => {
      return s[searchBy].toLowerCase().includes(searchKeyword.toLowerCase());
    });
  }, [schedule, searchBy, searchKeyword, userLocation]);

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

  const handleButtonClickUserLocation = () => {
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
          <Select maxW={['auto', '2xs']} onChange={e => setSearchBy(e.target.value)} value={searchBy}>
            <option value="kecamatan">Kecamatan</option>
            <option value="kelurahan">Kelurahan</option>
          </Select>
          <Input
            flexGrow={1}
            fontSize={[14, 16]}
            onChange={e => setSearchKeyword(e.target.value)}
            placeholder="cari kecamatan/kelurahan"
          />
        </Stack>

        <Wrap justify="center" spacing={4}>
          {filteredSchedule.map((location, i) => (
            <WrapItem key={i} maxW={['full', 'md']} w="full">
              <VaxLocation
                loading={userLocation.loading}
                isUserLocationExist={userLocation.lat && userLocation.lon}
                location={location}
              />
            </WrapItem>
          ))}
        </Wrap>
      </Stack>
    </>
  );
}
