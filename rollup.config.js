import buble from 'rollup-plugin-buble';
import filesize from 'rollup-plugin-filesize';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/svelte-observable.umd.js',
      format: 'umd',
      name: 'svelteObservable',
      sourcemap: true
    }
  ],
  plugins: [buble(), filesize()]
};
