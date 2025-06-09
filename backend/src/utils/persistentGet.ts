import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TIME } from '@f1/be/constants';

const DEFAULT_MAX_RETRIES = 10;
const BASE_DELAY_MS = TIME.ONE_SECOND;
const MAX_DELAY_MS = TIME.ONE_MINUTE / 2;
const RETRY_STATUSES = [429, 502, 503, 504];

/**
 * Persistent GET request function that retries on rate limit errors.
 * @param {string} url - The URL to fetch data from.
 * @param {AxiosRequestConfig} [options] - Optional Axios request configuration.
 * @param maxRetries – how many times we’ll retry before bailing (default: 5)
 * @returns {Promise<T>} - The response data from the GET request.
 */
export const persistentGet = async <T = unknown>(
  url: string,
  options?: AxiosRequestConfig,
  maxRetries: number = DEFAULT_MAX_RETRIES
): Promise<T> => {
  let attempt = 0;
  let delayMs = BASE_DELAY_MS;

  while (true) {
    try {
      const response: AxiosResponse<T> = await axios.get<T>(url, options);
      return response.data;
    } catch (err: unknown) {
      // If not an AxiosError or status isn’t one we want to retry, rethrow immediately
      if (
        !axios.isAxiosError(err) ||
        !err.response ||
        !RETRY_STATUSES.includes(err.response.status)
      ) {
        console.error(`persistentGet failed on ${url}:`, err);
        throw err;
      }

      attempt++;
      if (attempt > maxRetries) {
        console.error(
          `persistentGet gave up after ${maxRetries} retries on ${url}.`
        );
        throw err;
      }

      // Exponential backoff with jitter
      const jitter = Math.random() * 0.5 * delayMs;
      const waitTime = Math.min(delayMs + jitter, MAX_DELAY_MS);
      console.warn(
        `persistentGet (${url}) – status ${err.response.status}. ` +
          `Retry #${attempt} in ${Math.round(waitTime)} ms...`
      );

      await new Promise((res) => setTimeout(res, waitTime));
      delayMs = Math.min(delayMs * 2, MAX_DELAY_MS);
    }
  }
};
