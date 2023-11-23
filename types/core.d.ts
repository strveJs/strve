import { vnodeType } from './utils';
declare const version: string;
declare const domInfo: WeakMap<object, any>;
declare function registerComponent(name: string): {
    name: string;
};
declare function onMounted(fn?: (() => void) | null): void;
declare function onUnmounted(fn?: (() => void) | null): void;
declare const nextTick: (fn: (() => void) | null) => Promise<void>;
declare function setData(callback: () => void, options: any): Promise<void>;
declare function createApp(template: () => vnodeType): {
    mount(el: Element | DocumentFragment | Comment | null): void;
};
export { createApp, domInfo, nextTick, onMounted, onUnmounted, setData, version, registerComponent, };
