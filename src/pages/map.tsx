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
import ReactMapboxGl from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
});

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
          {}
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
  const [center, setCenter] = React.useState("-6.206247, 106.843739");

  const centerSplit = center.split(",").map((item) => parseFloat(item.trim()));
  const centerObj = { lng: centerSplit[1], lat: centerSplit[0] };

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
      <Map
        style="mapbox://styles/mapbox/streets-v8"
        containerStyle={{
          height: "100vh",
          width: "100%",
        }}
        //@ts-ignore
        center={centerObj}
      />
      <div
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0, padding: 20 }}
      >
        <Container w="100%">
          <Wrap w="98%">
            {scheduleToRender({ schedule, searchBy, searchKeyword }).map(
              (l, index) => {
                return <VaxLocation key={index} {...l} />;
              }
            )}
          </Wrap>
        </Container>
      </div>
    </Container>
  );
};

export default Index;


