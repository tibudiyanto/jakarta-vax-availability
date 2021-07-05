import { distance, point } from '@turf/turf';

interface UserLocation {
  lat: number;
  lon: number;
}

export interface Location {
  kode_lokasi_vaksinasi: number;
  nama_lokasi_vaksinasi: string;
  alamat_lokasi_vaksinasi: string;
  wilayah: string;
  kecamatan: string;
  kelurahan: string;
  rt: string;
  rw: string;
  kodepos: string;
  jenis_faskes: string;
  jumlah_tim_vaksinator: number;
  nama_faskes: string;
  created_at: Date | null;
  updated_at: Date | null;
  pcare: boolean;
  detail_lokasi: DetailLocation[];
  last_updated_at: Date;
  distanceFromCurrentLocation?: number;
  jadwal: {
    id: string;
    kode_lokasi_vaksinasi: number;
    label: string;
    waktu: {
      id: string;
      kuota: Record<string, string>;
      label: string;
    }[];
  }[];
}

interface DetailLocation {
  boundingbox: string[];
  category: 'string';
  display_name: 'string';
  importance: number;
  lat: 'string';
  licence: 'string';
  lon: 'string';
  osm_id: number;
  osm_type: 'string';
  place_id: number;
  place_rank: number;
  type: string;
}

// Sort by Point to Point distance
export function sortByDistance(userLocation: UserLocation, data: Location[]): Location[] {
  if (!userLocation.lat || !userLocation.lon) {
    return data;
  }
  const from = point([userLocation.lat, userLocation.lon]);

  const resultWithDistance = data.map(location => {
    if (location.detail_lokasi.length > 0) {
      const { lat, lon } = location.detail_lokasi[0];
      const to = point([Number(lat), Number(lon)]);
      // In Kilometer
      const distanceFromCurrentLocation = distance(from, to);
      return {
        ...location,
        distanceFromCurrentLocation
      };
    }
    return location;
  });

  return resultWithDistance.sort((a, b) => {
    const distanceA = a.distanceFromCurrentLocation ?? undefined;
    const distanceB = b.distanceFromCurrentLocation ?? undefined;
    if (distanceA === undefined) {
      return 1;
    }
    if (distanceB === undefined) {
      return -1;
    }
    return distanceA - distanceB;
  });
}
