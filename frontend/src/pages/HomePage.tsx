import { useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

export const HomePage = () => {
  usePageTitle('F1 Seasons');

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('API is healthy:', data);
      })
      .catch((error) => {
        console.error('Error fetching API health:', error);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">F1 Seasons</h1>
    </div>
  );
};
