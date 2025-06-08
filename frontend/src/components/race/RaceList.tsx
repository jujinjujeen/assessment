import { RaceCard } from './RaceCard';
import type { Race } from '@f1/types/api-schemas';

interface RacesListProps {
  races: Race[];
}

export const RacesList = ({ races }: RacesListProps) => {
  return (
    <div className="space-y-4">
      {races.map((race, index) => (
        <RaceCard key={race.id || `race-${index}`} race={race} index={index} />
      ))}
    </div>
  );
};
