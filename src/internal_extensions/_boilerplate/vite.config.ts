import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteExternalsPlugin({
      bluefire: 'Bluefire',
    }),
  ],
  build: {
    lib: {
      entry: resolve('src', 'main'),
      name: 'test-extension',
      formats: ['es'],
      fileName: 'extension',
    },
  },
});
