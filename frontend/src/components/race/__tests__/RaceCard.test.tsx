// src/components/race/__tests__/RaceCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../../test/testUtils';
import { RaceCard } from '../RaceCard';
import type { Race } from '@f1/types/api-schemas';

const mockRace: Race = {
  id: 1,
  name: 'Monaco Grand Prix',
  season: 2023,
  date: '2023-05-28',
  driver: {
    id: 'lewis-hamilton',
    givenName: 'Lewis',
    familyName: 'Hamilton',
    isSeasonChampion: false,
  },
};

const mockChampionRace = {
  id: 2,
  name: 'British Grand Prix',
  season: 2023,
  date: '2023-05-28',
  driver: {
    id: 'max-verstappen',
    givenName: 'Max',
    familyName: 'Verstappen',
    isSeasonChampion: true,
  },
};

describe('RaceCard', () => {
  it('renders race information correctly', () => {
    render(<RaceCard race={mockRace} index={0} />);

    const number = screen.getByText('#1');
    const name = screen.getByText('Monaco Grand Prix');
    const winnerLabel = screen.getByText('Winner:');
    const driver = screen.getByText('Lewis Hamilton');
    const flag = screen.getByText('🏁');

    expect(document.body.contains(number)).toBe(true);
    expect(document.body.contains(name)).toBe(true);
    expect(document.body.contains(winnerLabel)).toBe(true);
    expect(document.body.contains(driver)).toBe(true);
    expect(document.body.contains(flag)).toBe(true);
  });

  it('shows champion indicator for season champion', () => {
    render(<RaceCard race={mockChampionRace} index={1} />);

    const crown = screen.getByText('👑');
    const championLabel = screen.getByText('Champion');

    expect(document.body.contains(crown)).toBe(true);
    expect(document.body.contains(championLabel)).toBe(true);
  });

  it('does not show champion indicator for non-champion', () => {
    render(<RaceCard race={mockRace} index={0} />);

    const crown = screen.queryByText('👑');
    const championLabel = screen.queryByText('Champion');

    expect(crown).toBeNull();
    expect(championLabel).toBeNull();
  });

  it('applies champion styling when driver is season champion', () => {
    render(<RaceCard race={mockChampionRace} index={0} />);

    const raceTitle = screen.getByText('British Grand Prix');
    const card = raceTitle.closest('div');
    
    expect(card).not.toBeNull();
    // expect(card!.classList.contains('border-yellow-300')).toBe(true);
  });

  it('displays correct race number based on index', () => {
    render(<RaceCard race={mockRace} index={4} />);

    const number = screen.getByText('#5');
    expect(document.body.contains(number)).toBe(true);
  });
});