import { describe, expect, it } from 'vitest';

import { romanticGreetingConfig } from '../content/gardenConfig';
import { createGreetingContent } from '../content/greeting';

describe('greeting content', () => {
    it('includes the personalized greeting for Ánh', () => {
        const content = createGreetingContent('Ánh');

        expect(content.recipient).toBe('Ánh');
        expect(content.title).toContain('Ánh');
        expect(content.message).toContain('A little universe, made just for you.');
    });

    it('provides an accessible reduced-motion fallback', () => {
        const content = createGreetingContent('Ánh');

        expect(content.reducedMotionFallback).toContain('A little space, just for you.');
    });

    it('configures character names Ánh Bùi, Khôi Bùi, and the mp3 audio track', () => {
        expect(romanticGreetingConfig.girlName).toBe('Ánh Bùi');
        expect(romanticGreetingConfig.dogName).toBe('Khôi Bùi');
        expect(romanticGreetingConfig.heroName).toBe('Lam Bùi');
        expect(romanticGreetingConfig.dragonName).toBe('Stress & Pessimistic Dragon');
        expect(romanticGreetingConfig.callHeroLabel).toBe('Call for Lam Bùi');
        expect(romanticGreetingConfig.musicSrc).toContain('.mp3');
    });

    it('provides a curated list of romantic 20/10 wishes for Ánh', () => {
        expect(romanticGreetingConfig.wishes.length).toBeGreaterThanOrEqual(5);
        romanticGreetingConfig.wishes.forEach((w) => {
            expect(w.length).toBeGreaterThan(10);
        });
    });
});

