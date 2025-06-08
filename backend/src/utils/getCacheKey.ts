const BASE = 'cache:/api';

export const cacheKey = {
  SEASONS: `${BASE}/seasons`,
  getRacesBySeason: (seasonId: string) => `${BASE}/seasons/${seasonId}/races`,
};
