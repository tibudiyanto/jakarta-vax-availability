import React from "react";
import {
  Box,
  Link as ChakraLink,
  Badge,
  Text,
  Heading,
  Wrap,
  Stack,
  Select,
  Input,
  useDisclosure,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
  Link,
  SimpleGrid,
  useColorMode,
} from "@chakra-ui/react";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { getSchedule } from "../data/getSchedule";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { getDistanceFromLatLonInKm } from "../utils/location";

export async function getStaticProps({ params }) {
  const schedule = await getSchedule();
  return {
    props: {
      schedule,
    },
    revalidate: 60,
  };
}

const VaxLocationDetail = (location) => {};

const VaxLocation = (props) => {
  const {
    loading,
    nama_lokasi_vaksinasi: namaLokasi,
    alamat_lokasi_vaksinasi: alamatLokasi,
    wilayah,
    kecamatan,
    kelurahan,
    rt,
    rw,
    jadwal,
    detail_lokasi,
    isUserLocationExist,
  } = props;

  const { colorMode } = useColorMode();

  const distanceBg = { light: "gray.200", dark: "gray.800" };

  return (
    <Container
      border={"1px solid black"}
      alignItems="start"
      minHeight={["10em"]}
    >
      {!loading && isUserLocationExist && detail_lokasi.length > 0 ? (
        <Box bg={distanceBg[colorMode]} w="100%" p={2}>
          <Text align="center">
            JARAK DARI LOKASI ANDA : {detail_lokasi[0].distance} KM
          </Text>
        </Box>
      ) : (
        ""
      )}
      <Stack padding={1} w="100%">
        <Text>{namaLokasi}</Text>
        <Text>
          KEC/KEL: {kecamatan} / {kelurahan}
        </Text>
        <Text>{wilayah}</Text>
        <Stack direction="row" wrap="wrap" gridRowGap={2} paddingBlockEnd={2}>
          {jadwal.map(({ id, waktu }) => {
            return (
              <Popover key={id}>
                <PopoverTrigger>
                  <Button>{id}</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Stack>
                      {waktu.map(({ label, id }) => {
                        return <Text key={id}>{label}</Text>;
                      })}
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
};

const Index = ({ schedule }) => {
  const [searchBy, setSearchBy] = React.useState("kecamatan");
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [userLocation, setUserLocation] = React.useState({
    loading: false,
    lat: 0,
    lon: 0,
    error: "",
  });

  React.useEffect(() => {
    if (window && window.navigator && window.navigator.permissions) {
      window.navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          if (status.state === "granted") {
            getUserLocation();
          }
        });
    }
  }, []);

  const scheduleToRender = ({ schedule, searchBy, searchKeyword }) => {
    if (!searchKeyword.length && !userLocation.lat && !userLocation.lon) {
      return schedule;
    }

    if (userLocation.lat && userLocation.lon) {
      /**
       * Add distance from current location to the vax location
       * for each item in `detail_lokasi` and sort it by the nearest.
       */
      return schedule
        .filter((props) => {
          return props[searchBy]
            .toLowerCase()
            .includes(searchKeyword.toLowerCase());
        })
        .map((item) => ({
          ...item,
          detail_lokasi:
            item.detail_lokasi.length > 0
              ? item.detail_lokasi
                  .map((loc) => ({
                    ...loc,
                    distance: getDistanceFromLatLonInKm(
                      userLocation.lat,
                      userLocation.lon,
                      Number(loc.lat),
                      Number(loc.lon)
                    ),
                  }))
                  .sort((a, b) => a.distance - b.distance)
              : item.detail_lokasi,
        }))
        .sort((a, b) => {
          if (a.detail_lokasi[0] === undefined) {
            return 1;
          } else if (b.detail_lokasi[0] === undefined) {
            return -1;
          } else if (
            a.detail_lokasi[0].distance &&
            b.detail_lokasi[0].distance
          ) {
            return a.detail_lokasi[0].distance < b.detail_lokasi[0].distance
              ? -1
              : 1;
          }
        });
    }

    return schedule.filter((props) => {
      return props[searchBy]
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
    });
  };

  const getUserLocation = () => {
    setUserLocation((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({
          loading: false,
          lat: coords.latitude,
          lon: coords.longitude,
          error: "",
        });
      },
      (error) => {
        console.error(`Get geolocation error: ${error.message}`);
        setUserLocation({
          loading: false,
          lat: 0,
          lon: 0,
          error: "Get geolocation error",
        });
      },
      {
        enableHighAccuracy: false,
        timeout: Infinity,
        maximumAge: 0,
      }
    );
  };

  const handleButtonClickUserLocation = () => {
    if (!navigator || !navigator.geolocation) {
      console.error("Geolocation is not supported");
      setUserLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported",
      }));
      return;
    }

    getUserLocation();
  };

  return (
    <Container minHeight="100vh" overflowX="hidden">
      <DarkModeSwitch />
      <Link href="/map">
        <Button
          position="absolute"
          right={20}
          top={2}
          leftIcon={<ExternalLinkIcon />}
          variant="solid"
        >
          Peta
        </Button>
      </Link>
      <Stack paddingInline={[4, 6]} width="100%">
        <Heading paddingBlockStart="8">
          Lokasi dan Jadwal Vaksinasi DKI Jakarta
        </Heading>

        <Flex direction="row">
          <Button
            flexShrink={0}
            mr={2}
            onClick={handleButtonClickUserLocation}
            isLoading={userLocation.loading}
            isDisabled={Boolean(userLocation.lat && userLocation.lon)}
          >
            {userLocation.lat && userLocation.lon
              ? "Lokasi Ditemukan"
              : "Dapatkan Lokasi Anda"}
          </Button>
          <Select
            mr={2}
            flexShrink={0}
            value={searchBy}
            width="auto"
            onChange={(e) => {
              setSearchBy(e.target.value);
            }}
          >
            <option value="kecamatan">Kecamatan</option>
            <option value="kelurahan">Kelurahan</option>
          </Select>
          <Input
            placeholder="cari kecamatan / kelurahan"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          ></Input>
        </Flex>

        <SimpleGrid columns={[1, 2, 3]} spacing={2}>
          {scheduleToRender({ schedule, searchBy, searchKeyword }).map(
            (l, index) => {
              return (
                <VaxLocation
                  key={index}
                  loading={userLocation.loading}
                  isUserLocationExist={userLocation.lat && userLocation.lon}
                  {...l}
                />
              );
            }
          )}
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default Index;
