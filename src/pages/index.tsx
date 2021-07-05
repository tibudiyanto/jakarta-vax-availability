import * as React from 'react';

import VaxLocation from '../components/VaxLocation';
import { getSchedule } from '../data/getSchedule';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Heading, Input, Select, Stack, Wrap, WrapItem } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

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

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    document.querySelector('input')?.focus();
  }, []);

  const filteredSchedule = React.useMemo(() => {
    if (!searchKeyword.length) {
      return schedule;
    }
    return schedule.filter(s => {
      return s[searchBy].toLowerCase().includes(searchKeyword.toLowerCase());
    });
  }, [schedule, searchBy, searchKeyword]);

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
              <VaxLocation location={location} />
            </WrapItem>
          ))}
        </Wrap>
      </Stack>
    </>
  );
}
