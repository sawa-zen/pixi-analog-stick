import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

let plugins = [
  resolve(),
  babel(),
  commonjs(),
];

if (process.env.BUILD === 'production') {
  plugins.push(uglify());
}

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/pixi-analog-stick.js',
      format: 'umd',
      name: 'PixiAnalogStick',
      globals: {
        'pixi.js': 'PIXI'
      }
    },
  ],
  external: ['pixi.js'],
  watch: {
    include: 'src/**',
  },
  plugins: plugins,
};
