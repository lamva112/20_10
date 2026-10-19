import type { GreetingContent } from '../content/greeting';

export function renderGreetingOverlay(
    root: HTMLElement,
    content: GreetingContent,
    onExplore: () => void,
    onReset: () => void,
): void {
    root.innerHTML = `
    <div class="preview-hero__mesh" aria-hidden="true"></div>
    <div class="preview-hero__copy">
      <div class="preview-hero__eyebrow">${content.badgeLabel}</div>
      <h1 class="preview-hero__title">${content.title}</h1>
      <p class="preview-hero__subtitle">${content.message}</p>
      <p class="preview-hero__detail">${content.detail}</p>
      <div class="preview-action-bar">
        <button type="button" class="preview-btn preview-btn--primary" data-action="explore">
          ${content.primaryAction}
        </button>
        <button type="button" class="preview-btn preview-btn--secondary" data-action="reset">
          ${content.secondaryAction}
        </button>
      </div>
    </div>
  `;

    const exploreButton = root.querySelector<HTMLButtonElement>('[data-action="explore"]');
    const resetButton = root.querySelector<HTMLButtonElement>('[data-action="reset"]');

    exploreButton?.addEventListener('click', onExplore);
    resetButton?.addEventListener('click', onReset);
}
