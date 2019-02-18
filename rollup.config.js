import typescript from 'rollup-plugin-typescript';
import dts from 'rollup-plugin-dts';
import filesize from 'rollup-plugin-filesize';

export default [
  {
    input: 'src/index.ts',
    external: ['svelte/store'],
    output: [
      {
        file: 'dist/svelte-observable.es.js',
        format: 'es',
        sourcemap: true
      },
      {
        file: 'dist/svelte-observable.cjs.js',
        format: 'cjs',
        sourcemap: true
      }
    ],
    plugins: [typescript(), filesize()]
  },
  {
    input: 'src/index.ts',
    external: ['svelte/store'],
    output: {
      file: 'dist/svelte-observable.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];
