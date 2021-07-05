export interface IApiResp<T> {
  data: T;
  errors: {
    message: string;
    code: number;
  };
}

export interface IUserLocation {
  loading: boolean;
  lat: number;
  lon: number;
  error: string;
}

export type TSearchBy = 'kecamatan' | 'kelurahan';

export interface ISchedule {
  alamat_lokasi_vaksinasi: string;
  created_at: number | null;
  detail_lokasi: IDetailLokasi[];
  jadwal: IJadwal[];
  jenis_faskes: string;
  jumlah_tim_vaksinator: number;
  kecamatan: string;
  kelurahan: string;
  kode_lokasi_vaksinasi: number;
  kodepos: string;
  last_updated_at: string;
  nama_faskes: string;
  nama_lokasi_vaksinasi: string;
  pcare: boolean;
  rt: string;
  rw: string;
  updated_at: number | null;
  wilayah: string;
}

interface IDetailLokasi {
  boundingbox: String[];
  category: string;
  display_name: string;
  importance: number;
  lat: string;
  licence: string;
  lon: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
  place_rank: number;
  type: string;
  distance?: number;
}

export interface IJadwal {
  id: string;
  kode_lokasi_vaksinasi: number;
  label: string;
  waktu: IWaktu[];
}

interface IWaktu {
  id: string;
  label: string;
  kuota: {
    jakiKuota: number;
    sisaKuota: number;
    totalKuota: number;
  };
}
