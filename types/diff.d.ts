interface setDataOptionsType {
    status: string;
    name: Function;
}
export interface vnodeType {
    tag: string;
    props: any;
    children: any[];
    el?: HTMLElement;
}
export declare const domInfo: any;
export declare let propsData: any;
export declare function onMounted(fn: Function): void;
export declare function onUnmounted(fn: Function): void;
export declare function nextTick(fn: Function): void;
export declare function mountNode(dom: vnodeType, selector: HTMLElement, status?: string, name?: string): void;
export declare function setData(callback: Function, options: setDataOptionsType): Promise<void>;
export {};
