// src/components/season/SeasonsList.tsx
import { SeasonCard } from './SeasonCard';
import type { Season } from '@f1/types/api-schemas';

interface SeasonsListProps {
  seasons: Season[];
}

export const SeasonsList = ({ seasons }: SeasonsListProps) => {
  return (
    <section
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      aria-label={`${seasons.length} Formula 1 seasons available`}
    >
      {seasons.map((season) => (
        <SeasonCard key={season.id} season={season} />
      ))}
    </section>
  );
};
