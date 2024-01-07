declare const version: string;
declare const domInfo: WeakMap<object, any>;
declare function setData(callback: () => void, content: any): Promise<void>;
declare function resetView(content: any): void;
declare function defineComponent(options: any, factory: any): {
    template: () => any;
};
export { domInfo, version, resetView, setData, defineComponent };
