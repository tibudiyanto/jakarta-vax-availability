import fetch from 'isomorphic-unfetch'

const SCHEDULE_ENDPOINT = `https://vaksin-jakarta.yggdrasil.id/`

export async function getSchedule() {
  const payload = await fetch(SCHEDULE_ENDPOINT)
  return payload.json()
}
