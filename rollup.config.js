import { terser } from 'rollup-plugin-terser';

export default {
	input: './dist/strve.iife.js', // ./lib/index.js ./dist/strve.iife.js
	output: {
		file: './dist/strve.iife.js',
		format: 'iife', // iife esm
	},
	plugins: [terser()],
};
