import * as rt from 'runtypes';

export const KuotaRt = rt.Record({
  totalKuota: rt.Union(rt.Null, rt.Number),
  sisaKuota: rt.Union(rt.Null, rt.Number),
  // the value is string and it's deprecated https://github.com/tibudiyanto/jakarta-vax-availability/issues/53#issuecomment-874673016
  jakiKuota: rt.Union(rt.Null, rt.String)
});

export const WaktuRt = rt.Record({
  id: rt.String,
  label: rt.String,
  kuota: KuotaRt.Or(rt.Record({}))
});

export const JadwalRt = rt.Record({
  id: rt.String,
  label: rt.String,
  kode_lokasi_vaksinasi: rt.Number,
  waktu: rt.Array(WaktuRt)
});

export const DetailLokasiRt = rt.Record({
  place_id: rt.Number,
  licence: rt.String,
  osm_type: rt.String,
  osm_id: rt.Number,
  boundingbox: rt.Array(rt.String),
  lat: rt.String,
  lon: rt.String,
  display_name: rt.String,
  place_rank: rt.Number,
  category: rt.String,
  type: rt.String,
  importance: rt.Number
});

export const VacctinationRt = rt.Record({
  kode_lokasi_vaksinasi: rt.Number,
  nama_lokasi_vaksinasi: rt.String,
  alamat_lokasi_vaksinasi: rt.String,
  wilayah: rt.String,
  kecamatan: rt.String,
  kelurahan: rt.String,
  rt: rt.String,
  rw: rt.String,
  kodepos: rt.String,
  jenis_faskes: rt.String,
  jumlah_tim_vaksinator: rt.Union(rt.Number, rt.Null),
  nama_faskes: rt.String,
  created_at: rt.Union(rt.Null, rt.String),
  updated_at: rt.Union(rt.Null, rt.String),
  pcare: rt.Boolean,
  jadwal: rt.Array(JadwalRt),
  detail_lokasi: rt.Array(DetailLokasiRt).Or(rt.Null),
  last_updated_at: rt.String
});

export const VaccinationDataRt = rt.Array(VacctinationRt);

export type VaccinationData = rt.Static<typeof VacctinationRt>;

export type Jadwal = rt.Static<typeof JadwalRt>;

export type Waktu = rt.Static<typeof WaktuRt>;

export type DetailLokasi = rt.Static<typeof DetailLokasiRt>;

export type Kuota = rt.Static<typeof KuotaRt>;

export interface Coordinate {
  lat: number;
  lng: number;
}

export type VaccinationDataFields = keyof VaccinationData;
