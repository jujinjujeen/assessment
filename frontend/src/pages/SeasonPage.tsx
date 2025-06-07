import { useParams, useNavigate } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchSeasonDetails } from '../api/seasons';
import { useFetch } from '../hooks/useFetch';

export const SeasonPage = () => {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  usePageTitle(`F1 Season ${seasonId}`);
  const { data, loading, error } = useFetch(fetchSeasonDetails, seasonId || '');

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        back
      </button>
      <h1 className="text-4xl font-bold mb-4">F1 Season {seasonId}</h1>
      {loading && <p className="text-lg">Loading season details...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data && (
        <ul className="list-disc list-inside">
          {data.map((race) => (
            <li>
              {race.name} - {race.driver.givenName} {race.driver.givenName}{' '}
              {race.driver.isSeasonChampion ? '✅' : ''}
            </li>
          ))}
        </ul>
      )}
      {!loading && !data && !error && (
        <p className="text-lg">No season details available.</p>
      )}
    </div>
  );
};
