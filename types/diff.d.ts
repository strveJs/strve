export interface vnodeType {
    tag: string;
    props: any;
    children: any[];
    el?: HTMLElement;
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
export declare function mount(vnode: vnodeType, container: HTMLElement | Node, anchor?: Node): void;
export declare function onMounted(fn: Function): void;
export declare function onUnmounted(fn: Function): void;
export declare function nextTick(fn: Function): void;
export declare function mountNode(dom: vnodeType, selector?: Node, status?: string, name?: string): void;
export declare function setData(callback: Function, options: setDataOptionsType): Promise<void>;
export declare function defineCustomElement(options: customElementType, tag: string): void;
export {};
