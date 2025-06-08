// src/components/season/__tests__/SeasonCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../../test/testUtils';
import { SeasonCard } from '../SeasonCard';
import type { Season } from '@f1/types/api-schemas';

const mockSeason: Season = {
  id: 1,
  year: 2023,
  url: '/season/2023',
  winner: 'Max Verstappen',
};

describe('SeasonCard', () => {
  it('renders season information correctly', () => {
    render(<SeasonCard season={mockSeason} />);

    const title = screen.getByText('🏆 2023 Season');
    const championLabel = screen.getByText('Champion:');
    const winner = screen.getByText('Max Verstappen');
    const arrow = screen.getByText('➡️');

    expect(document.body.contains(title)).toBe(true);
    expect(document.body.contains(championLabel)).toBe(true);
    expect(document.body.contains(winner)).toBe(true);
    expect(document.body.contains(arrow)).toBe(true);
  });

  it('has correct link to season page', () => {
    render(<SeasonCard season={mockSeason} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/season/2023');
  });

  it('has hover classes for interactivity', () => {
    render(<SeasonCard season={mockSeason} />);

    const link = screen.getByRole('link');
    expect(link.classList.contains('hover:shadow-lg')).toBe(true);
  });
});
