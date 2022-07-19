import { terser } from 'rollup-plugin-terser';

export default {
	input: './lib/index.js',
	output: {
		file: './dist/strve.esm.js',
		format: 'esm', // iife
	},
	plugins: [terser()],
};
