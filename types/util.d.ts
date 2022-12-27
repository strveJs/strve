import { vnodeType } from './diff';
interface HTMLElementElType {
    [style: string]: any;
}
export declare function isXlink(name: string): boolean;
export declare function isComplexType(v: any): boolean;
export declare function getType(v: any): string;
export declare const isToTextType: (val: string) => boolean;
export declare function isVnode(vnodes: vnodeType): boolean;
export declare function checkVnode(vnodes: any): boolean;
export declare function isSameObject(obj1: any, obj2: any): boolean;
export declare const xlinkNS: string;
export declare function setStyleProp(el: HTMLElementElType, prototype: any): void;
export declare function addEvent(el: HTMLElement, props: any): void;
export declare function removeEvent(el: HTMLElement, key: string, oldProps: any): void;
export declare function createNode(tag: string): Element | DocumentFragment | Comment;
export declare function useFragmentNode(dom: vnodeType): vnodeType;
export {};
