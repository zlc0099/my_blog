import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.BASE_PATH
  ?? (repository && !repository.endsWith('.github.io') ? `/${repository}/` : '/');

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
  },
});
