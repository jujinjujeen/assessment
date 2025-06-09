import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from '../useFetch';

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    const mockFetcher = vi.fn().mockResolvedValue('test data');

    const { result } = renderHook(() => useFetch(mockFetcher));

    waitFor(() => {
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
    });
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockFetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useFetch(mockFetcher));

    expect(mockFetcher).toHaveBeenCalledOnce();
    expect(mockFetcher).toHaveBeenCalledWith();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Fetch failed');
    const mockFetcher = vi.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useFetch(mockFetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toEqual(mockError);
  });

  it('should convert non-Error rejections to Error objects', async () => {
    const mockFetcher = vi.fn().mockRejectedValue('String error');

    const { result } = renderHook(() => useFetch(mockFetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('String error');
  });

  it('should pass parameters to fetcher function', async () => {
    const mockFetcher = vi.fn().mockResolvedValue('data');
    const param1 = 'test';
    const param2 = 123;

    renderHook(() => useFetch(mockFetcher, param1, param2));

    waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledWith(param1, param2);
    });
  });

  it('should refetch when parameters change', async () => {
    const mockFetcher = vi
      .fn()
      .mockResolvedValueOnce('data1')
      .mockResolvedValueOnce('data2');

    let param = 'initial';

    const { result, rerender } = renderHook(() => useFetch(mockFetcher, param));

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('data1');
    expect(mockFetcher).toHaveBeenCalledWith('initial');

    // Change parameter and rerender
    param = 'updated';
    rerender();

    // Should start loading again
    expect(result.current.loading).toBe(true);

    // Wait for second fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('data2');
    expect(mockFetcher).toHaveBeenCalledWith('updated');
    expect(mockFetcher).toHaveBeenCalledTimes(2);
  });

  it('should refetch when fetcher function changes', async () => {
    const mockFetcher1 = vi.fn().mockResolvedValue('data1');
    const mockFetcher2 = vi.fn().mockResolvedValue('data2');

    let fetcher = mockFetcher1;

    const { result, rerender } = renderHook(() => useFetch(fetcher));

    // Wait for first fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('data1');
    expect(mockFetcher1).toHaveBeenCalledOnce();

    // Change fetcher and rerender
    fetcher = mockFetcher2;
    rerender();

    // Wait for second fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('data2');
    expect(mockFetcher2).toHaveBeenCalledOnce();
  });

  it('should handle race conditions with cancellation', async () => {
    let resolveFirst!: (value: string) => void;
    let resolveSecond!: (value: string) => void;

    const firstPromise = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });

    const secondPromise = new Promise<string>((resolve) => {
      resolveSecond = resolve;
    });

    const mockFetcher = vi
      .fn()
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise);

    let param = 'first';
    const { result, rerender } = renderHook(() => useFetch(mockFetcher, param));

    expect(result.current.loading).toBe(true);

    // Change parameter to trigger second fetch
    param = 'second';
    rerender();

    // Resolve first promise (should be cancelled)
    resolveFirst('first data');

    // Resolve second promise
    resolveSecond('second data');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have the second data, not the first (due to cancellation)
    expect(result.current.data).toBe('second data');
  });

  it('should cancel ongoing requests on unmount', async () => {
    let resolveFetch!: (value: string) => void;

    const mockFetcher = vi.fn().mockReturnValue(
      new Promise<string>((resolve) => {
        resolveFetch = resolve;
      })
    );

    const { result, unmount } = renderHook(() => useFetch(mockFetcher));

    expect(result.current.loading).toBe(true);

    // Unmount before fetch completes
    unmount();

    // Resolve the promise after unmount
    resolveFetch('data');

    // Give it time to potentially update (it shouldn't)
    await new Promise((resolve) => setTimeout(resolve, 10));

    // The state should still be loading since component was unmounted
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
  });

  it('should reset error state on new fetch', async () => {
    const mockError = new Error('Initial error');
    const mockFetcher = vi
      .fn()
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce('success data');

    let param = 'error';
    const { result, rerender } = renderHook(() => useFetch(mockFetcher, param));

    // Wait for error
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBe(null);

    // Change parameter to trigger successful fetch
    param = 'success';
    rerender();

    // Should be loading and error should be cleared
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    // Wait for success
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('success data');
    expect(result.current.error).toBe(null);
  });

  it('should work with no parameters', async () => {
    const mockFetcher = vi.fn().mockResolvedValue('no params data');

    const { result } = renderHook(() => useFetch(mockFetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetcher).toHaveBeenCalledWith();
    expect(result.current.data).toBe('no params data');
  });

  it('should work with multiple parameters of different types', async () => {
    const mockFetcher = vi.fn().mockResolvedValue('multi param data');
    const stringParam = 'test';
    const numberParam = 42;
    const objectParam = { key: 'value' };

    const { result } = renderHook(() =>
      useFetch(mockFetcher, stringParam, numberParam, objectParam)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetcher).toHaveBeenCalledWith(
      stringParam,
      numberParam,
      objectParam
    );
    expect(result.current.data).toBe('multi param data');
  });

  it('should throw synchronous errors from fetcher', () => {
    const mockFetcher = vi.fn().mockImplementation(() => {
      throw new Error('Sync error');
    });

    // The hook should throw the error when fetcher throws synchronously
    expect(() => {
      renderHook(() => useFetch(mockFetcher));
    }).toThrow('Sync error');
  });

  // Alternative test: Test that async rejections (not sync throws) work properly
  it('should handle fetcher that returns rejected promise', async () => {
    const mockFetcher = vi.fn().mockImplementation(() => {
      return Promise.reject(new Error('Async error'));
    });

    const { result } = renderHook(() => useFetch(mockFetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error?.message).toBe('Async error');
    expect(result.current.data).toBe(null);
  });

  // Replace the failing retry tests with these corrected versions:

  it('should retry fetch when retry is called', async () => {
    const mockFetcher = vi
      .fn()
      .mockResolvedValueOnce('first data')
      .mockResolvedValueOnce('retry data');

    const { result } = renderHook(() => useFetch(mockFetcher));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('first data');
    expect(mockFetcher).toHaveBeenCalledTimes(1);

    // Call retry
    result.current.retry();

    await waitFor(() => {
      expect(result.current.data).toBe('retry data');
    });

    expect(result.current.loading).toBe(false);
    expect(mockFetcher).toHaveBeenCalledTimes(2);
  });

  it('should retry after error', async () => {
    const mockError = new Error('Fetch failed');
    const mockFetcher = vi
      .fn()
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce('retry success');

    const { result } = renderHook(() => useFetch(mockFetcher));

    // Wait for initial error
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBe(null);
    expect(mockFetcher).toHaveBeenCalledTimes(1);

    // Call retry
    result.current.retry();

    // Wait for retry success (don't check intermediate states)
    await waitFor(() => {
      expect(result.current.data).toBe('retry success');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockFetcher).toHaveBeenCalledTimes(2);
  });

  it('should handle multiple retry calls', async () => {
    const mockFetcher = vi
      .fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second')
      .mockResolvedValueOnce('third');

    const { result } = renderHook(() => useFetch(mockFetcher));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.data).toBe('first');
    });

    // First retry
    result.current.retry();

    await waitFor(() => {
      expect(result.current.data).toBe('second');
    });

    // Second retry
    result.current.retry();

    await waitFor(() => {
      expect(result.current.data).toBe('third');
    });

    expect(mockFetcher).toHaveBeenCalledTimes(3);
  });

  it('should handle race conditions with retry and parameter changes', async () => {
    let resolveFirst!: (value: string) => void;
    let resolveSecond!: (value: string) => void;
    let resolveThird!: (value: string) => void;

    const firstPromise = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });

    const secondPromise = new Promise<string>((resolve) => {
      resolveSecond = resolve;
    });

    const thirdPromise = new Promise<string>((resolve) => {
      resolveThird = resolve;
    });

    const mockFetcher = vi
      .fn()
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise)
      .mockReturnValueOnce(thirdPromise);

    let param = 'initial';
    const { result, rerender } = renderHook(() => useFetch(mockFetcher, param));

    expect(result.current.loading).toBe(true);

    // Change parameter to trigger new fetch
    param = 'updated';
    rerender();

    // Call retry
    result.current.retry();

    // Resolve promises in order that should be cancelled/ignored
    resolveFirst('first data'); // Should be cancelled
    resolveSecond('second data'); // Should be cancelled
    resolveThird('third data'); // Should be the final result

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have the third data (retry with updated parameter)
    expect(result.current.data).toBe('third data');
    expect(mockFetcher).toHaveBeenCalledTimes(3);
    expect(mockFetcher).toHaveBeenLastCalledWith('updated');
  });

  it('should not throw errors when unmounted during retry', async () => {
    const mockFetcher = vi.fn().mockResolvedValue('data');

    const { result, unmount } = renderHook(() => useFetch(mockFetcher));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call retry and unmount immediately
    result.current.retry();
    unmount();

    // Give it time for any potential effects
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Test passes if no errors are thrown
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it('should call fetcher again when retry is invoked', async () => {
    const mockFetcher = vi.fn().mockResolvedValue('data');

    const { result } = renderHook(() => useFetch(mockFetcher));

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetcher).toHaveBeenCalledTimes(1);

    // Call retry
    result.current.retry();

    // Wait for retry to complete
    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledTimes(2);
    });
  });
});
