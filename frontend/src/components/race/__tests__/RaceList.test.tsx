import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../../test/testUtils';
import { RacesList } from '../RaceList';
import type { Race } from '@f1/types/api-schemas';

const mockRaces: Race[] = [
  {
    id: 1,
    name: 'Monaco Grand Prix',
    date: '2023-05-28',
    season: 2023,
    driver: {
      id: 'lewis',
      givenName: 'Lewis',
      familyName: 'Hamilton',
      isSeasonChampion: false,
    },
  },
  {
    id: 2,
    name: 'British Grand Prix',
    date: '2023-07-09',
    season: 2023,
    driver: {
      id: 'verstappen',
      givenName: 'Max',
      familyName: 'Verstappen',
      isSeasonChampion: true,
    },
  },
];

describe('RacesList', () => {
  it('renders all races', () => {
    render(<RacesList races={mockRaces} />);

    const monaco = screen.getByText('Monaco Grand Prix');
    const british = screen.getByText('British Grand Prix');

    expect(document.body.contains(monaco)).toBe(true);
    expect(document.body.contains(british)).toBe(true);
  });

  it('renders races with correct indices', () => {
    render(<RacesList races={mockRaces} />);

    const firstRace = screen.getByText('#1');
    const secondRace = screen.getByText('#2');

    expect(document.body.contains(firstRace)).toBe(true);
    expect(document.body.contains(secondRace)).toBe(true);
  });

  it('handles empty race list', () => {
    const { container } = render(<RacesList races={[]} />);

    const spaceContainer = container.querySelector('.space-y-4');
    expect(spaceContainer).not.toBeNull();
    expect(spaceContainer!.children.length).toBe(0);
  });
});
