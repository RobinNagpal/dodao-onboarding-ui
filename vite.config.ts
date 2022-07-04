import graphql from '@rollup/plugin-graphql';
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
    }),
    graphql()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ag-grid-community/core$': path.resolve(__dirname, 'node_modules/@ag-grid-community/core'),
      '@dodao/onboarding-schemas': path.resolve(__dirname, './dodao-onboarding-schemas/src'),
      vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js'),
      web3: path.resolve(__dirname, 'web3/dist/web3.min.js')
    },
    dedupe: ['@popperjs/core']
  },

  optimizeDeps: {
    include: ['color'],
    // @ts-ignore
    allowNodeBuiltins: ['stream']
  }
});
