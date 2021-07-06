export interface VaccinationData {
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
  created_at?: null;
  updated_at?: null;
  pcare: boolean;
  jadwal?: Jadwal[] | null;
  detail_lokasi?: (DetailLokasi | null)[] | null;
  last_updated_at: string;
}
export interface Jadwal {
  id: string;
  label: string;
  kode_lokasi_vaksinasi: number;
  waktu?: Waktu[] | null;
}

export interface Waktu {
  id: string;
  label: string;
  kuota: Kuota;
}

export interface Kuota {
  totalKuota?: number | null;
  sisaKuota?: number | null;
  jakiKuota?: number | null;
}

export interface DetailLokasi {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox?: string[] | null;
  lat: string;
  lon: string;
  display_name: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export type VaccinationDataFields = keyof VaccinationData;
