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
    chunkSizeWarningLimit: 3,
  },
  plugins: [
    dts({
      noEmitOnError: true,
      copyDtsFiles: true,
      include: ['./src/**'],
    }),
  ],
});

export default config;