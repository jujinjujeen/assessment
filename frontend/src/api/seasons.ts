import type { SeasonsResponse, RacesResponse } from '@f1/types/api-schemas';

export const fetchSeasons = async (): Promise<SeasonsResponse> => {
  const res = await fetch('/api/seasons');
  if (!res.ok) throw new Error('Failed to load seasons');
  return res.json();
};

export const fetchSeasonDetails = async (
  seasonId: string
): Promise<RacesResponse> => {
  const res = await fetch(`/api/seasons/${seasonId}/races`);
  if (!res.ok) throw new Error('Failed to load season details');
  return res.json();
};
