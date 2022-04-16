export declare const version: string;
interface StateType {
    _el: HTMLElement | null;
    _template: Function | null;
    oldTree: any | null;
    isMounted: boolean;
    observer: MutationObserver | null;
}
export declare const state: StateType;
export declare function useTemplate(template: any): any;
export declare function createApp(template: Function): {
    mount(el: HTMLElement | String): void;
};
export {};
