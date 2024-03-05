declare const version: string;
declare function setData(callback: () => void, content: any): Promise<void>;
declare function resetView(content: any): void;
declare function defineComponent(options?: any, factory?: any): {
    template: () => any;
};
export { version, resetView, setData, defineComponent };
