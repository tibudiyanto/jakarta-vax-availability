import {
  Link as ChakraLink,
  Badge,
  Text,
  Heading,
  Wrap,
  Stack,
  Select,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Box,
  Flex,
} from "@chakra-ui/react";
import { Container } from "../components/Container";
import { getSchedule } from "../data/getSchedule";
import React, { Fragment } from "react";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
});

const Mark = ({ lokasi }) => (
  <Popover>
    <PopoverTrigger>
      <div
        style={{
          backgroundColor: "#e74c3c",
          borderRadius: "50%",
          width: 20,
          height: 20,
          border: "4px solid #eaa29b",
        }}
      />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>{lokasi.display_name}</PopoverHeader>
      <PopoverBody>
        {lokasi.jadwal.map(({ id, waktu }) => {
          return (
            <Fragment key={id}>
              <Text fontWeight="extrabold">{id}</Text>
              {waktu.map(({ label, id }) => {
                return <Text key={id}>{label}</Text>;
              })}
            </Fragment>
          );
        })}
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

export async function getStaticProps({ params }) {
  const schedule = await getSchedule();
  return {
    props: {
      schedule,
    },
    revalidate: 60,
  };
}

const Index = ({ schedule }) => {
  const [map, setMap] = React.useState(null);
  const [searchBy, setSearchBy] = React.useState("kecamatan");
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const scheduleToRender = ({ schedule, searchBy, searchKeyword }) => {
    if (!searchKeyword.length) {
      return schedule;
    }
    const result = schedule.filter((props) => {
      return props[searchBy]
        .toLowerCase()
        .includes(searchKeyword.toLowerCase()) && props["detail_lokasi"].length;
    });


    const detail = result[0] && result[0].detail_lokasi;
    if (detail && detail[0] && map) {
      map.setCenter({
        lat: parseFloat(detail[0].lat),
        lng: parseFloat(detail[0].lon),
      });
    }

    return result;
  };

  let lokasiMap = [];

  scheduleToRender({ schedule, searchBy, searchKeyword }).forEach((l) => {
    l.detail_lokasi.forEach((lokasi) => {
      lokasiMap.push({ ...lokasi, jadwal: l.jadwal });
    });
  });

  const coordinates = lokasiMap.map((item) => ({
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    lokasi: item,
  }));

  return (
    <Container minHeight="100vh">
      <Map
        style="mapbox://styles/mapbox/streets-v8"
        containerStyle={{
          height: "100vh",
          width: "100%",
        }}
        onStyleLoad={(map) => {
          setMap(map);
          map.setCenter({ lat: -6.163088, lng: 106.836715 });
        }}
      >
        {coordinates.map((coordinate, i) => {
          return (
            //@ts-ignore
            <Marker key={i} coordinates={coordinate}>
              <Mark key={i} lokasi={coordinate.lokasi} />
            </Marker>
          );
        })}
      </Map>
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100%"
        maxWidth={450}
        height={150}
        zIndex={999999999999}
      >
        <Box margin={2} bg="black" borderRadius={10} padding={2}>
          <Flex direction="row">
            <Select
              flexShrink={0}
              value={searchBy}
              marginRight={1}
              width="auto"
              onChange={(e) => {
                setSearchBy(e.target.value);
              }}
              fontSize={[14, 16]}
            >
              <option value="kecamatan">Kecamatan</option>
              <option value="kelurahan">Kelurahan</option>
            </Select>
            <Input
              placeholder="cari kecamatan / kelurahan"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              fontSize={[14, 16]}
            ></Input>
          </Flex>
        </Box>
      </Box>
    </Container>
  );
};

export default Index;
