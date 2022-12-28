const { terser } = require('rollup-plugin-terser');
const replace = require('@rollup/plugin-replace');
const path = require('path');

const version = require('../package.json').version;
const resolve = (p) => {
	return path.resolve(__dirname, '../', p);
};

const banner =
	'/*!\n' +
	` * Strve.js v${version}\n` +
	` * (c) 2021-${new Date().getFullYear()} maomincoding\n` +
	' * Released under the MIT License.\n' +
	' */';

const builds = {
	// Runtime only ES modules development build
	'runtime-esm-dev': {
		input: resolve('config/input-runtime-esm.js'),
		output: {
			file: resolve('dist/strve.runtime-esm.js'),
			format: 'es',
			banner,
			exports: 'auto',
		},
		plugins: [],
	},
	// Runtime only ES modules production build
	'runtime-esm-prod': {
		input: resolve('config/input-runtime-esm.js'),
		output: {
			file: resolve('dist/strve.runtime-esm.prod.js'),
			format: 'es',
			banner,
			exports: 'auto',
		},
		plugins: [terser()],
	},
	// Runtime+compiler ES modules development build (Browser)
	'full-esm-dev': {
		input: resolve('config/input-full-esm.js'),
		output: {
			file: resolve('dist/strve.full-esm.js'),
			format: 'es',
			banner,
			exports: 'auto',
		},
		plugins: [],
	},
	// Runtime+compiler ES modules production build (Browser)
	'full-esm-prod': {
		input: resolve('config/input-full-esm.js'),
		output: {
			file: resolve('dist/strve.full-esm.prod.js'),
			format: 'es',
			banner,
			exports: 'auto',
		},
		plugins: [terser()],
	},
	// Runtime+compiler development build (Browser)
	'full-dev': {
		input: resolve('config/input-full-esm.js'),
		output: {
			file: resolve('dist/strve.full.js'),
			format: 'umd',
			banner,
			name: 'Strve',
			exports: 'auto',
		},
		plugins: [],
	},
	// Runtime+compiler production build (Browser)
	'full-prod': {
		input: resolve('config/input-full-esm.js'),
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

const config = builds[process.env.TARGET];
const vars = {
	__VERSION__: version,
};
config['plugins'].push(replace(vars));

module.exports = config;
