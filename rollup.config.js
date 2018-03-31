import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/pixi-analog-stick.js',
    format: 'umd',
    name: 'PixiAnalogStick',
  },
  external: ['pixi.js'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    resolve(),
    babel(),
    commonjs(),
    // uglify(),
  ],
};
