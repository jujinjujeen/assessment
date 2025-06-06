/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { persistentGet } from '../persistentGet'; // Adjust path as needed

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock console methods to avoid cluttering test output
const consoleSpy = {
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
};

describe('persistentGet', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    consoleSpy.error.mockClear();
    consoleSpy.warn.mockClear();
  });

  it('should return data on successful request', async () => {
    const mockData = { id: 1, name: 'test' };
    const mockResponse: AxiosResponse = {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    (mockedAxios.get as Mock).mockResolvedValueOnce(mockResponse);

    const result = await persistentGet('https://api.example.com/data');

    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.example.com/data',
      undefined
    );
  });

  it('should pass options to axios.get', async () => {
    const mockData = { test: true };
    const mockResponse: AxiosResponse = {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    const options = {
      headers: { Authorization: 'Bearer token' },
      timeout: 5000,
    };

    (mockedAxios.get as Mock).mockResolvedValueOnce(mockResponse);

    await persistentGet('https://api.example.com/data', options);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.example.com/data',
      options
    );
  });

  it('should retry on 429 status and eventually succeed', async () => {
    const mockData = { success: true };
    const mockError = {
      isAxiosError: true,
      response: { status: 429 },
    } as AxiosError;

    const mockResponse: AxiosResponse = {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    (mockedAxios.isAxiosError as any).mockReturnValue(true);
    (mockedAxios.get as Mock)
      .mockRejectedValueOnce(mockError)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockResponse);

    const resultPromise = persistentGet('https://api.example.com/data');

    // Advance timers and await the result
    const advanceTimersPromise = vi.runAllTimersAsync();
    await advanceTimersPromise;
    
    const result = await resultPromise;

    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    expect(consoleSpy.warn).toHaveBeenCalledTimes(2);
  });

  it.each([502, 503, 504])(
    'should retry on %d status code',
    async (status) => {
      const mockError = {
        isAxiosError: true,
        response: { status },
      } as AxiosError;

      const mockResponse: AxiosResponse = {
        data: { retried: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      (mockedAxios.isAxiosError as any).mockReturnValue(true);
      (mockedAxios.get as Mock)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockResponse);

      const resultPromise = persistentGet('https://api.example.com/data');
      
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result).toEqual({ retried: true });
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    }
  );

  it('should not retry on non-retriable status codes', async () => {
    const mockError = {
      isAxiosError: true,
      response: { status: 404 },
    } as AxiosError;

    (mockedAxios.isAxiosError as any).mockReturnValue(true);
    (mockedAxios.get as Mock).mockRejectedValueOnce(mockError);

    await expect(
      persistentGet('https://api.example.com/data')
    ).rejects.toThrow();

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    expect(consoleSpy.warn).not.toHaveBeenCalled();
  });

  it('should not retry on network errors', async () => {
    const networkError = new Error('Network Error');

    (mockedAxios.isAxiosError as any).mockReturnValue(false);
    (mockedAxios.get as Mock).mockRejectedValueOnce(networkError);

    await expect(
      persistentGet('https://api.example.com/data')
    ).rejects.toThrow('Network Error');

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
  });

  it('should give up after max retries exceeded', async () => {
    const mockError = {
      isAxiosError: true,
      response: { status: 429 },
    } as AxiosError;

    (mockedAxios.isAxiosError as any).mockReturnValue(true);
    (mockedAxios.get as Mock).mockRejectedValue(mockError);

    const maxRetries = 2;
    const resultPromise = persistentGet(
      'https://api.example.com/data',
      undefined,
      maxRetries
    );

    // Run timers and catch the rejection properly
    const timersPromise = vi.runAllTimersAsync();
    const rejectionPromise = expect(resultPromise).rejects.toThrow();
    
    await Promise.all([timersPromise, rejectionPromise]);

    expect(mockedAxios.get).toHaveBeenCalledTimes(maxRetries + 1);
    expect(consoleSpy.warn).toHaveBeenCalledTimes(maxRetries);
    expect(consoleSpy.error).toHaveBeenCalledWith(
      expect.stringContaining(`gave up after ${maxRetries} retries`)
    );
  });

  it('should handle AxiosError without response', async () => {
    const mockError = {
      isAxiosError: true,
      response: undefined,
    } as AxiosError;

    (mockedAxios.isAxiosError as any).mockReturnValue(true);
    (mockedAxios.get as Mock).mockRejectedValueOnce(mockError);

    await expect(
      persistentGet('https://api.example.com/data')
    ).rejects.toThrow();

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
  });

  it('should work with generic types', async () => {
    interface User {
      id: number;
      name: string;
      email: string;
    }

    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    };

    const mockResponse: AxiosResponse<User> = {
      data: mockUser,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    (mockedAxios.get as Mock).mockResolvedValueOnce(mockResponse);

    const result = await persistentGet<User>('https://api.example.com/user/1');

    expect(result).toEqual(mockUser);
    expect(result.id).toBe(1);
    expect(result.name).toBe('John Doe');
  });

  it('should implement exponential backoff with jitter', async () => {
    const mockError = {
      isAxiosError: true,
      response: { status: 429 },
    } as AxiosError;

    const mockResponse: AxiosResponse = {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    (mockedAxios.isAxiosError as any).mockReturnValue(true);
    (mockedAxios.get as Mock)
      .mockRejectedValueOnce(mockError)
      .mockRejectedValueOnce(mockError)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockResponse);

    // Spy on setTimeout to capture delay values
    const timeoutSpy = vi.spyOn(global, 'setTimeout');

    const resultPromise = persistentGet('https://api.example.com/data');
    
    await vi.runAllTimersAsync();
    await resultPromise;

    // Verify that setTimeout was called with increasing delays
    const calls = timeoutSpy.mock.calls;
    expect(calls).toHaveLength(3);

    // Extract delay values (second argument to setTimeout)
    const delays = calls.map((call) => call[1] as number);

    // Base delay should be around 1000ms (BASE_DELAY_MS)
    expect(delays[0]).toBeGreaterThanOrEqual(1000);
    expect(delays[0]).toBeLessThan(1500); // 1000 + 50% jitter

    // Each subsequent delay should generally be larger
    expect(delays[1]).toBeGreaterThan(1500);
    expect(delays[2]).toBeGreaterThan(3000);

    timeoutSpy.mockRestore();
  });

  it('should respect MAX_DELAY_MS cap', async () => {
    const mockError = {
      isAxiosError: true,
      response: { status: 429 },
    } as AxiosError;

    (mockedAxios.isAxiosError as any).mockReturnValue(true);
    (mockedAxios.get as Mock).mockRejectedValue(mockError);

    const timeoutSpy = vi.spyOn(global, 'setTimeout');

    const resultPromise = persistentGet(
      'https://api.example.com/data',
      undefined,
      10 // More retries to test max delay
    );

    // Handle both timer advancement and promise rejection
    const timersPromise = vi.runAllTimersAsync();
    const rejectionPromise = expect(resultPromise).rejects.toThrow();
    
    await Promise.all([timersPromise, rejectionPromise]);

    const calls = timeoutSpy.mock.calls;
    const delays = calls.map((call) => call[1] as number);

    // Verify that no delay exceeds MAX_DELAY_MS (30000ms)
    delays.forEach((delay) => {
      expect(delay).toBeLessThanOrEqual(30000);
    });

    timeoutSpy.mockRestore();
  });

  it('should use custom maxRetries parameter', async () => {
    const mockError = {
      isAxiosError: true,
      response: { status: 429 },
    } as AxiosError;

    (mockedAxios.isAxiosError as any).mockReturnValue(true);
    (mockedAxios.get as Mock).mockRejectedValue(mockError);

    const customMaxRetries = 3;
    const resultPromise = persistentGet(
      'https://api.example.com/data',
      undefined,
      customMaxRetries
    );

    // Handle both timer advancement and promise rejection
    const timersPromise = vi.runAllTimersAsync();
    const rejectionPromise = expect(resultPromise).rejects.toThrow();
    
    await Promise.all([timersPromise, rejectionPromise]);

    expect(mockedAxios.get).toHaveBeenCalledTimes(customMaxRetries + 1);
    expect(consoleSpy.warn).toHaveBeenCalledTimes(customMaxRetries);
  });
});