import * as React from 'react';

import { hasQuota } from '~helpers/QuotaHelpers';
import { VaxLocationSchedulePopover } from '~modules/vax-schedule';

import { VaccinationDataWithDistance } from './types';

import {
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import idLocale from 'date-fns/locale/id';

export interface VaxLocationDetailProps {
  loading: boolean;
  isUserLocationExist: boolean;
  location: VaccinationDataWithDistance;
}

/**
 * `VaxLocationDetail` card, separated from the main VaxLocation component for display on the map page.
 * Accepts the same props as `VaxLocation`
 */
export default function VaxLocationDetail({ loading, isUserLocationExist, location }: VaxLocationDetailProps) {
  const { colorMode } = useColorMode();
  const distanceBackgroundColor = useColorModeValue('gray.200', 'gray.700');

  const {
    nama_lokasi_vaksinasi: namaLokasi,
    alamat_lokasi_vaksinasi: ignored_alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    rt: ignored_rt,
    rw: ignored_rw,
    jadwal,
    detail_lokasi,
    last_updated_at: lastUpdated
  } = location;

  const isCurrentLocationHasQuota = hasQuota(jadwal);

  const renderLocationDistance = () => {
    if (loading) {
      return null;
    }

    if (isUserLocationExist && typeof detail_lokasi !== 'undefined' && detail_lokasi.length > 0) {
      return (
        <Tooltip hasArrow label={<Text>Jarak dari lokasi Anda: {detail_lokasi[0].distance} km</Text>}>
          <Box backgroundColor={distanceBackgroundColor} borderRadius="sm" display="inline-block" px="4" py="2">
            <Text fontSize="md" fontWeight="semibold">
              {detail_lokasi[0].distance} km
            </Text>
          </Box>
        </Tooltip>
      );
    }

    return null;
  };
  return (
    <>
      <Flex alignItems="flex-start" flexDirection="row" justifyContent="space-between" p={4}>
        <Stack spacing={2}>
          <Heading as="h2" isTruncated size="md" textTransform="capitalize" whiteSpace="break-spaces">
            {namaLokasi}
          </Heading>
          <Tooltip hasArrow label={new Date(lastUpdated).toString()}>
            <Text as="span" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'} gridArea="timestamp" isTruncated>
              Diperbarui{' '}
              <Text as="time" dateTime={new Date(lastUpdated).toISOString()}>
                {formatDistanceToNow(Date.parse(lastUpdated), { locale: idLocale, addSuffix: true })}
              </Text>
            </Text>
          </Tooltip>
        </Stack>
        <Stack flex="0 0 auto" ml={4} spacing={1}>
          <Box textAlign="right">{renderLocationDistance()}</Box>
          {!isCurrentLocationHasQuota && (
            <Box textAlign="right">
              <Badge colorScheme="red" fontSize="0.8em">
                Kuota Habis
              </Badge>
            </Box>
          )}
        </Stack>
      </Flex>
      <Stack pb={6} px={4} spacing={4}>
        <Stack spacing={1}>
          <Text textTransform="capitalize">
            Kec/Kel: {kecamatan.toLowerCase()} / {kelurahan.toLowerCase()}
          </Text>
          <Text textTransform="capitalize">{wilayah.toLowerCase()}</Text>
        </Stack>
        <Wrap>
          {jadwal.map(({ id: jadwalId, label: jadwalLabel, waktu }) => (
            <WrapItem key={jadwalId}>
              <VaxLocationSchedulePopover id={jadwalId} label={jadwalLabel} waktu={waktu} />
            </WrapItem>
          ))}
        </Wrap>
      </Stack>
    </>
  );
}
