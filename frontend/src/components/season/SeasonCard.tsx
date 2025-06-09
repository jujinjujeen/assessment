import { Link } from 'react-router';
import type { Season } from '@f1/types/api-schemas';
import { memo } from 'react';

interface SeasonCardProps {
  season: Season;
}

export const SeasonCard = memo(({ season }: SeasonCardProps) => {
  return (
    <Link
      to={`/season/${season.year}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-900/50 transition-shadow border border-gray-200 dark:border-gray-700 p-6 group"
      aria-label={`View details for ${season.year} Formula 1 season, champion: ${season.winner}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            🏆 {season.year} Season
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Champion:</span> {season.winner}
          </p>
        </div>
        <div className="text-2xl group-hover:translate-x-1 transition-transform">
          ➡️
        </div>
      </div>
    </Link>
  );
});
