import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        stores: path.resolve(__dirname, 'src/stores.tsx'),
        terminal: path.resolve(__dirname, 'src/terminal.tsx'),
      },
      name: 'MacOS',
      fileName: (format) => `macos-react.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'ansi-to-html'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: 'chrome',
    },
  },
});
