import { useParams, useNavigate } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchSeasonDetails } from '../api/seasons';
import { useFetch } from '../hooks/useFetch';
import { PageLayout } from '../layouts/PageLayout';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { ErrorMessage } from '../components/UI/ErrorMessage';
import { EmptyState } from '../components/UI/EmptyState';
import { RacesList } from '../components/race/RaceList';

export const SeasonPage = () => {
  const { seasonId } = useParams();
  const navigate = useNavigate();

  usePageTitle(`F1 Season ${seasonId}`);

  const { data, loading, error, retry } = useFetch(
    fetchSeasonDetails,
    seasonId || ''
  );

  const handleBack = () => {
    navigate(-1);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <LoadingSpinner message={`Loading ${seasonId} season details...`} />
      );
    }

    if (error) {
      return <ErrorMessage error={error} onRetry={retry} />;
    }

    if (!data || data.length === 0) {
      return (
        <EmptyState
          message={`No race details available for ${seasonId} season`}
          icon="🏁"
        />
      );
    }

    return <RacesList races={data} />;
  };

  return (
    <PageLayout title={`${seasonId} Season`} showBackButton onBack={handleBack}>
      {renderContent()}
    </PageLayout>
  );
};

export default SeasonPage;
