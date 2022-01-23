import vue from '@vitejs/plugin-vue';
import path from 'path';
import visualizer from 'rollup-plugin-visualizer';
import ViteComponents from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: true,
    minify: false
  },
  define: {
    'process.env': process.env
  },
  plugins: [
    vue({ reactivityTransform: true }),
    ViteComponents({ directoryAsNamespace: true }),
    visualizer({
      filename: './dist/stats.html',
      template: 'sunburst',
      gzipSize: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@dodao/onboarding-schemas': path.resolve(
        __dirname,
        './dodao-onboarding-schemas/src'
      )
    },
    dedupe: ['@popperjs/core']
  },

  optimizeDeps: {
    include: ['color'],
    // @ts-ignore
    allowNodeBuiltins: ['stream']
  }
});
