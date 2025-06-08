// src/pages/__tests__/HomePage.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/testUtils';
import { HomePage } from '../HomePage';

// Mock the hooks
vi.mock('../../hooks/usePageTitle', () => ({
  usePageTitle: vi.fn(),
}));

vi.mock('../../hooks/useFetch', () => ({
  useFetch: vi.fn(),
}));

vi.mock('../../api/seasons', () => ({
  fetchSeasons: vi.fn(),
}));

import { useFetch } from '../../hooks/useFetch';

const mockUseFetch = vi.mocked(useFetch);

describe('HomePage', () => {
  it('renders loading state', () => {
    mockUseFetch.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<HomePage />);

    const loadingText = screen.getByText('Loading F1 seasons...');
    const spinner = screen.getByText('🏁');

    expect(document.body.contains(loadingText)).toBe(true);
    expect(document.body.contains(spinner)).toBe(true);
  });

  it('renders error state', () => {
    const mockError = new Error('Failed to fetch');
    mockUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
    });

    render(<HomePage />);

    const errorTitle = screen.getByText('Oops! Something went wrong');
    const errorMessage = screen.getByText('Failed to fetch');

    expect(document.body.contains(errorTitle)).toBe(true);
    expect(document.body.contains(errorMessage)).toBe(true);
  });

  it('renders empty state', () => {
    mockUseFetch.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    render(<HomePage />);

    const emptyMessage = screen.getByText('No F1 seasons available');
    expect(document.body.contains(emptyMessage)).toBe(true);
  });

  it('renders seasons when data is available', () => {
    const mockSeasons = [
      { id: '1', year: 2023, winner: 'Max Verstappen' },
      { id: '2', year: 2022, winner: 'Max Verstappen' },
    ];

    mockUseFetch.mockReturnValue({
      data: mockSeasons,
      loading: false,
      error: null,
    });

    render(<HomePage />);

    const season2023 = screen.getByText('🏆 2023 Season');
    const season2022 = screen.getByText('🏆 2022 Season');

    expect(document.body.contains(season2023)).toBe(true);
    expect(document.body.contains(season2022)).toBe(true);
  });
});
