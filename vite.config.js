import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const config = defineConfig({
  build: {
    reportCompressedSize: true,
    lib: {
      entry: './src/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['effector', 'final-form'],
    },
    chunkSizeWarningLimit: 4,
  },
  plugins: [
    dts({
      noEmitOnError: true,
      copyDtsFiles: true,
      include: ['./src/**'],
    }),
  ],
  test: {
    typecheck: true,
    globals: true,
    watch: false,
  },
});

export default config;
