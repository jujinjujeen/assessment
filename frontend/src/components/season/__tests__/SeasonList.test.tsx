// src/components/season/__tests__/SeasonsList.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../../test/testUtils';
import { SeasonsList } from '../SeasonList';
import type { Season } from '@f1/types/api-schemas';

const mockSeasons: Season[] = [
  { id: 1, url: 'wiki/season/2023', year: 2023, winner: 'Max Verstappen' },
  { id: 2, url: 'wiki/season/2022', year: 2022, winner: 'Max Verstappen' },
  { id: 3, url: 'wiki/season/2021', year: 2021, winner: 'Max Verstappen' },
];

describe('SeasonsList', () => {
  it('renders all seasons', () => {
    render(<SeasonsList seasons={mockSeasons} />);

    const season2023 = screen.getByText('🏆 2023 Season');
    const season2022 = screen.getByText('🏆 2022 Season');
    const season2021 = screen.getByText('🏆 2021 Season');

    expect(document.body.contains(season2023)).toBe(true);
    expect(document.body.contains(season2022)).toBe(true);
    expect(document.body.contains(season2021)).toBe(true);
  });

  it('has responsive grid layout', () => {
    render(<SeasonsList seasons={mockSeasons} />);

    const season2023 = screen.getByText('🏆 2023 Season');
    const container = season2023.closest('.grid');

    expect(container).not.toBeNull();
    expect(container!.classList.contains('grid')).toBe(true);
    expect(container!.classList.contains('gap-4')).toBe(true);
    expect(container!.classList.contains('md:grid-cols-2')).toBe(true);
    expect(container!.classList.contains('lg:grid-cols-3')).toBe(true);
  });

  it('renders empty list without errors', () => {
    const { container } = render(<SeasonsList seasons={[]} />);

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).not.toBeNull();
    expect(gridContainer!.children.length).toBe(0);
  });
});
