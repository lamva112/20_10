import * as THREE from 'three';

export type GreetingSceneOptions = {
    reducedMotion?: boolean;
};

export type GreetingSceneController = {
    render: () => void;
    setReducedMotion: (enabled: boolean) => void;
    dispose: () => void;
};

export function createGreetingScene(
    container: HTMLElement,
    options: GreetingSceneOptions = {},
): GreetingSceneController {
    const reducedMotion = Boolean(options.reducedMotion);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.4, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xf5f7ff, 1.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf5d49d, 18, 30, 2);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0xf6c994,
            emissive: 0xf0b26d,
            emissiveIntensity: 1.1,
            metalness: 0.15,
            roughness: 0.45,
            transparent: true,
            opacity: 0.9,
        }),
    );
    scene.add(halo);

    const petalGroup = new THREE.Group();
    scene.add(petalGroup);

    const petals: THREE.Mesh[] = [];
    const petalGeometry = new THREE.SphereGeometry(0.55, 24, 24);
    const petalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe8d7d1,
        emissive: 0xdb8a7d,
        emissiveIntensity: 0.28,
        transparent: true,
        opacity: 0.72,
        roughness: 0.2,
        metalness: 0.05,
        transmission: 0.7,
        thickness: 0.7,
    });

    for (let index = 0; index < 12; index += 1) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (index / 12) * Math.PI * 2;
        const radius = 2.5 + (index % 3) * 0.4;

        petal.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle * 1.4) * 1.8,
            Math.sin(angle) * radius,
        );
        petal.scale.set(1.35, 1.9, 1.1);
        petal.rotation.set(angle, angle * 0.8, index * 0.3);
        petalGroup.add(petal);
        petals.push(petal);
    }

    const resize = (): void => {
        const { clientWidth, clientHeight } = container;
        const width = Math.max(clientWidth, 260);
        const height = Math.max(clientHeight, 260);

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    const animate = (): void => {
        if (reducedMotion) {
            renderer.render(scene, camera);
            return;
        }

        const elapsed = performance.now() * 0.001;
        petalGroup.rotation.y = elapsed * 0.6;
        petalGroup.rotation.x = Math.sin(elapsed * 1.4) * 0.7;
        halo.rotation.y = elapsed * 0.75;
        halo.scale.setScalar(1 + Math.sin(elapsed) * 0.07);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    resize();
    requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return {
        render: () => {
            resize();
            renderer.render(scene, camera);
        },
        setReducedMotion: (enabled: boolean) => {
            const nextReducedMotion = Boolean(enabled);
            if (nextReducedMotion) {
                petalGroup.rotation.set(0.4, 0.7, 0);
                halo.scale.setScalar(1);
            }
            renderer.render(scene, camera);
        },
        dispose: () => {
            window.removeEventListener('resize', resize);
            renderer.dispose();
            petalGeometry.dispose();
            petalMaterial.dispose();
            halo.geometry.dispose();
            halo.material.dispose();
            if ('dispose' in ambientLight && typeof ambientLight.dispose === 'function') {
                ambientLight.dispose();
            }
            if ('dispose' in pointLight && typeof pointLight.dispose === 'function') {
                pointLight.dispose();
            }
        },
    };
}
