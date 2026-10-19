import { describe, expect, it } from 'vitest';

import { defaultGardenAssets, loadGardenAssets } from '../scene/gardenAssetLoader';

describe('gardenAssetLoader', () => {
    it('provides valid default asset fallbacks', () => {
        expect(defaultGardenAssets.background.fallbackSrc).toBe('/images/garden-background.svg');
        expect(defaultGardenAssets.girl.fallbackSrc).toBe('/images/girl-illustrated.svg');
        expect(defaultGardenAssets.chihuahua.fallbackSrc).toBe('/images/chihuahua-illustrated.svg');
        expect(defaultGardenAssets.bouquet.fallbackSrc).toBe('/images/bouquet-illustrated.svg');
    });

    it('falls back gracefully to SVG illustrations when bitmap files are absent', async () => {
        const loaded = await loadGardenAssets({
            background: {
                primarySrc: '/non-existent-bg.webp',
                fallbackSrc: '/images/garden-background.svg',
            },
            girl: {
                primarySrc: '/non-existent-girl.webp',
                fallbackSrc: '/images/girl-illustrated.svg',
            },
            chihuahua: {
                primarySrc: '/non-existent-dog.webp',
                fallbackSrc: '/images/chihuahua-illustrated.svg',
            },
            bouquet: {
                primarySrc: '/non-existent-bouquet.webp',
                fallbackSrc: '/images/bouquet-illustrated.svg',
            },
        });
        expect(loaded.backgroundUrl).toBe('/images/garden-background.svg');
        expect(loaded.girlUrl).toBe('/images/girl-illustrated.svg');
        expect(loaded.chihuahuaUrl).toBe('/images/chihuahua-illustrated.svg');
        expect(loaded.bouquetUrl).toBe('/images/bouquet-illustrated.svg');
    });
});

