import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

import { fileURLToPath } from 'node:url';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // Load a small setup file to polyfill canvas in the jsdom environment
      setupFiles: [fileURLToPath(new URL('./vitest.setup.ts', import.meta.url))],
    },
  }),
);
