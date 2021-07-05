import config from '../config'

import { Link, Stack, Text } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Stack
      align="center"
      fontSize="sm"
      justify="center"
      px={2}
      py={[8, 16]}
      spacing={1}
      textAlign="center"
    >
      <Text>Made using Next.js and Chakra UI. Hosted on Vercel.</Text>
      <Link color="blue.300" href={config.repoUrl} isExternal>
        View repository
      </Link>
    </Stack>
  )
}
