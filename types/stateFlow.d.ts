interface State {
    [key: string]: any;
}
interface Mutations {
    [key: string]: (state: State, payload?: any) => void;
}
interface Actions {
    [key: string]: (context: createStateFlow, payload?: any) => Promise<void>;
}
interface Options {
    state: State;
    mutations: Mutations;
    actions: Actions;
}
export declare class createStateFlow {
    private _mutations;
    private _actions;
    private _state;
    constructor(options: Options);
    commit(mutationName: string, payload?: any): void;
    dispatch(actionName: string, payload?: any): Promise<void>;
    get state(): State;
}
export {};
