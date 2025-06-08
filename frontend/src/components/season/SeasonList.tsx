// src/components/season/SeasonsList.tsx
import { SeasonCard } from './SeasonCard';
import type { Season } from '@f1/types/api-schemas';

interface SeasonsListProps {
  seasons: Season[];
}

export const SeasonsList = ({ seasons }: SeasonsListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {seasons.map((season) => (
        <SeasonCard key={season.id} season={season} />
      ))}
    </div>
  );
};
