import { defineConfig } from "vite";
import path from "path";
import banner from "vite-plugin-banner";
import os from "os";

// Helper: Find local network IP with priority for 192.168. windows sometimes gives a wsl 172 ip, so this prevents vite hosting files on that ip.
function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  let firstValidIp = "localhost";

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip non-IPv4 and internal (localhost) addresses
      if ("IPv4" !== iface.family || iface.internal) continue;

      // PRIORITY CHECK: If we find a 192.168 address, return it immediately.
      if (iface.address.startsWith("192.168")) {
        return iface.address;
      }

      // If we haven't found a 192 address yet, store the first valid one we found
      // (like the 172.x WSL one) to use as a fallback.
      if (firstValidIp === "localhost") {
        firstValidIp = iface.address;
      }
    }
  }

  // If no 192.168 address was found, return the fallback (WSL IP) or localhost
  return firstValidIp;
}

const localIp = getNetworkIp();

export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  return {
    server: isDev && {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      cors: true,
      origin: `http://${localIp}:5173`, // Dynamic Origin
      hmr: {
        host: localIp, // Dynamic HMR Host
        protocol: "ws",
        port: 5173,
      },
    },
    base: isDev ? "/" : "./",
    assetsInclude: ["**/*.woff2", "**/*.woff", "**/*.ttf"],
    plugins: [
      banner(
        "/*\n" +
          " Theme Name:   Bricks Child Theme\n" +
          " Theme URI:    https://bricksbuilder.io/\n" +
          " Description:  Use this child theme to extend Bricks.\n" +
          " Author:       Bricks\n" +
          " Author URI:   https://bricksbuilder.io/\n" +
          " Template:     bricks\n" +
          " Version:      1.1\n" +
          " Text Domain:  bricks\n" +
          "*/",
      ),
    ],
    build: {
      outDir: "dist",
      assetsDir: "",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "resources/js/main.js"),
          style: path.resolve(__dirname, "resources/scss/main.scss"),
        },
        output: {
          entryFileNames: "script.js",
          assetFileNames: (assetInfo) => (assetInfo.name && assetInfo.name.endsWith(".css") ? "style.css" : "[name][extname]"),
        },
      },
    },
  };
});
