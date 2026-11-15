import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.resolve(import.meta.dirname, 'src/frontend');

export default defineConfig({
  root,
  plugins: [react()],
  build: { outDir: path.resolve(import.meta.dirname, 'dist'), emptyOutDir: true },
});
