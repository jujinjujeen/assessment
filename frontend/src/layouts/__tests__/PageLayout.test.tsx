// src/layouts/__tests__/PageLayout.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/testUtils';
import { PageLayout } from '../PageLayout';

describe('PageLayout', () => {
  it('renders title and children correctly', () => {
    render(
      <PageLayout title="Test Title">
        <div>Test Content</div>
      </PageLayout>
    );

    const title = screen.getByText('Test Title');
    const content = screen.getByText('Test Content');
    const emoji = screen.getByText('🏎️');

    expect(document.body.contains(title)).toBe(true);
    expect(document.body.contains(content)).toBe(true);
    expect(document.body.contains(emoji)).toBe(true);
  });

  it('does not show back button by default', () => {
    render(
      <PageLayout title="Test Title">
        <div>Content</div>
      </PageLayout>
    );

    const backButton = screen.queryByText('Back');
    expect(backButton).toBeNull();
  });

  it('shows back button when showBackButton is true', () => {
    const onBack = vi.fn();
    render(
      <PageLayout title="Test Title" showBackButton onBack={onBack}>
        <div>Content</div>
      </PageLayout>
    );

    const backButton = screen.getByText('Back');
    const backEmoji = screen.getByText('⬅️');

    expect(document.body.contains(backButton)).toBe(true);
    expect(document.body.contains(backEmoji)).toBe(true);
  });

  it('calls onBack when back button is clicked', async () => {
    const onBack = vi.fn();
    const { user } = render(
      <PageLayout title="Test Title" showBackButton onBack={onBack}>
        <div>Content</div>
      </PageLayout>
    );

    const backButton = screen.getByText('Back');
    await user.click(backButton);
    expect(onBack).toHaveBeenCalledOnce();
  });
});
