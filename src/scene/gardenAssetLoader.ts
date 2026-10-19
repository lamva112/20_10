/**
 * Asset loader and configuration for the 2D Anime Garden Experience.
 * Supports external artist bitmap assets (WebP/PNG) with automatic fallback
 * to high-fidelity hand-crafted anime vector illustrations.
 */

export type CharacterAssetConfig = {
    primarySrc: string;
    fallbackSrc: string;
    isSpriteSheet?: boolean;
    frameCount?: number;
    frameWidth?: number;
    frameHeight?: number;
    fps?: number;
};

export type GardenAssetsConfig = {
    background: {
        primarySrc: string;
        fallbackSrc: string;
    };
    girl: CharacterAssetConfig;
    chihuahua: CharacterAssetConfig;
    bouquet: {
        primarySrc: string;
        fallbackSrc: string;
    };
};

export const defaultGardenAssets: GardenAssetsConfig = {
    background: {
        primarySrc: '/images/garden-background.webp',
        fallbackSrc: '/images/garden-background.svg',
    },
    girl: {
        primarySrc: '/images/girl-walk-spritesheet.webp',
        fallbackSrc: '/images/girl-illustrated.svg',
        isSpriteSheet: false,
        frameCount: 8,
        fps: 8,
    },
    chihuahua: {
        primarySrc: '/images/chihuahua-walk-spritesheet.webp',
        fallbackSrc: '/images/chihuahua-illustrated.svg',
        isSpriteSheet: false,
        frameCount: 6,
        fps: 10,
    },
    bouquet: {
        primarySrc: '/images/bouquet.webp',
        fallbackSrc: '/images/bouquet-illustrated.svg',
    },
};

export type LoadedAssets = {
    backgroundUrl: string;
    girlUrl: string;
    chihuahuaUrl: string;
    bouquetUrl: string;
    isGirlSpriteSheet: boolean;
    isChihuahuaSpriteSheet: boolean;
};

export async function probeImage(src: string, timeoutMs = 400): Promise<boolean> {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
        return false;
    }
    return new Promise((resolve) => {
        const img = new Image();
        let settled = false;
        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                resolve(false);
            }
        }, timeoutMs);

        img.onload = () => {
            if (!settled) {
                settled = true;
                clearTimeout(timer);
                resolve(true);
            }
        };
        img.onerror = () => {
            if (!settled) {
                settled = true;
                clearTimeout(timer);
                resolve(false);
            }
        };
        img.src = src;
    });
}

export async function loadGardenAssets(config = defaultGardenAssets): Promise<LoadedAssets> {
    const [bgOk, girlOk, dogOk, bqOk] = await Promise.all([
        probeImage(config.background.primarySrc),
        probeImage(config.girl.primarySrc),
        probeImage(config.chihuahua.primarySrc),
        probeImage(config.bouquet.primarySrc),
    ]);

    return {
        backgroundUrl: bgOk ? config.background.primarySrc : config.background.fallbackSrc,
        girlUrl: girlOk ? config.girl.primarySrc : config.girl.fallbackSrc,
        chihuahuaUrl: dogOk ? config.chihuahua.primarySrc : config.chihuahua.fallbackSrc,
        bouquetUrl: bqOk ? config.bouquet.primarySrc : config.bouquet.fallbackSrc,
        isGirlSpriteSheet: girlOk && Boolean(config.girl.isSpriteSheet),
        isChihuahuaSpriteSheet: dogOk && Boolean(config.chihuahua.isSpriteSheet),
    };
}
