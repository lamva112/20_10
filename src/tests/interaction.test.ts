import { describe, expect, it } from 'vitest';

import { createInteractionController } from '../scene/interaction';

describe('interaction controller', () => {
    it('tracks drag movement with pointer events', () => {
        const target = document.createElement('div');
        const controller = createInteractionController(target);

        controller.onPointerDown({ clientX: 10, clientY: 20 } as PointerEvent);
        controller.onPointerMove({ clientX: 20, clientY: 10 } as PointerEvent);

        expect(controller.isInteractive()).toBe(true);
        expect(controller.getRotation().x).not.toBe(0);
        expect(controller.getRotation().y).not.toBe(0);
    });

    it('disables interactivity when reduced motion is requested', () => {
        const target = document.createElement('div');
        const controller = createInteractionController(target, { reducedMotion: true });

        expect(controller.isInteractive()).toBe(false);
    });
});
