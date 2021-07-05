import { IApiResp, ISchedule } from 'interface';
import fetch from 'isomorphic-unfetch';

export const SCHEDULE_ENDPOINT = `https://vaksin-jakarta.yggdrasil.id/`;

export async function getSchedule(): Promise<IApiResp<ISchedule>> {
  const res = await fetch(SCHEDULE_ENDPOINT);
  const payload: IApiResp<ISchedule> = await res.json();
  return payload;
}
