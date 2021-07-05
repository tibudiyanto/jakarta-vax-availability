import fetch from 'isomorphic-unfetch';

const scheduleEndpoint = 'https://vaksin-jakarta.yggdrasil.id/';

const getSchedule = async () => {
  const payload = await fetch(scheduleEndpoint);
  const json = await payload.json();
  return json;
};

export { getSchedule };
