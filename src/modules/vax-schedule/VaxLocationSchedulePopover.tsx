import * as React from 'react';

import { Jadwal } from '~data/types';

import VaxLocationScheduleTable from './VaxLocationScheduleTable';

import { Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';

type VaxLocationSchedulePopoverProps = Pick<Jadwal, 'id' | 'label' | 'waktu'>;

export default function VaxLocationSchedulePopover({ id, waktu }: VaxLocationSchedulePopoverProps) {
  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Button size="sm" variant="outline">
          {id}
        </Button>
      </PopoverTrigger>
      <PopoverContent w={['95vw', '30vw']}>
        <PopoverArrow />
        <PopoverBody>
          <VaxLocationScheduleTable waktu={waktu} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
