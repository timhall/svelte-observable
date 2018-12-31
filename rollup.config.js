import buble from 'rollup-plugin-buble';
import filesize from 'rollup-plugin-filesize';

export default {
  input: 'src/index.js',
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
  plugins: [buble(), filesize()]
};
