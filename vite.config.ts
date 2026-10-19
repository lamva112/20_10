import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    server: {
        host: true,
        port: 5173,
        strictPort: false,
    },
    preview: {
        host: true,
        port: 4173,
        strictPort: false,
    },
    test: {
        environment: 'jsdom',
        globals: true,
    },
});
