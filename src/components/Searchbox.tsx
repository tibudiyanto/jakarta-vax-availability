import * as React from 'react';

import { Input } from '@chakra-ui/react';

interface Props {
  keyword: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Searchbox({ keyword, onChange }: Props) {
  return (
    <Input
      flexGrow={1}
      fontSize={[14, 16]}
      onChange={onChange}
      placeholder="Cari kecamatan/kelurahan/nama lokasi vaksinasi"
      value={keyword}
    />
  );
}
