import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const page = (path) => fileURLToPath(new URL(path, import.meta.url));

// GitHub Pages answers /work with a 301 to /work/. Do the same in dev and
// preview, where appType 'mpa' would otherwise return an empty 404.
function trailingSlash() {
  const redirect = (req, res, next) => {
    const [path, query] = req.url.split('?');
    if (path === '/work' || path === '/about') {
      res.writeHead(301, { Location: `${path}/${query ? `?${query}` : ''}` });
      res.end();
      return;
    }
    next();
  };
  return {
    name: 'trailing-slash',
    configureServer(server) {
      server.middlewares.use(redirect);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), trailingSlash()],
  base: '/',
  appType: 'mpa',
  define: {
    // UTC so a local build and CI agree on the footer year.
    __BUILD_YEAR__: JSON.stringify(new Date().getUTCFullYear()),
  },
  build: {
    // The SSR build (scripts/prerender.mjs) only needs the render function.
    copyPublicDir: !isSsrBuild,
    rollupOptions: {
      input: {
        home: page('./index.html'),
        work: page('./work/index.html'),
        about: page('./about/index.html'),
        notfound: page('./404.html'),
      },
    },
  },
}));
