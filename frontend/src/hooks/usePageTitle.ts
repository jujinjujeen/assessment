import { useEffect } from 'react';

/**
 * On mount sets page title to {newTitle}
 * on unmount resets it back
 * @param newTitle title to be set
 */
export const usePageTitle = (newTitle: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = newTitle;

    return () => {
      document.title = prevTitle;
    };
  }, [newTitle]);
};
