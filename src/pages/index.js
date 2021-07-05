import {
  Link as ChakraLink,
  Badge,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Heading,
  Wrap,
  Stack,
} from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon } from "@chakra-ui/icons";
import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { getSchedule } from "../data/getSchedule";

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
      w={["100vw", "30vw"]}
      h={["10em"]}
    >
      <Stack padding={1}>
        <Text>{namaLokasi}</Text>
        <Text>{kecamatan}</Text>
        <Text>{kelurahan}</Text>
        <Text>{wilayah}</Text>
        <Stack direction="row">
          {jadwal.map(({ id }) => {
            return <Badge key={id}>{id}</Badge>;
          })}
        </Stack>
      </Stack>
    </Container>
  );
};

const Index = ({ schedule }) => {
  return (
    <Container minHeight="100vh">
      <DarkModeSwitch />
      <Stack>
        <Heading>Lokasi dan Jadwal Vaksinasi DKI Jakarta</Heading>

        <Container w="100%">
          <Wrap w="98%">
            {schedule.map((l, index) => {
              return <VaxLocation key={index} {...l} />;
            })}
          </Wrap>
        </Container>
      </Stack>
    </Container>
  );
};

export default Index;
