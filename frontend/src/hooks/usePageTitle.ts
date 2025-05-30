import { useEffect } from 'react';

/**
 * On mount sets page title to {newTitle}
 * on unmount resets it back
 * @param newTitle title to be set
 */
export const usePageTitle = (newTitle: string) => {
  useEffect(() => {
    document.title = newTitle;
  }, [newTitle]);
};
