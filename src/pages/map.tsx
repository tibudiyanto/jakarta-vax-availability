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
  IconButton,
  Box,
  HStack,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { Fragment } from "react";
import ReactMapboxGl, { Marker, Popup } from "react-mapbox-gl";
import Link from "next/link";
import { Container } from "../components/Container";
import { getSchedule } from "../data/getSchedule";
import "mapbox-gl/dist/mapbox-gl.css";

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

const Mark = () => (
  <Box
    bg="red"
    borderColor="darkred"
    borderRadius="50%"
    width="20px"
    height="20px"
    borderStyle="solid"
    borderWidth="4px"
  />
);

const MapPage = ({ schedule }) => {
  const [map, setMap] = React.useState(null);
  const [activeLoc, setActiveLoc] = React.useState(null);
  const [searchBy, setSearchBy] = React.useState("kecamatan");
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const scheduleToRender = ({ schedule, searchBy, searchKeyword }) => {
    if (!searchKeyword.length) {
      return schedule;
    }
    const result = schedule.filter((props) => {
      return (
        props[searchBy].toLowerCase().includes(searchKeyword.toLowerCase()) &&
        props["detail_lokasi"].length
      );
    });

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
        onDrag={(e) => setActiveLoc(null)}
        onStyleLoad={(map) => {
          setMap(map);
          map.setCenter({ lat: -6.163088, lng: 106.836715 });
        }}
      >
        <>
          {coordinates.map((coordinate, i) => {
            return (
              //@ts-ignore
              <Marker key={i} coordinates={coordinate}>
                <Box
                  onClick={() => {
                    setActiveLoc(coordinate.lokasi);
                    if (map) {
                      map.easeTo({
                        center: {
                          lat: coordinate.lokasi.lat,
                          lng: coordinate.lokasi.lon,
                        },
                        padding: { bottom: 340 },
                      });
                    }
                  }}
                >
                  <Mark key={i} />
                </Box>
              </Marker>
            );
          })}
          {activeLoc && (
            <Popup
              key={activeLoc.osm_id}
              //@ts-ignore
              coordinates={{ lat: activeLoc.lat, lng: activeLoc.lon }}
              style={{ marginLeft: -150, marginTop: 40 }}
            >
              <Popover isOpen={true} autoFocus={false}>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton onClick={() => setActiveLoc(null)} />
                  <PopoverHeader>{activeLoc.display_name}</PopoverHeader>
                  <PopoverBody maxHeight="300px" overflowY="auto">
                    {activeLoc.jadwal.map(({ id, waktu }) => {
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
            </Popup>
          )}
        </>
      </Map>
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100%"
        maxWidth="450px"
        height="80px"
        zIndex={99999}
      >
        <Box margin={2} bg="black" borderRadius={10} padding={2}>
          <HStack spacing="8px">
            ]
            <Link href="/" passHref>
              <IconButton
                as="a"
                aria-label="Back to Home"
                icon={<ArrowBackIcon />}
                borderRadius={4}
              />
            </Link>
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
              onChange={(e) => {
                setSearchKeyword(e.target.value);

                setTimeout(() => {
                  if (lokasiMap.length && lokasiMap[0]) {
                    map.easeTo({
                      center: {
                        lat: parseFloat(lokasiMap[0].lat),
                        lng: parseFloat(lokasiMap[0].lon),
                      },
                      padding: { bottom: 340 },
                    });
                    setActiveLoc(lokasiMap[0]);
                  } else {
                    setActiveLoc(null);
                  }
                }, 100);
              }}
              fontSize={[14, 16]}
            />
          </HStack>
        </Box>
      </Box>
    </Container>
  );
};

export default MapPage;
