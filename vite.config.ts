import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {fileURLToPath, URL} from "url"
import {viteStaticCopy} from "vite-plugin-static-copy";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    resolve: {
        alias: [
            {find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url))},
        ],
    },
  plugins: [
    react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'index.html',
                    dest: '.',
                    rename: '404.html'
                }
            ]
        })
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || true,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
