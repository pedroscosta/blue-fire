import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve('src', 'main.ts'),
      name: 'test-extension',
      formats: ['es'],
      fileName: 'extension',
    },
  },
});
