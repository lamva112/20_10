import { romanticGreetingConfig } from '../content/gardenConfig';
import { loadGardenAssets, type LoadedAssets } from './gardenAssetLoader';

export type GardenSceneOptions = {
    reducedMotion?: boolean;
    onBouquetBurst?: (message: string) => void;
    onRevealGreeting?: () => void;
    recipient?: string;
};

export type GardenSceneController = {
    start: () => void;
    replay: () => void;
    callHero: () => void;
    showRomanticLam: (wish?: string, durationMs?: number) => void;
    hideRomanticLam: () => void;
    revealGreeting: () => void;
    dispose: () => void;
};

type PetalParticle = {
    x: number;
    y: number;
    size: number;
    speedY: number;
    speedX: number;
    rotation: number;
    rotSpeed: number;
    flipSpeed: number;
    flipAngle: number;
    color: string;
    opacity: number;
};

type GlowParticle = {
    x: number;
    y: number;
    radius: number;
    alpha: number;
    speedY: number;
    pulseSpeed: number;
    pulsePhase: number;
    color: string;
};

type BurstParticle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
    maxLife: number;
    type: 'petal' | 'heart' | 'sparkle';
};

export function createGardenScene(
    container: HTMLElement,
    options: GardenSceneOptions = {},
): GardenSceneController {
    const reducedMotion = Boolean(options.reducedMotion);
    const onBouquetBurst = options.onBouquetBurst ?? (() => undefined);
    const onRevealGreeting = options.onRevealGreeting ?? (() => undefined);

    container.innerHTML = '';
    container.classList.add('garden-2d-root');

    // DOM Hierarchy
    const worldWrapper = document.createElement('div');
    worldWrapper.className = 'garden-2d-world';

    // 1. Background illustration layer (Parallax factor: 0.25)
    const bgLayer = document.createElement('div');
    bgLayer.className = 'garden-layer garden-layer--bg';
    const bgImg = document.createElement('img');
    bgImg.className = 'garden-bg-image';
    bgImg.alt = 'Romantic garden sunset background';
    bgLayer.appendChild(bgImg);
    worldWrapper.appendChild(bgLayer);

    // 2. Sunlight / warm atmospheric glow layer
    const lightLayer = document.createElement('div');
    lightLayer.className = 'garden-layer garden-layer--lighting';
    worldWrapper.appendChild(lightLayer);

    // 2.5. Battle layer in the background (Prince Lam Bùi vs Stress & Pessimistic Dragon)
    const battleLayer = document.createElement('div');
    battleLayer.className = 'garden-layer garden-layer--battle';

    const dragonNode = document.createElement('div');
    dragonNode.className = 'battle-character battle-character--dragon';
    dragonNode.innerHTML = `
      <div class="character-nametag character-nametag--dragon">
        <span class="nametag-icon">👾</span><span class="nametag-name">${romanticGreetingConfig.dragonName}</span>
      </div>
      <img class="battle-dragon-image" src="/images/stress-dragon.svg" alt="${romanticGreetingConfig.dragonName}" />
    `;
    battleLayer.appendChild(dragonNode);

    const slashFx = document.createElement('div');
    slashFx.className = 'battle-slash-fx';
    battleLayer.appendChild(slashFx);

    const princeNode = document.createElement('div');
    princeNode.className = 'battle-character battle-character--prince';
    princeNode.innerHTML = `
      <div class="character-nametag character-nametag--prince">
        <span class="nametag-icon">⚔️</span><span class="nametag-name">Hoàng tử ${romanticGreetingConfig.heroName}</span>
      </div>
      <img class="battle-prince-image" src="/images/prince-lam.svg" alt="Hoàng tử ${romanticGreetingConfig.heroName}" />
    `;
    battleLayer.appendChild(princeNode);

    const shoutBanner = document.createElement('div');
    shoutBanner.className = 'battle-shout-banner';
    battleLayer.appendChild(shoutBanner);

    worldWrapper.appendChild(battleLayer);

    // 3. Characters & path midground layer (Parallax factor: 0.6)
    const stageLayer = document.createElement('div');
    stageLayer.className = 'garden-layer garden-layer--stage';

    // SVG Leash Overlay (connects girl's hand to Chihuahua's harness)
    const leashSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    leashSvg.setAttribute('class', 'garden-leash-svg');
    const leashPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    leashPath.setAttribute('class', 'garden-leash-path');
    leashSvg.appendChild(leashPath);
    stageLayer.appendChild(leashSvg);

    // Chihuahua character
    const dogNode = document.createElement('div');
    dogNode.className = 'garden-character garden-character--chihuahua';
    const dogTag = document.createElement('div');
    dogTag.className = 'character-nametag character-nametag--dog';
    dogTag.innerHTML = `<span class="nametag-icon">🐾</span><span class="nametag-name">${romanticGreetingConfig.dogName}</span>`;
    dogNode.appendChild(dogTag);
    const dogImg = document.createElement('img');
    dogImg.className = 'garden-dog-image';
    dogImg.alt = 'Adorable Chihuahua walking in garden';
    dogNode.appendChild(dogImg);
    stageLayer.appendChild(dogNode);

    // Girl character
    const girlNode = document.createElement('div');
    girlNode.className = 'garden-character garden-character--girl';
    const girlTag = document.createElement('div');
    girlTag.className = 'character-nametag character-nametag--girl';
    girlTag.innerHTML = `<span class="nametag-icon">🌸</span><span class="nametag-name">${romanticGreetingConfig.girlName}</span>`;
    girlNode.appendChild(girlTag);
    const girlImg = document.createElement('img');
    girlImg.className = 'garden-girl-image';
    girlImg.alt = 'Charming anime girl with floral dress and bouquet';
    girlNode.appendChild(girlImg);

    // Bouquet interactive trigger area
    const bouquetTrigger = document.createElement('button');
    bouquetTrigger.type = 'button';
    bouquetTrigger.className = 'garden-bouquet-trigger';
    bouquetTrigger.setAttribute('aria-label', 'Chạm vào bó hoa để bung nở cánh hoa');
    bouquetTrigger.title = 'Click to burst rose petals!';
    girlNode.appendChild(bouquetTrigger);

    stageLayer.appendChild(girlNode);

    // Romantic Lam Bùi character (appears gracefully on Reveal gift)
    const lamNode = document.createElement('div');
    lamNode.className = 'garden-character garden-character--lam-romantic';
    const lamTag = document.createElement('div');
    lamTag.className = 'character-nametag character-nametag--lam';
    lamTag.innerHTML = `<span class="nametag-icon">🌹</span><span class="nametag-name">${romanticGreetingConfig.heroName}</span>`;
    lamNode.appendChild(lamTag);

    // Speech bubble for when Lam Bùi speaks a wish
    const speechBubble = document.createElement('div');
    speechBubble.className = 'lam-speech-bubble';
    lamNode.appendChild(speechBubble);

    const lamImg = document.createElement('img');
    lamImg.className = 'garden-lam-image';
    lamImg.src = '/images/lam-bui-romantic.svg';
    lamImg.alt = 'Lam Bùi trao hoa hồng cho Ánh';
    lamNode.appendChild(lamImg);
    stageLayer.appendChild(lamNode);

    worldWrapper.appendChild(stageLayer);

    // 4. Foreground depth layer (Parallax factor: 1.1)
    const fgLayer = document.createElement('div');
    fgLayer.className = 'garden-layer garden-layer--fg';
    worldWrapper.appendChild(fgLayer);

    // 5. Canvas for floating petals, glowing bokeh, and burst effects
    const particleCanvas = document.createElement('canvas');
    particleCanvas.className = 'garden-particle-canvas';
    worldWrapper.appendChild(particleCanvas);

    // 6. Interactive subtle hint banner
    const hintBanner = document.createElement('div');
    hintBanner.className = 'garden-hint-banner';
    hintBanner.innerHTML = `<span>✦ ${romanticGreetingConfig.interactionHint ?? 'Di chuột để ngắm nhìn • Nhấp vào bó hoa để bung nở yêu thương'} ✦</span>`;
    worldWrapper.appendChild(hintBanner);

    container.appendChild(worldWrapper);

    const ctx = particleCanvas.getContext('2d');

    // State
    let animationId = 0;
    let elapsed = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    // Particles data
    const petals: PetalParticle[] = [];
    const glowParticles: GlowParticle[] = [];
    const burstParticles: BurstParticle[] = [];
    const petalColors = ['#f8bbd0', '#f48fb1', '#ff80ab', '#fce4ec', '#f8bbd0', '#ffd8e4'];
    const glowColors = ['#fff4db', '#ffe0b2', '#ffccbc', '#f8bbd0'];

    const initParticles = (width: number, height: number): void => {
        petals.length = 0;
        glowParticles.length = 0;
        const petalCount = reducedMotion ? 16 : 48;
        for (let i = 0; i < petalCount; i += 1) {
            petals.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: 9 + Math.random() * 12,
                speedY: 0.9 + Math.random() * 1.6,
                speedX: 0.5 + Math.random() * 1.1,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.04,
                flipSpeed: 0.02 + Math.random() * 0.045,
                flipAngle: Math.random() * Math.PI,
                color: petalColors[Math.floor(Math.random() * petalColors.length)],
                opacity: 0.7 + Math.random() * 0.3,
            });
        }

        const glowCount = reducedMotion ? 10 : 25;
        for (let i = 0; i < glowCount; i += 1) {
            glowParticles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 2 + Math.random() * 4,
                alpha: 0.3 + Math.random() * 0.5,
                speedY: 0.3 + Math.random() * 0.5,
                pulseSpeed: 1.5 + Math.random() * 2,
                pulsePhase: Math.random() * Math.PI * 2,
                color: glowColors[Math.floor(Math.random() * glowColors.length)],
            });
        }
    };

    const resizeCanvas = (): void => {
        const rect = container.getBoundingClientRect();
        const width = Math.max(rect.width, 320);
        const height = Math.max(rect.height, 280);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        particleCanvas.width = width * dpr;
        particleCanvas.height = height * dpr;
        particleCanvas.style.width = `${width}px`;
        particleCanvas.style.height = `${height}px`;

        if (ctx) {
            ctx.scale(dpr, dpr);
        }

        leashSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        leashSvg.style.width = `${width}px`;
        leashSvg.style.height = `${height}px`;

        if (petals.length === 0) {
            initParticles(width, height);
        }
    };

    const triggerBurst = (originX: number, originY: number): void => {
        const count = reducedMotion ? 16 : 40;
        for (let i = 0; i < count; i += 1) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5.5;
            const typeRoll = Math.random();
            const type = typeRoll > 0.65 ? 'heart' : typeRoll > 0.35 ? 'petal' : 'sparkle';

            burstParticles.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                size: 6 + Math.random() * 10,
                color: petalColors[Math.floor(Math.random() * petalColors.length)],
                life: 0,
                maxLife: 45 + Math.floor(Math.random() * 30),
                type,
            });
        }
        onBouquetBurst(romanticGreetingConfig.bouquetMessage);
    };

    const updateLeash = (time: number): void => {
        const stageRect = stageLayer.getBoundingClientRect();
        const girlRect = girlNode.getBoundingClientRect();
        const dogRect = dogNode.getBoundingClientRect();

        if (stageRect.width === 0 || girlRect.width === 0) {
            return;
        }

        // Girl hand relative to stage
        const handX = girlRect.left - stageRect.left + girlRect.width * 0.29;
        const handY = girlRect.top - stageRect.top + girlRect.height * 0.53;

        // Dog harness ring relative to stage
        const harnessX = dogRect.left - stageRect.left + dogRect.width * 0.52;
        const harnessY = dogRect.top - stageRect.top + dogRect.height * 0.49;

        // Dynamic physics sag with stepping rhythm
        const midX = (handX + harnessX) * 0.5;
        const sagBase = Math.abs(handX - harnessX) * 0.22 + 20;
        const dynamicSag = sagBase + (reducedMotion ? 0 : Math.sin(time * 3.5) * 6);
        const midY = Math.max(handY, harnessY) + dynamicSag;

        leashPath.setAttribute(
            'd',
            `M ${handX.toFixed(1)} ${handY.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${harnessX.toFixed(1)} ${harnessY.toFixed(1)}`,
        );
    };

    const updateCharactersMotion = (time: number): void => {
        if (reducedMotion) {
            girlNode.style.transform = 'translateY(0)';
            dogNode.style.transform = 'translateY(0)';
            lamNode.style.transform = 'translateY(0)';
            return;
        }

        // Stepping rhythm & natural secondary bob
        const girlBob = Math.sin(time * 3) * 6;
        const girlSway = Math.sin(time * 1.5) * 1.2;
        girlNode.style.transform = `translateY(${girlBob}px) rotate(${girlSway}deg)`;

        // Chihuahua trotting cadence (faster frequency)
        const dogBob = Math.sin(time * 6) * 5;
        const dogTilt = Math.sin(time * 6) * 2;
        dogNode.style.transform = `translateY(${dogBob}px) rotate(${dogTilt}deg)`;

        // Romantic Lam Bùi gentle breathing & swaying
        const lamBob = Math.sin(time * 2.6 + 1.2) * 5.5;
        const lamSway = Math.sin(time * 1.3 + 1.2) * 1.2;
        lamNode.style.transform = `translateY(${lamBob}px) rotate(${lamSway}deg)`;
    };

    const drawParticles = (width: number, height: number): void => {
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, width, height);

        // 1. Glowing sunset orbs / bokeh
        for (let i = 0; i < glowParticles.length; i += 1) {
            const p = glowParticles[i];
            p.y -= p.speedY;
            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            const pulse = Math.sin(elapsed * p.pulseSpeed + p.pulsePhase) * 0.2;
            const currentAlpha = Math.max(0.1, Math.min(1, p.alpha + pulse));

            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = currentAlpha;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.restore();
        }

        // 2. Floating drifting sakura / rose petals
        for (let i = 0; i < petals.length; i += 1) {
            const petal = petals[i];
            petal.y += petal.speedY;
            petal.x += Math.sin(elapsed * 1.5 + petal.rotation) * petal.speedX;
            petal.rotation += petal.rotSpeed;
            petal.flipAngle += petal.flipSpeed;

            if (petal.y > height + 20) {
                petal.y = -20;
                petal.x = Math.random() * width;
            }

            const scaleX = Math.cos(petal.flipAngle);

            ctx.save();
            ctx.translate(petal.x, petal.y);
            ctx.rotate(petal.rotation);
            ctx.scale(scaleX, 1);
            ctx.globalAlpha = petal.opacity;

            // Draw petal shape
            ctx.beginPath();
            ctx.moveTo(0, -petal.size);
            ctx.bezierCurveTo(petal.size * 0.8, -petal.size * 0.5, petal.size * 0.6, petal.size * 0.8, 0, petal.size);
            ctx.bezierCurveTo(-petal.size * 0.6, petal.size * 0.8, -petal.size * 0.8, -petal.size * 0.5, 0, -petal.size);
            ctx.fillStyle = petal.color;
            ctx.fill();
            ctx.restore();
        }

        // 3. Interactive burst particles (Hearts, Petals, Sparkles)
        for (let i = burstParticles.length - 1; i >= 0; i -= 1) {
            const bp = burstParticles[i];
            bp.life += 1;
            bp.x += bp.vx;
            bp.y += bp.vy;
            bp.vy += 0.12; // Gravity
            bp.vx *= 0.96;

            const progress = bp.life / bp.maxLife;
            const alpha = 1 - progress;

            if (bp.life >= bp.maxLife) {
                burstParticles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.translate(bp.x, bp.y);
            ctx.globalAlpha = alpha;

            if (bp.type === 'heart') {
                ctx.fillStyle = '#ff4081';
                ctx.beginPath();
                const s = bp.size * 0.6;
                ctx.moveTo(0, s * 0.3);
                ctx.bezierCurveTo(-s, -s * 0.5, -s * 0.8, s * 0.8, 0, s * 1.3);
                ctx.bezierCurveTo(s * 0.8, s * 0.8, s, -s * 0.5, 0, s * 0.3);
                ctx.fill();
            } else if (bp.type === 'sparkle') {
                ctx.fillStyle = '#ffd54f';
                ctx.beginPath();
                const r = bp.size * 0.5;
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = bp.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, bp.size * 0.7, bp.size * 0.4, bp.life * 0.1, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    };

    const animate = (): void => {
        elapsed += 0.016;

        // Smooth Parallax Interpolation
        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;

        if (!reducedMotion) {
            bgLayer.style.transform = `translate3d(${-currentParallaxX * 14}px, ${-currentParallaxY * 8}px, 0)`;
            stageLayer.style.transform = `translate3d(${-currentParallaxX * 26}px, ${-currentParallaxY * 12}px, 0)`;
            fgLayer.style.transform = `translate3d(${-currentParallaxX * 42}px, ${-currentParallaxY * 18}px, 0)`;
        }

        updateCharactersMotion(elapsed);
        updateLeash(elapsed);

        const rect = container.getBoundingClientRect();
        drawParticles(rect.width, rect.height);

        animationId = window.requestAnimationFrame(animate);
    };

    // Pointer Parallax Handler
    const handlePointerMove = (e: PointerEvent): void => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            return;
        }
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        targetParallaxX = Math.max(-0.5, Math.min(0.5, relX));
        targetParallaxY = Math.max(-0.5, Math.min(0.5, relY));
    };

    const handlePointerLeave = (): void => {
        targetParallaxX = 0;
        targetParallaxY = 0;
    };

    // Bouquet click handler
    const handleBouquetClick = (e: MouseEvent): void => {
        e.stopPropagation();
        const rect = bouquetTrigger.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const burstX = rect.left - containerRect.left + rect.width / 2;
        const burstY = rect.top - containerRect.top + rect.height / 2;
        triggerBurst(burstX, burstY);
    };

    // General click on stage triggers pleasant soft sparkle
    const handleWorldClick = (e: MouseEvent): void => {
        const containerRect = container.getBoundingClientRect();
        const burstX = e.clientX - containerRect.left;
        const burstY = e.clientY - containerRect.top;
        triggerBurst(burstX, burstY);
    };

    // Load assets asynchronously and wire images
    void loadGardenAssets().then((assets: LoadedAssets) => {
        bgImg.src = assets.backgroundUrl;
        girlImg.src = assets.girlUrl;
        dogImg.src = assets.chihuahuaUrl;
        resizeCanvas();
    });

    const start = (): void => {
        if (animationId) {
            return;
        }
        resizeCanvas();
        animationId = window.requestAnimationFrame(animate);
    };

    let battleTimeouts: number[] = [];

    const clearBattleTimeouts = (): void => {
        battleTimeouts.forEach((id) => window.clearTimeout(id));
        battleTimeouts = [];
    };

    const callHero = (): void => {
        clearBattleTimeouts();

        // Reset classes for battle elements
        dragonNode.className = 'battle-character battle-character--dragon';
        princeNode.className = 'battle-character battle-character--prince';
        slashFx.className = 'battle-slash-fx';
        shoutBanner.className = 'battle-shout-banner';
        shoutBanner.textContent = '';
        battleLayer.classList.add('is-active');

        // Step 1: Dragon swoops into the background
        void dragonNode.offsetWidth;
        dragonNode.classList.add('is-entered');

        // Step 2: Prince Lam Bùi leaps in with hero aura
        const t1 = window.setTimeout(() => {
            princeNode.classList.add('is-entered');
            shoutBanner.textContent = romanticGreetingConfig.heroShout;
            shoutBanner.classList.add('is-visible');
        }, 600);
        battleTimeouts.push(t1);

        // Step 3: Prince dashes and slashes with holy sword
        const t2 = window.setTimeout(() => {
            princeNode.classList.add('is-attacking');
            slashFx.classList.add('is-active');

            const rect = container.getBoundingClientRect();
            triggerBurst(rect.width * 0.38, rect.height * 0.35);
        }, 1800);
        battleTimeouts.push(t2);

        // Step 4: Dragon is struck, shakes and becomes dizzy
        const t3 = window.setTimeout(() => {
            dragonNode.classList.add('is-hit');
            slashFx.classList.remove('is-active');

            const rect = container.getBoundingClientRect();
            triggerBurst(rect.width * 0.3, rect.height * 0.32);
            triggerBurst(rect.width * 0.42, rect.height * 0.3);
        }, 2200);
        battleTimeouts.push(t3);

        // Step 5: Dragon dissolves into sparkly petals, victory announcement
        const t4 = window.setTimeout(() => {
            dragonNode.classList.add('is-dissolved');
            princeNode.classList.remove('is-attacking');
            princeNode.classList.add('is-victorious');
            shoutBanner.textContent = romanticGreetingConfig.heroVictory;

            const rect = container.getBoundingClientRect();
            triggerBurst(rect.width * 0.5, rect.height * 0.38);
        }, 3000);
        battleTimeouts.push(t4);

        // Step 6: Prince waves victory and disappears into sparkles
        const t5 = window.setTimeout(() => {
            princeNode.classList.add('is-departing');
            shoutBanner.classList.remove('is-visible');
        }, 4800);
        battleTimeouts.push(t5);

        // Step 7: Reset battle layer
        const t6 = window.setTimeout(() => {
            battleLayer.classList.remove('is-active');
            dragonNode.className = 'battle-character battle-character--dragon';
            princeNode.className = 'battle-character battle-character--prince';
        }, 5800);
        battleTimeouts.push(t6);
    };

    let romanticLamTimer: number | null = null;

    const showRomanticLam = (wish?: string, durationMs = 3000): void => {
        if (romanticLamTimer !== null) {
            window.clearTimeout(romanticLamTimer);
            romanticLamTimer = null;
        }

        const isFirstEnter = !lamNode.classList.contains('is-entered');
        lamNode.classList.add('is-entered');

        lamNode.classList.remove('is-speaking');
        void lamNode.offsetWidth;
        lamNode.classList.add('is-speaking');

        if (wish) {
            speechBubble.innerHTML = `<span class="speech-author">🌹 ${romanticGreetingConfig.heroName}:</span> “${wish}”`;
            speechBubble.classList.remove('is-visible');
            void speechBubble.offsetWidth;
            speechBubble.classList.add('is-visible');
        }

        const rect = container.getBoundingClientRect();
        triggerBurst(rect.width * 0.28, rect.height * 0.52);
        if (isFirstEnter) {
            triggerBurst(rect.width * 0.32, rect.height * 0.45);
        }

        if (durationMs > 0) {
            romanticLamTimer = window.setTimeout(() => {
                hideRomanticLam();
                romanticLamTimer = null;
            }, durationMs);
        }
    };

    const hideRomanticLam = (): void => {
        if (romanticLamTimer !== null) {
            window.clearTimeout(romanticLamTimer);
            romanticLamTimer = null;
        }
        lamNode.classList.remove('is-entered');
        lamNode.classList.remove('is-speaking');
        speechBubble.classList.remove('is-visible');
    };

    const replay = (): void => {
        elapsed = 0;
        currentParallaxX = 0;
        currentParallaxY = 0;
        targetParallaxX = 0;
        targetParallaxY = 0;
        girlNode.classList.remove('is-entered');
        dogNode.classList.remove('is-entered');
        hideRomanticLam();
        void girlNode.offsetWidth; // Trigger reflow
        girlNode.classList.add('is-entered');
        dogNode.classList.add('is-entered');

        const rect = container.getBoundingClientRect();
        triggerBurst(rect.width * 0.5, rect.height * 0.45);
    };

    const revealGreeting = (): void => {
        showRomanticLam();
        onRevealGreeting();
    };

    window.addEventListener('resize', resizeCanvas);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    bouquetTrigger.addEventListener('click', handleBouquetClick);
    worldWrapper.addEventListener('click', handleWorldClick);

    // Initial entrance class
    window.setTimeout(() => {
        girlNode.classList.add('is-entered');
        dogNode.classList.add('is-entered');
    }, 100);

    return {
        start,
        replay,
        callHero,
        showRomanticLam,
        hideRomanticLam,
        revealGreeting,
        dispose: () => {
            clearBattleTimeouts();
            if (romanticLamTimer !== null) {
                window.clearTimeout(romanticLamTimer);
                romanticLamTimer = null;
            }
            window.cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeCanvas);
            container.removeEventListener('pointermove', handlePointerMove);
            container.removeEventListener('pointerleave', handlePointerLeave);
            bouquetTrigger.removeEventListener('click', handleBouquetClick);
            worldWrapper.removeEventListener('click', handleWorldClick);
            container.innerHTML = '';
        },
    };
}

