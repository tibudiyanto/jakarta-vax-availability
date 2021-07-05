import {
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

const VaxLocationDetail = (location) => { };

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
      minHeight={["10em"]}
    >
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
    <Container minHeight="100vh" overflowX="hidden">
      <DarkModeSwitch />
      <Stack paddingInline={[4, 6]} width="100%">
        <Heading paddingBlockStart="8">Lokasi dan Jadwal Vaksinasi DKI Jakarta</Heading>

        <Flex direction="row">
          <Select
            flexShrink={0}
            value={searchBy}
            marginRight={1}
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
