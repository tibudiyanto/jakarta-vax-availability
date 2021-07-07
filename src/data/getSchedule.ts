import { VaccinationData, VaccinationDataRt } from './types';

import fetch from 'isomorphic-unfetch';

const SCHEDULE_ENDPOINT = `https://vaksin-jakarta.yggdrasil.id/`;

const getSchedule = async () => {
  const payload = await fetch(SCHEDULE_ENDPOINT);
  const json = (await payload.json()) as VaccinationData[];
  const validation = VaccinationDataRt.validate(json);
  // give warning to console if the validation is not success.
  // change it to more strict one if the API is already stable
  if (!validation.success) {
    console.error(validation);
  }

  return json;
};

export { getSchedule };
