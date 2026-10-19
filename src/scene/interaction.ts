export type Rotation = {
    x: number;
    y: number;
};

export type InteractionControllerOptions = {
    reducedMotion?: boolean;
};

export type InteractionController = {
    onPointerDown: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
    onPointerUp: () => void;
    onPointerLeave: () => void;
    getRotation: () => Rotation;
    isInteractive: () => boolean;
    dispose: () => void;
};

export function createInteractionController(
    target: HTMLElement,
    options: InteractionControllerOptions = {},
): InteractionController {
    const reducedMotion = Boolean(options.reducedMotion);
    const state = {
        dragging: false,
        lastX: 0,
        lastY: 0,
        rotation: { x: 0, y: 0 },
    };

    const setPointerPosition = (event: PointerEvent): void => {
        state.lastX = event.clientX;
        state.lastY = event.clientY;
    };

    const onPointerDown = (event: PointerEvent): void => {
        if (reducedMotion) {
            return;
        }

        state.dragging = true;
        if (typeof target.setPointerCapture === 'function') {
            target.setPointerCapture(event.pointerId);
        }
        setPointerPosition(event);
    };

    const onPointerMove = (event: PointerEvent): void => {
        if (!state.dragging || reducedMotion) {
            return;
        }

        const deltaX = event.clientX - state.lastX;
        const deltaY = event.clientY - state.lastY;

        state.rotation.x += deltaY * 0.01;
        state.rotation.y += deltaX * 0.01;
        setPointerPosition(event);
    };

    const onPointerUp = (): void => {
        state.dragging = false;
    };

    const onPointerLeave = (): void => {
        state.dragging = false;
    };

    target.addEventListener('pointerdown', onPointerDown);
    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
    target.addEventListener('pointerleave', onPointerLeave);

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerLeave,
        getRotation: () => ({ ...state.rotation }),
        isInteractive: () => !reducedMotion,
        dispose: () => {
            target.removeEventListener('pointerdown', onPointerDown);
            target.removeEventListener('pointermove', onPointerMove);
            target.removeEventListener('pointerup', onPointerUp);
            target.removeEventListener('pointerleave', onPointerLeave);
        },
    };
}

