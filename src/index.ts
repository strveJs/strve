/*!
 * Strve.js v4.1.0
 * (c) 2021-2022 maomincoding
 * Released under the MIT License.
 */

export { createApp, version } from './init.js';

export { watchDom, clone } from './util.js';

export { h } from './compile.js';

export {
	setData,
	domInfo,
	onMounted,
	onUnmounted,
	nextTick,
	propsData,
} from './diff.js';
