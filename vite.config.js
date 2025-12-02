import { defineConfig } from 'vite';
import path from 'path';
import banner from 'vite-plugin-banner';
import os from 'os';

// Helper: Find local network IP
function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if ('IPv4' !== iface.family || iface.internal) continue;
      return iface.address;
    }
  }
  return 'localhost';
}

const localIp = getNetworkIp();

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    server: isDev && {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      cors: true,
      origin: `http://${localIp}:5173`, // Dynamic Origin
      hmr: {
        host: localIp,                // Dynamic HMR Host
        protocol: 'ws',
        port: 5173,
      },
    },
    base: isDev ? '/' : './',
    assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf'],
    plugins: [
      banner(
        '/*\n' +
        ' Theme Name:   Bricks Child Theme\n' +
        ' Theme URI:    https://bricksbuilder.io/\n' +
        ' Description:  Use this child theme to extend Bricks.\n' +
        ' Author:       Bricks\n' +
        ' Author URI:   https://bricksbuilder.io/\n' +
        ' Template:     bricks\n' +
        ' Version:      1.1\n' +
        ' Text Domain:  bricks\n' +
        '*/'
      ),
    ],
    build: {
      outDir: 'dist',
      assetsDir: '',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'resources/js/main.js'),
          style: path.resolve(__dirname, 'resources/scss/style.scss'),
        },
        output: {
          entryFileNames: 'script.js',
          assetFileNames: assetInfo =>
            assetInfo.name && assetInfo.name.endsWith('.css')
              ? 'style.css'
              : '[name][extname]',
        },
      },
    },
  };
});