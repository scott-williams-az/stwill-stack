import { Package } from 'resolve.exports';
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'

import pkg from "./package.json";
const { peerDependencies = {} } = pkg as Package;

const getName = (info: { name?: string; fileName?: string }) => {
  // Use info.name or info.fileName to extract the base name
  const filePath = info.fileName || info.name || '';
  // regex matches string after last slash and before the last dot
  // e.g. /path/to/file.css -> file
  // e.g. /path/to/file.min.css -> file.min
  const match = filePath.match(/\/?([^\/]+?)(\.[^\.\/]+)?$/);
  return match?.[1] || "[name]";
};

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    root: resolve(__dirname, "src"),
    base: "/",
    build: {
      emptyOutDir: true,
      sourcemap: true,
      cssMinify: false,
      cssCodeSplit: true,
      outDir: "../dist",
      rollupOptions: {
        external: [...Object.keys(peerDependencies || {}), "chart.js"],
        treeshake: true,
        input: [
          // resolve(__dirname, "src/scss/unity-bootstrap-theme.bundle.scss"),
          resolve(__dirname, "src/scss/theme.scss"),
          // resolve(__dirname, "src/scss/unity-bootstrap-header-footer.scss"),
        ],
        output: {
          globals: {
            "chart.js": "Chart",
          },
          entryFileNames: info => `js/${getName(info)}.[format].js`,
          chunkFileNames: info => `js/${getName(info)}.[format].js`,
          assetFileNames: info => `css/${getName(info)}.[ext]`,
        },
      },
      lib: {
            entry: resolve(__dirname, "src/js/main.js"),
            formats: ["umd", "cjs", "es"],
            name: "stwillBootstrap",
          },
      },
      esbuild: {
        loader: "jsx",
        include: /.*\.jsx?$/,
        exclude: [],
      },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    server: {
      port: 8080
    },
    css: {
      preprocessorOptions: {
          scss: {
            silenceDeprecations: [
              'import',
              'mixed-decls',
              'color-functions',
              'global-builtin',
              'legacy-js-api',
            ],
          },
      },
    },
  }
})
