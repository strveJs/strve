import { terser } from 'rollup-plugin-terser';

export default {
	input: './lib/index.js', // ./lib/index.js ./dist/strve.iife.js
	output: {
		file: './dist/strve.esm.js',
		format: 'esm', // iife esm
	},
	plugins: [terser()],
};
