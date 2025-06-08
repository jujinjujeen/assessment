import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../test/testUtils';
import { SeasonPage } from '../SeasonPage';

// Mock the hooks and router
vi.mock('../../hooks/usePageTitle', () => ({
  usePageTitle: vi.fn(),
}));

vi.mock('../../hooks/useFetch', () => ({
  useFetch: vi.fn(),
}));

vi.mock('../../api/seasons', () => ({
  fetchSeasonDetails: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ seasonId: '2023' }),
    useNavigate: () => mockNavigate,
  };
});

import { useFetch } from '../../hooks/useFetch';

const mockUseFetch = vi.mocked(useFetch);

describe('SeasonPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseFetch.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<SeasonPage />);

    const loadingText = screen.getByText('Loading 2023 season details...');
    expect(document.body.contains(loadingText)).toBe(true);
  });

  it('renders error state', () => {
    const mockError = new Error('Failed to fetch season');
    mockUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
    });

    render(<SeasonPage />);

    const errorMessage = screen.getByText('Failed to fetch season');
    expect(document.body.contains(errorMessage)).toBe(true);
  });

  it('renders empty state', () => {
    mockUseFetch.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    render(<SeasonPage />);

    const emptyMessage = screen.getByText('No race details available for 2023 season');
    expect(document.body.contains(emptyMessage)).toBe(true);
  });

  it('renders races when data is available', () => {
    const mockRaces = [
      {
        id: '1',
        name: 'Monaco Grand Prix',
        driver: { givenName: 'Lewis', familyName: 'Hamilton', isSeasonChampion: false },
      },
    ];

    mockUseFetch.mockReturnValue({
      data: mockRaces,
      loading: false,
      error: null,
    });

    render(<SeasonPage />);

    const raceName = screen.getByText('Monaco Grand Prix');
    const driverName = screen.getByText('Lewis Hamilton');

    expect(document.body.contains(raceName)).toBe(true);
    expect(document.body.contains(driverName)).toBe(true);
  });

  it('calls navigate when back button is clicked', async () => {
    mockUseFetch.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    const { user } = render(<SeasonPage />);

    const backButton = screen.getByText('Back');
    await user.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders page title with season ID', () => {
    mockUseFetch.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<SeasonPage />);

    const title = screen.getByText('2023 Season');
    expect(document.body.contains(title)).toBe(true);
  });
});