import '@picocss/pico/css/pico.min.css';
import './styles/app.css';

import { getRandomWish, romanticGreetingConfig } from './content/gardenConfig';
import { createGreetingContent } from './content/greeting';
import { createGardenScene, type GardenSceneController } from './scene/gardenScene';
import { createGreetingScene } from './scene/greetingScene';
import { createInteractionController } from './scene/interaction';
import { createFallingPetals } from './ui/fallingPetals';
import { renderGreetingOverlay } from './ui/greetingOverlay';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
    throw new Error('Root app container not found.');
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const content = createGreetingContent('Ánh');

const page = document.createElement('main');
page.className = 'preview-root';

const hero = document.createElement('section');
hero.className = 'preview-hero';
hero.setAttribute('aria-label', content.sceneLabel);
page.appendChild(hero);

let gardenSceneController: GardenSceneController | null = null;
let audioContext: AudioContext | null = null;
let bgAudio: HTMLAudioElement | null = null;
let musicEnabled = false;
let musicTimer: number | null = null;

const floatingMusicBtn = document.createElement('button');
floatingMusicBtn.type = 'button';
floatingMusicBtn.className = 'floating-music-btn';
floatingMusicBtn.innerHTML = '<span class="music-icon">🎵</span> <span class="music-label">Bật nhạc: Chờ chút</span>';
floatingMusicBtn.title = 'Phát nhạc nền: Chờ chút - CongB, Tinh Hà';
app.appendChild(floatingMusicBtn);

const getAudioInstance = (): HTMLAudioElement => {
    if (!bgAudio) {
        bgAudio = new Audio(romanticGreetingConfig.musicSrc);
        bgAudio.loop = true;
        bgAudio.volume = 0.65;
        bgAudio.preload = 'auto';
    }
    return bgAudio;
};

const playSynthFallback = (): void => {
    if (!audioContext) {
        const AudioCtor =
            window.AudioContext ||
            (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtor) {
            audioContext = new AudioCtor();
        }
    }
    const ctx = audioContext;
    if (!ctx || ctx.state === 'closed') {
        return;
    }
    if (ctx.state === 'suspended') {
        void ctx.resume();
    }
    const now = ctx.currentTime;
    const melody = [
        { f: 329.63, d: 0.35, t: 0.0 },
        { f: 415.3, d: 0.35, t: 0.38 },
        { f: 493.88, d: 0.4, t: 0.76 },
        { f: 659.25, d: 0.6, t: 1.14 },
        { f: 622.25, d: 0.4, t: 1.74 },
        { f: 554.37, d: 0.45, t: 2.14 },
        { f: 493.88, d: 0.7, t: 2.6 },
        { f: 440.0, d: 0.5, t: 3.2 },
        { f: 415.3, d: 0.8, t: 3.7 },
    ];
    melody.forEach(({ f, d, t }) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = f;
        gainNode.gain.setValueAtTime(0.0001, now + t);
        gainNode.gain.exponentialRampToValueAtTime(0.045, now + t + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + t + d + 0.35);
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start(now + t);
        oscillator.stop(now + t + d + 0.4);
    });
};

const updateMusicButtonsUI = (isOn: boolean): void => {
    const toolbarBtn = hero.querySelector<HTMLButtonElement>('[data-action="music"]');
    if (toolbarBtn) {
        toolbarBtn.classList.toggle('is-on', isOn);
        toolbarBtn.textContent = isOn ? '🎵 Tắt nhạc' : '🎵 Bật nhạc';
        toolbarBtn.title = isOn ? 'Đang phát: Chờ chút (Bấm để tắt)' : 'Bấm để phát: Chờ chút';
    }
    floatingMusicBtn.classList.toggle('is-on', isOn);
    floatingMusicBtn.innerHTML = isOn
        ? '<span class="music-icon">🔊</span> <span class="music-label">Tắt nhạc: Chờ chút</span>'
        : '<span class="music-icon">🎵</span> <span class="music-label">Bật nhạc: Chờ chút</span>';
};

const setMusicState = (enable: boolean): void => {
    const audio = getAudioInstance();

    if (enable) {
        musicEnabled = true;
        updateMusicButtonsUI(true);
        audio.play().catch(() => {
            playSynthFallback();
            if (musicTimer === null) {
                musicTimer = window.setInterval(playSynthFallback, 4600);
            }
        });
    } else {
        musicEnabled = false;
        updateMusicButtonsUI(false);
        audio.pause();
        if (musicTimer !== null) {
            window.clearInterval(musicTimer);
            musicTimer = null;
        }
        const ctx = audioContext;
        if (ctx && ctx.state !== 'closed') {
            void ctx.suspend();
        }
    }
};

const toggleMusic = (): void => {
    setMusicState(!musicEnabled);
};

floatingMusicBtn.addEventListener('click', toggleMusic);

const revealCard = document.createElement('div');
revealCard.className = 'garden-reveal';
revealCard.title = 'Bấm nút đóng ✕ hoặc nhấp vào để ẩn';
revealCard.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.reveal-close-btn') || target.classList.contains('garden-reveal')) {
        revealCard.classList.remove('is-visible');
    }
});
hero.appendChild(revealCard);

let currentWishIndex = -1;
let revealCardTimer: number | null = null;

const showReveal = (): void => {
    const { wish, index } = getRandomWish(currentWishIndex);
    currentWishIndex = index;

    if (gardenSceneController) {
        gardenSceneController.showRomanticLam(wish, 3000);
    }

    revealCard.innerHTML = `
      <div class="garden-reveal__sparkles" aria-hidden="true"></div>
      <button type="button" class="reveal-close-btn" aria-label="Đóng lời chúc">✕</button>
      <div class="garden-reveal__speaker">
        <img src="/images/lam-bui-romantic.svg" alt="${romanticGreetingConfig.heroName}" class="speaker-avatar" />
        <div class="speaker-meta">
          <span class="speaker-badge">🌹 Lời chúc 20/10 từ ${romanticGreetingConfig.heroName}</span>
          <span class="speaker-hint">Trao gửi riêng đến ${romanticGreetingConfig.recipient} ❤️</span>
        </div>
      </div>
      <blockquote class="garden-reveal__quote">“${wish}”</blockquote>
      <p class="garden-reveal__subtext">${romanticGreetingConfig.secondaryGreeting}</p>
      <div class="garden-reveal__footer">
        <span class="reveal-tip">✨ Bấm "Reveal gift" để nhận thêm lời chúc ngọt ngào khác nha!</span>
      </div>
    `;

    revealCard.classList.remove('is-visible');
    void revealCard.offsetWidth;
    revealCard.classList.add('is-visible');

    if (revealCardTimer !== null) {
        window.clearTimeout(revealCardTimer);
    }
    revealCardTimer = window.setTimeout(() => {
        revealCard.classList.remove('is-visible');
        revealCardTimer = null;
    }, 3000);
};

const bouquetMessage = document.createElement('div');
bouquetMessage.className = 'garden-message';
bouquetMessage.textContent = romanticGreetingConfig.bouquetMessage;
hero.appendChild(bouquetMessage);

const handleReset = (): void => {
    const sceneHost = hero.querySelector<HTMLElement>('[data-scene]');
    if (sceneHost) {
        sceneHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (revealCardTimer !== null) {
        window.clearTimeout(revealCardTimer);
        revealCardTimer = null;
    }
    revealCard.classList.remove('is-visible');
    if (gardenSceneController) {
        gardenSceneController.hideRomanticLam();
    }
};

const setGardenVisible = (visible: boolean): void => {
    const sceneHost = hero.querySelector<HTMLElement>('[data-scene]');
    const gardenHost = hero.querySelector<HTMLElement>('.preview-scene--garden');
    const controls = hero.querySelector<HTMLElement>('.scene-toolbar');

    if (sceneHost) {
        sceneHost.classList.toggle('is-hidden', visible);
    }
    if (gardenHost) {
        gardenHost.classList.toggle('is-visible', visible);
        gardenHost.style.pointerEvents = visible ? 'auto' : 'none';
    }
    if (controls) {
        controls.classList.toggle('is-visible', visible);
    }
};

const handleExplore = (): void => {
    if (!gardenSceneController) {
        const gardenHost = hero.querySelector<HTMLElement>('.preview-scene--garden');
        if (!gardenHost) {
            return;
        }

        gardenSceneController = createGardenScene(gardenHost, {
            reducedMotion,
            recipient: romanticGreetingConfig.recipient,
            onBouquetBurst: (message) => {
                bouquetMessage.textContent = message;
                bouquetMessage.classList.add('is-visible');
                window.setTimeout(() => bouquetMessage.classList.remove('is-visible'), 2600);
            },
            onRevealGreeting: showReveal,
        });
        gardenSceneController.start();
    } else {
        gardenSceneController.replay();
        revealCard.classList.remove('is-visible');
    }

    setGardenVisible(true);
    if (!musicEnabled) {
        setMusicState(true);
    }
};

renderGreetingOverlay(hero, content, handleExplore, handleReset);

const sceneHost = document.createElement('div');
sceneHost.className = 'preview-scene';
sceneHost.dataset.scene = 'true';
sceneHost.setAttribute('aria-label', content.sceneLabel);
sceneHost.title = content.sceneLabel;
hero.appendChild(sceneHost);

const gardenHost = document.createElement('div');
gardenHost.className = 'preview-scene preview-scene--garden';
gardenHost.setAttribute('aria-label', 'Romantic garden scene');
gardenHost.title = 'Romantic garden scene';
hero.appendChild(gardenHost);

const toolbar = document.createElement('div');
toolbar.className = 'scene-toolbar';
toolbar.innerHTML = `
  <button type="button" class="scene-btn scene-btn--secondary" data-action="back">Back</button>
  <button type="button" class="scene-btn scene-btn--secondary" data-action="call-hero">⚔️ ${romanticGreetingConfig.callHeroLabel}</button>
  <button type="button" class="scene-btn scene-btn--secondary" data-action="gift">Reveal gift</button>
  <button type="button" class="scene-btn scene-btn--primary" data-action="music">🎵 Bật nhạc</button>
`;
const backButton = toolbar.querySelector<HTMLButtonElement>('[data-action="back"]');
const callHeroButton =
    toolbar.querySelector<HTMLButtonElement>('[data-action="call-hero"]') ??
    toolbar.querySelector<HTMLButtonElement>('[data-action="replay"]');
const giftButton = toolbar.querySelector<HTMLButtonElement>('[data-action="gift"]');
const musicButton = toolbar.querySelector<HTMLButtonElement>('[data-action="music"]');

backButton?.addEventListener('click', () => {
    setGardenVisible(false);
    if (revealCardTimer !== null) {
        window.clearTimeout(revealCardTimer);
        revealCardTimer = null;
    }
    revealCard.classList.remove('is-visible');
    if (gardenSceneController) {
        gardenSceneController.hideRomanticLam();
    }
});
callHeroButton?.addEventListener('click', () => {
    if (gardenSceneController) {
        gardenSceneController.callHero();
    }
    if (revealCardTimer !== null) {
        window.clearTimeout(revealCardTimer);
        revealCardTimer = null;
    }
    revealCard.classList.remove('is-visible');
    bouquetMessage.classList.remove('is-visible');
    setGardenVisible(true);
});
giftButton?.addEventListener('click', showReveal);
musicButton?.addEventListener('click', toggleMusic);
hero.appendChild(toolbar);

const sceneController = createGreetingScene(sceneHost, { reducedMotion });
const interactionController = createInteractionController(sceneHost, { reducedMotion });

const animateScene = (): void => {
    const rotation = interactionController.getRotation();
    const scene = sceneHost.querySelector('canvas');

    if (!scene) {
        return;
    }

    const pointerTarget = scene.closest('div');
    if (!pointerTarget) {
        return;
    }

    pointerTarget.style.transform = `rotate(${rotation.y}rad) rotateX(${rotation.x}rad)`;
};

sceneHost.addEventListener('pointermove', animateScene);
sceneHost.addEventListener('pointerup', animateScene);
sceneHost.addEventListener('pointerleave', animateScene);

window.addEventListener('load', () => {
    sceneController.render();
});

app.appendChild(page);
createFallingPetals({ reducedMotion });
