import * as React from 'react';

import Fuse from 'fuse.js';

function useFuzzySearch<T>(list: T[], searchTerm: string) {
  const fuse = React.useMemo(() => {
    const fuseOptions = {
      keys: ['nama_lokasi_vaksinasi', 'wilayah', 'kecamatan', 'kelurahan'],
      threshold: 0.4
    };

    return new Fuse(list, fuseOptions);
  }, [list]);

  const results = React.useMemo(() => {
    return fuse.search(searchTerm);
  }, [fuse, searchTerm]);

  return results;
}

export default useFuzzySearch;
