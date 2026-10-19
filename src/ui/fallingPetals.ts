/**
 * Romantic Falling Petals (Cánh hoa rơi) Effect.
 * Creates an organic canvas particle system of drifting cherry blossom and rose petals
 * with 3D tumbling, wind flutter, and soft pastel shades.
 */

export type FallingPetalsOptions = {
    reducedMotion?: boolean;
    container?: HTMLElement;
    petalCount?: number;
};

export type FallingPetalsController = {
    start: () => void;
    stop: () => void;
    dispose: () => void;
};

type Petal = {
    x: number;
    y: number;
    size: number;
    speedY: number;
    speedX: number;
    swaySpeed: number;
    swayAmp: number;
    rotation: number;
    rotSpeed: number;
    flipAngle: number;
    flipSpeed: number;
    color: string;
    opacity: number;
    petalType: 'sakura' | 'rose';
};

const PETAL_COLORS = [
    '#fbb6ce', // Soft pink
    '#f472b6', // Rose blush
    '#fecdd3', // Pastel cherry
    '#fbcfe8', // Orchid pink
    '#fda4af', // Coral rose
    '#ffe4e6', // Cream petal
];

export function createFallingPetals(options: FallingPetalsOptions = {}): FallingPetalsController {
    const reducedMotion = Boolean(options.reducedMotion);
    const host = options.container ?? document.body;
    const count = options.petalCount ?? (reducedMotion ? 12 : 32);

    const canvas = document.createElement('canvas');
    canvas.className = 'falling-petals-global';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animationId = 0;
    let elapsed = 0;
    let width = 0;
    let height = 0;

    const petals: Petal[] = [];

    const resetPetal = (petal: Petal, fromTop = true): void => {
        petal.size = 10 + Math.random() * 12;
        petal.x = Math.random() * width;
        petal.y = fromTop ? -20 - Math.random() * 50 : Math.random() * height;
        petal.speedY = 1.0 + Math.random() * 1.6;
        petal.speedX = 0.4 + Math.random() * 0.8;
        petal.swaySpeed = 1.2 + Math.random() * 1.5;
        petal.swayAmp = 1.2 + Math.random() * 1.8;
        petal.rotation = Math.random() * Math.PI * 2;
        petal.rotSpeed = (Math.random() - 0.5) * 0.035;
        petal.flipAngle = Math.random() * Math.PI;
        petal.flipSpeed = 0.02 + Math.random() * 0.04;
        petal.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
        petal.opacity = 0.65 + Math.random() * 0.3;
        petal.petalType = Math.random() > 0.4 ? 'sakura' : 'rose';
    };

    const initPetals = (): void => {
        petals.length = 0;
        for (let i = 0; i < count; i += 1) {
            const p: Petal = {
                x: 0,
                y: 0,
                size: 0,
                speedY: 0,
                speedX: 0,
                swaySpeed: 0,
                swayAmp: 0,
                rotation: 0,
                rotSpeed: 0,
                flipAngle: 0,
                flipSpeed: 0,
                color: '#fbb6ce',
                opacity: 0.8,
                petalType: 'sakura',
            };
            resetPetal(p, false);
            petals.push(p);
        }
    };

    const handleResize = (): void => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        if (ctx) {
            ctx.scale(dpr, dpr);
        }

        if (petals.length === 0) {
            initPetals();
        }
    };

    const drawPetal = (p: Petal): void => {
        if (!ctx) {
            return;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(Math.cos(p.flipAngle), 1);
        ctx.globalAlpha = p.opacity;

        ctx.beginPath();
        if (p.petalType === 'sakura') {
            // Sakura petal: slightly notched heart-oval shape
            const s = p.size;
            ctx.moveTo(0, -s);
            ctx.bezierCurveTo(s * 0.65, -s * 0.75, s * 0.8, s * 0.3, 0, s);
            ctx.bezierCurveTo(-s * 0.8, s * 0.3, -s * 0.65, -s * 0.75, 0, -s);
        } else {
            // Rose petal: organic curved teardrop
            const s = p.size;
            ctx.moveTo(0, -s * 0.9);
            ctx.bezierCurveTo(s * 0.75, -s * 0.4, s * 0.85, s * 0.6, 0, s * 1.05);
            ctx.bezierCurveTo(-s * 0.85, s * 0.6, -s * 0.75, -s * 0.4, 0, -s * 0.9);
        }

        ctx.fillStyle = p.color;
        ctx.fill();

        // Subtle highlight streak along petal center
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.6);
        ctx.lineTo(0, p.size * 0.6);
        ctx.stroke();

        ctx.restore();
    };

    const animate = (): void => {
        elapsed += 0.016;

        if (ctx) {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < petals.length; i += 1) {
                const p = petals[i];
                p.y += p.speedY;
                p.x += Math.sin(elapsed * p.swaySpeed + p.rotation) * p.swayAmp + p.speedX * 0.3;
                p.rotation += p.rotSpeed;
                p.flipAngle += p.flipSpeed;

                if (p.y > height + 25 || p.x > width + 40 || p.x < -40) {
                    resetPetal(p, true);
                }

                drawPetal(p);
            }
        }

        animationId = window.requestAnimationFrame(animate);
    };

    const start = (): void => {
        if (animationId) {
            return;
        }
        handleResize();
        animationId = window.requestAnimationFrame(animate);
    };

    const stop = (): void => {
        if (animationId) {
            window.cancelAnimationFrame(animationId);
            animationId = 0;
        }
    };

    const dispose = (): void => {
        stop();
        window.removeEventListener('resize', handleResize);
        if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    };

    window.addEventListener('resize', handleResize);
    start();

    return {
        start,
        stop,
        dispose,
    };
}
