export interface vnodeType {
    tag: string;
    props: any;
    children: any;
    el: any;
    key: any;
}
interface lifetimesType {
    connectedCallback: Function;
    disconnectedCallback: Function;
    adoptedCallback: Function;
    attributeChangedCallback: Function;
}
interface customElementType {
    id: string;
    template: Function;
    styles: Array<string>;
    immediateProps: Boolean;
    attributeChanged: Array<string>;
    lifetimes: lifetimesType;
}
interface setDataOptionsType {
    status: string;
    name: Function | string;
    customElement: customElementType;
}
export declare const domInfo: any;
export declare let propsData: any;
export declare function mount(vnode: vnodeType, container?: any, anchor?: any): any;
export declare function onMounted(fn?: Function | null): void;
export declare function onUnmounted(fn?: Function | null): void;
export declare const nextTick: (fn: () => void) => Promise<void>;
export declare function mountNode(dom: vnodeType, selector?: HTMLElement, name?: string): void;
export declare function setData(callback: Function, options: setDataOptionsType): Promise<void>;
export declare function defineCustomElement(options: customElementType, tag: string): void;
export {};
