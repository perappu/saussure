import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        sveltekit(),
        paraglideVitePlugin({
            project: './project.inlang',
            outdir: './src/lib/paraglide',
            disableAsyncLocalStorage: true,
            strategy: ['cookie', 'preferredLanguage', 'baseLocale']
        }),
        nodePolyfills({
            globals: {
                Buffer: true, // can also be 'build', 'dev', or false,
                process: true
            },
            overrides: {
                // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
                fs: 'memfs'
            }
        })
    ]
});
