import { usePageTitle } from '../hooks/usePageTitle';
import { useFetch } from '../hooks/useFetch';
import { fetchSeasons } from '../api/seasons';
import { Link } from 'react-router';

export const HomePage = () => {
  usePageTitle('F1 Seasons');

  const { data, loading, error } = useFetch(fetchSeasons);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">F1 Seasons</h1>
      {loading && <p className="text-lg">Loading seasons...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data && (
        <ul className="list-disc list-inside">
          {data.map((season) => (
            <li key={season.id} className="text-lg">
              <Link
                to={`/season/${season.year}`}
                className="text-blue-500 hover:underline"
              >
                Season {season.year} - {season.winner}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!loading && !data && !error && (
        <p className="text-lg">No seasons available.</p>
      )}
    </div>
  );
};
