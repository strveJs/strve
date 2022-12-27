const { terser } = require('rollup-plugin-terser');
const path = require('path');

const version = process.env.VERSION || require('./package.json').version;
const resolve = (p) => {
	return path.resolve(__dirname, './', p);
};

const banner =
	'/*!\n' +
	` * Strve.js v${version}\n` +
	` * (c) 2021-${new Date().getFullYear()} maomincoding\n` +
	' * Released under the MIT License.\n' +
	' */';

const builds = {
	'runtime-esm-dev': {
		input: resolve('build/input-runtime-esm.js'),
		output: {
			file: resolve('dist/strve.runtime-esm.js'),
			format: 'es',
			banner,
			exports: 'auto',
		},
	},
	'runtime-esm-prod': {
		input: resolve('build/input-runtime-esm.js'),
		output: {
			file: resolve('dist/strve.runtime-esm.prod.js'),
			format: 'es',
			banner,
			exports: 'auto',
		},
		plugins: [terser()],
	},
	'full-esm-dev': {
		input: resolve('build/input-full-esm.js'),
		output: {
			file: resolve('dist/strve.full-esm.js'),
			format: 'es',
			banner,
			exports: 'auto',
		},
	},
	'full-esm-prod': {
		input: resolve('build/input-full-esm.js'),
		output: {
			file: resolve('dist/strve.full-esm.prod.js'),
			format: 'es',
			banner,
			exports: 'auto',
		},
		plugins: [terser()],
	},
	'full-dev': {
		input: resolve('build/input-full.js'),
		output: {
			file: resolve('dist/strve.full.js'),
			format: 'umd',
			banner,
			name: 'Strve',
			exports: 'auto',
		},
	},
	'full-prod': {
		input: resolve('build/input-full.js'),
		output: {
			file: resolve('dist/strve.full.prod.js'),
			format: 'umd',
			banner,
			name: 'Strve',
			exports: 'auto',
		},
		plugins: [terser()],
	},
};

module.exports = builds[process.env.TARGET];
