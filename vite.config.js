import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If this repo is ever renamed to `<username>.github.io`, change base to '/'.
export default defineConfig({
  plugins: [react()],
  base: '/new-profile/',
});
