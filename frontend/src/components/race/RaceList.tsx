import { RaceCard } from './RaceCard';
import type { Race } from '@f1/types/api-schemas';

interface RacesListProps {
  races: Race[];
}

export const RacesList = ({ races }: RacesListProps) => {
  return (
    <section
      className="space-y-4"
      aria-label={`${races.length} races in this season`}
    >
      {races.map((race, index) => (
        <RaceCard key={race.id || `race-${index}`} race={race} index={index} />
      ))}
    </section>
  );
};
