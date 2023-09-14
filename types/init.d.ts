interface StateType {
    _el: HTMLElement | null;
    _template: Function | null;
    oldTree: any | null;
    isMounted: boolean;
}
export declare const version: string;
export declare const state: StateType;
export declare function createApp(template: Function): {
    mount(el: HTMLElement | String): void;
};
export {};
