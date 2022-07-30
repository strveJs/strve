/*!
 * Strve.js v4.2.0
 * (c) 2021-2022 maomincoding
 * Released under the MIT License.
 */
interface setDataOptionsType {
	status: string;
	name: Function;
}
export function h(s: any, ...args: any[]): any;
export declare let propsData: any;
export declare function onMounted(fn: Function): void;
export declare function onUnmounted(fn: Function): void;
export declare function nextTick(fn: Function): void;
export declare function setData(
	callback: Function,
	options: setDataOptionsType
): Promise<void>;
export declare const version: string;
export declare function createApp(template: Function): {
	mount(el: HTMLElement | String): void;
};
