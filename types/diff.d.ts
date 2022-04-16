export interface setDataOptionsType {
    status: string;
    name: Function;
}
export interface vnodeType {
    tag: string;
    props: any;
    children: any[];
    el?: HTMLElement;
}
export declare function mountNode(dom: vnodeType, selector: HTMLElement, status?: string, name?: string): void;
export declare function setData(callback: Function, options: setDataOptionsType): Promise<void>;
