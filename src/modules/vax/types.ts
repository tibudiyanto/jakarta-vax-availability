import type { DetailLokasi, VaccinationData } from '~data/types';

export interface DetailLokasiWithDistance extends DetailLokasi {
  distance?: string | null;
}

export interface VaccinationDataWithDistance extends Omit<VaccinationData, 'detail_lokasi'> {
  detail_lokasi?: DetailLokasiWithDistance[];
}
