import {
  Link as ChakraLink,
  Badge,
  Text,
  Heading,
  Wrap,
  Stack,
  Select,
  Input,
} from "@chakra-ui/react";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { getSchedule } from "../data/getSchedule";
import React from "react";

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
        <Text>
          KEC/KEL: {kecamatan} / {kelurahan}
        </Text>
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
  const [searchBy, setSearchBy] = React.useState("kecamatan");
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const scheduleToRender = ({ schedule, searchBy, searchKeyword }) => {
    if (!searchKeyword.length) {
      return schedule;
    }
    return schedule.filter((props) => {
      return props[searchBy]
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
    });
  };

  return (
    <Container minHeight="100vh">
      <DarkModeSwitch />
      <Stack>
        <Heading>Lokasi dan Jadwal Vaksinasi DKI Jakarta</Heading>

        <Container direction="row">
          <Select
            flexBasis={"30vw"}
            flexGrow={0}
            value={searchBy}
            marginRight={1}
            onChange={(e) => {
              setSearchBy(e.target.value);
            }}
          >
            <option value="kecamatan">Kecamatan</option>
            <option value="kelurahan">Kelurahan</option>
          </Select>
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          ></Input>
        </Container>

        <Container w="100%">
          <Wrap w="98%">
            {scheduleToRender({ schedule, searchBy, searchKeyword }).map(
              (l, index) => {
                return <VaxLocation key={index} {...l} />;
              }
            )}
          </Wrap>
        </Container>
      </Stack>
    </Container>
  );
};

export default Index;
