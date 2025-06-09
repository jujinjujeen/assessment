import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * A generic hook that takes:
 *   1) a function `fetcher: (...args: A) => Promise<T>`
 *   2) zero or more parameters of type `A`
 * and returns { data, loading, error } of type T.
 */
export function useFetch<T, A extends unknown[]>(
  fetcher: (...args: A) => Promise<T>,
  ...params: A
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);

  const retry = () => {
    setRetries((prev) => prev + 1);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher(...params)
      .then((res) => {
        if (!cancelled) {
          setData(res);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, JSON.stringify(params), retries]);

  return { data, loading, error, retry };
}
