import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createGardenScene } from '../scene/gardenScene';

describe('gardenScene character entrance lifecycle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('does not show Lam Bùi upon entering; only reveals him on showRomanticLam', () => {
        const container = document.createElement('div');
        const controller = createGardenScene(container);

        const lamNode = container.querySelector<HTMLElement>('.garden-character--lam-romantic');
        expect(lamNode).not.toBeNull();
        expect(lamNode?.classList.contains('is-entered')).toBe(false);

        const speechBubble = container.querySelector<HTMLElement>('.lam-speech-bubble');
        expect(speechBubble?.classList.contains('is-visible')).toBe(false);

        controller.showRomanticLam('Chúc Ánh 20/10 ngập tràn niềm vui!');
        expect(lamNode?.classList.contains('is-entered')).toBe(true);
        expect(speechBubble?.classList.contains('is-visible')).toBe(true);
        expect(speechBubble?.textContent).toContain('Chúc Ánh 20/10');

        controller.hideRomanticLam();
        expect(lamNode?.classList.contains('is-entered')).toBe(false);
        expect(speechBubble?.classList.contains('is-visible')).toBe(false);

        controller.dispose();
    });

    it('automatically hides Lam Bùi after 3 seconds when durationMs is 3000', () => {
        const container = document.createElement('div');
        const controller = createGardenScene(container);
        const lamNode = container.querySelector<HTMLElement>('.garden-character--lam-romantic');

        controller.showRomanticLam('Chúc Ánh luôn hạnh phúc!', 3000);
        expect(lamNode?.classList.contains('is-entered')).toBe(true);

        vi.advanceTimersByTime(2900);
        expect(lamNode?.classList.contains('is-entered')).toBe(true);

        vi.advanceTimersByTime(200);
        expect(lamNode?.classList.contains('is-entered')).toBe(false);

        controller.dispose();
    });
});
