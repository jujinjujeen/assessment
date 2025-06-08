import { usePageTitle } from '../hooks/usePageTitle';
import { useFetch } from '../hooks/useFetch';
import { fetchSeasons } from '../api/seasons';
import { PageLayout } from '../layouts/PageLayout';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { ErrorMessage } from '../components/UI/ErrorMessage';
import { EmptyState } from '../components/UI/EmptyState';
import { SeasonsList } from '../components/season/SeasonList';

export const HomePage = () => {
  usePageTitle('F1 Seasons');

  const { data, loading, error } = useFetch(fetchSeasons);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner message="Loading F1 seasons..." />;
    }

    if (error) {
      return <ErrorMessage error={error} />;
    }

    if (!data || data.length === 0) {
      return <EmptyState message="No F1 seasons available" icon="🏁" />;
    }

    return <SeasonsList seasons={data} />;
  };

  return <PageLayout title="F1 Seasons">{renderContent()}</PageLayout>;
};
