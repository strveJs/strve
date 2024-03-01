declare function getType(v: any): string;
declare function isComplexType(v: any): boolean;
declare function isUndef(v: any): boolean;
export interface vnodeType {
    tag: string;
    props: any;
    children: any;
    el: any;
    key: any;
}
declare function checkSameVnode(o: vnodeType, n: vnodeType): boolean;
declare function notTagComponent(oNode: vnodeType, nNode: vnodeType): boolean;
declare function isVnode(vnode: vnodeType): boolean;
declare function checkVnode(vnodes: Array<vnodeType> | vnodeType): boolean;
declare function warn(msg: string): void;
declare function setStyleProp(el: HTMLElement, prototype: {
    [key: string]: string;
}): void;
declare function addEventListener(el: HTMLElement, name: string, listener: EventListenerOrEventListenerObject): void;
declare function removeEventListener(el: HTMLElement, name: string, listener: EventListenerOrEventListenerObject): void;
declare function setAttribute(el: HTMLElement, key: string, value: string | boolean): void;
declare function removeAttribute(el: HTMLElement, key: string): void;
declare function createNode(tag: string): Element | DocumentFragment | Comment | null;
declare function getSequence(arr: number[]): number[];
export { getType, isComplexType, isUndef, checkSameVnode, isVnode, checkVnode, setStyleProp, setAttribute, removeAttribute, createNode, warn, getSequence, notTagComponent, addEventListener, removeEventListener, };
