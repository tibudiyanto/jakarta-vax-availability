import { VaccinationData } from './types';

import fetch from 'isomorphic-unfetch';

const SCHEDULE_ENDPOINT = `https://vaksin-jakarta.yggdrasil.id/`;

const getSchedule = async () => {
  const payload = await fetch(SCHEDULE_ENDPOINT);
  const json = (await payload.json()) as VaccinationData[];

  return json;
};

export { getSchedule };
