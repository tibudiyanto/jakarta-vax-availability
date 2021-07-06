import { LngLatBoundsLike } from 'mapbox-gl';

export interface LngLat {
  lat: number;
  lng: number;
}

export function getMapBounds(listOfLngLat: LngLat[]): LngLatBoundsLike {
  const listOfLong = [] as number[];
  const listOfLat = [] as number[];

  listOfLngLat.forEach(data => {
    listOfLong.push(Number(data.lng));
    listOfLat.push(Number(data.lat));
  });
  return [
    [Math.min(...listOfLong), Math.min(...listOfLat)],
    [Math.max(...listOfLong), Math.max(...listOfLat)]
  ];
}
