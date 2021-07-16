import * as React from 'react';

import { Kuota, Waktu } from '~data/types';

import { Table, Tbody, Td, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';

interface VaxLocationScheduleTableProps {
  waktu: Waktu[];
}

export default function VaxLocationScheduleTable({ waktu }: VaxLocationScheduleTableProps) {
  const kuotaAvailableTextColor = useColorModeValue('green.600', 'green.400');
  const kuotaEmptyTextColor = useColorModeValue('red.600', 'red.400');

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Waktu</Th>
          <Th>Sisa Kuota</Th>
          <Th>Total Kuota</Th>
        </Tr>
      </Thead>
      <Tbody>
        {waktu.map(({ id, kuota }) => {
          const { sisaKuota = 0, totalKuota = 0 } = kuota as Kuota;

          const kuotaColor = sisaKuota && sisaKuota > 0 ? kuotaAvailableTextColor : kuotaEmptyTextColor;

          return (
            <Tr key={id}>
              <Td>{id}</Td>
              <Td color={kuotaColor} fontWeight={700}>
                {sisaKuota}
              </Td>
              <Td>{totalKuota}</Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
