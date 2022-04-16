import { vnodeType } from './diff';
export interface namespaceMapType {
    [key: string]: string;
}
export interface HTMLElementElType {
    [style: string]: any;
}
export interface fragmentType {
    tag: string;
    props: null;
    children: any;
}
export declare function isXlink(name: string): boolean;
export declare function isComplexType(v: any): boolean;
export declare function getType(v: any): string;
export declare const isToTextType: (val: any) => any;
export declare function isVnode(vnodes: vnodeType): boolean;
export declare function isHasFlag(props: object, flag: string): boolean;
export declare function checkVnode(vnodes: any): boolean;
export declare function isSameObject(obj1: any, obj2: any): boolean;
export declare const xlinkNS = "http://www.w3.org/1999/xlink";
export declare function setStyleProp(el: HTMLElementElType, prototype: any): void;
export declare function addEvent(el: HTMLElement, props: any): void;
export declare function removeEvent(el: HTMLElement, key: string, oldProps: any): void;
export declare function createNode(tag: string): Element | DocumentFragment | Comment;
export declare function useFragmentNode(dom: vnodeType): fragmentType | vnodeType;
/**
 * API
 */
export declare function emit(eventName: string, data: object, el: string): void;
export declare function watchDom(el: string, config: object, fn: MutationCallback): {
    start(): void;
    stop(): void;
};
export declare function clone(obj: any, hash?: WeakMap<object, any>): any;
