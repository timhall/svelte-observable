import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'public/bundle.js',
      format: 'iife',
      source: true,
      name: 'SvelteObservable'
    }
  ],
  plugins: [
    svelte({
      css: css => css.write('public/bundle.css')
    }),
    resolve(),
    commonjs()
  ]
};
