import type { Race } from '@f1/types/api-schemas';

interface RaceCardProps {
  race: Race;
  index: number;
}

export const RaceCard = ({ race, index }: RaceCardProps) => {
  const { driver } = race;
  const isChampion = driver.isSeasonChampion;

  return (
    <article
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 border p-4 ${
        isChampion
          ? 'border-yellow-300 dark:border-yellow-600 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20'
          : 'border-gray-200 dark:border-gray-700'
      }`}
      aria-label={`Race ${index + 1}: ${race.name}, winner: ${
        race.driver.givenName
      } ${race.driver.givenName}${isChampion ? ', season champion' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
              #{index + 1}
            </span>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {race.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏁</span>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Winner:</span> {driver.givenName}{' '}
              {driver.familyName}
            </p>
          </div>
        </div>
        {isChampion && (
          <div className="flex flex-col items-center ml-4">
            <span className="text-2xl">👑</span>
            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mt-1">
              Champion
            </span>
          </div>
        )}
      </div>
    </article>
  );
};
