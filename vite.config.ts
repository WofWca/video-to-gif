import childProcess from 'node:child_process';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import UnoCSS from 'unocss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

let GIT_REVISION = 'unknown'
try { GIT_REVISION = childProcess.execSync("git rev-parse HEAD").toString().trim() } catch { }

export default defineConfig({
  plugins: [
    UnoCSS(),
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    devtools(),
    solidPlugin(),
    viteStaticCopy({
      targets: [
        { src: './LICENSE', dest: './' },

        { src: './node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js', dest: './assets' },
        { src: './node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm', dest: './assets' },
      ]
    })
  ],
  server: {
    port: 3000,
  },
  base: './',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        assetFileNames(chunkInfo) {
          if (chunkInfo.name === 'favicon.ico') {
            // Ensure that it has constant name so that we can reference it
            // from `manifest.json`.
            // TODO fix: Though it doesn't appear to be displayed
            // anywhere anyway...
            return 'assets/[name][extname]'
          }
          // Default value
          // https://rollupjs.org/configuration-options/#output-assetfilenames
          return 'assets/[name]-[hash][extname]'
        },
      }
    }
  },
  define: {
    GIT_REVISION: JSON.stringify(GIT_REVISION)
  }
});
