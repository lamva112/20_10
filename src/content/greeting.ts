export type GreetingContent = {
    recipient: string;
    title: string;
    message: string;
    detail: string;
    primaryAction: string;
    secondaryAction: string;
    reducedMotionFallback: string;
    badgeLabel: string;
    sceneLabel: string;
};

export function createGreetingContent(recipient = 'Ánh'): GreetingContent {
    return {
        recipient,
        title: `${recipient}`,
        message: 'A little universe, made just for you.',
        detail: `A quiet, luminous orbit of petals and warm light for ${recipient}.`,
        primaryAction: 'Explore the scene',
        secondaryAction: 'Reset the motion',
        reducedMotionFallback: 'A little space, just for you.',
        badgeLabel: 'A keepsake for you',
        sceneLabel: 'Interactive 3D greeting scene',
    };
}
