import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./setupTests.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.ts'],
    },
  },
  resolve: {
    alias: [
      {
        find: /^@f1\/be\/(.*)$/,
        replacement: path.resolve(__dirname, 'src/$1'),
      },
      {
        find: /^@f1\/types\/(.*)$/,
        replacement: path.resolve(__dirname, '../libs/types/$1'),
      },
    ],
  },
});
