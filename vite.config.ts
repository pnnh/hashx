import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { VitePWA } from "vite-plugin-pwa";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
    resolve: {
        alias: [
            { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
        ],
    },

    plugins: [
        react(),

        // Copy dist/index.html → dist/404.html for SPA fallback (GitHub Pages / CF Pages)
        viteStaticCopy({
            targets: [
                { src: "dist/index.html", dest: ".", rename: "404.html" },
            ],
        }),

        // PWA
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["logo48.png", "logo64.png", "logo128.png", "pwa-192.png", "pwa-512.png"],
            manifest: {
                name: "Hashx – Online Hash Tool",
                short_name: "Hashx",
                description:
                    "Client-side hash toolkit: MD5, SHA-1, SHA-256, SHA-512, SHA-3, BLAKE2b, BLAKE3, RIPEMD-160, HMAC. Works offline.",
                theme_color: "#1976d2",
                background_color: "#f5f5f5",
                display: "standalone",
                scope: "/",
                start_url: "/",
                orientation: "any",
                icons: [
                    {
                        src: "/logo48.png",
                        sizes: "48x48",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/logo64.png",
                        sizes: "64x64",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/logo128.png",
                        sizes: "128x128",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        // Required by Chrome for install prompt
                        src: "/pwa-192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        // Required by Chrome for install prompt + splash screen
                        src: "/pwa-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
                categories: ["utilities", "developer"],
            },
            workbox: {
                // Cache all static assets
                globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
                // Network-first for navigations (so new deploys are picked up)
                navigateFallback: "/index.html",
                navigateFallbackDenylist: [/^\/api\//],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                            cacheableResponse: { statuses: [0, 200] },
                        },
                    },
                ],
            },
            devOptions: {
                // Enable SW/manifest in `vite dev` so local runs can be installable.
                enabled: true,
            },
        }),
    ],

    // Tauri-specific options
    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
        host: host || true,
        hmr: host
            ? { protocol: "ws", host, port: 1421 }
            : undefined,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
    },
}));
