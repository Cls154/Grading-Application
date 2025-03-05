import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()], // Add Vue plugin
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.js',
  },
});