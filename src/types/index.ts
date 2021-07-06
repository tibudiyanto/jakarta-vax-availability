export const VALID_SEARCH_FILTERS = ['kecamatan', 'kelurahan'] as const;

export type SearchFilter = typeof VALID_SEARCH_FILTERS[number];
