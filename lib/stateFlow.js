// It is a flexible and powerful JavaScript state management library.
export class createStateFlow {
    _mutations;
    _actions;
    _state;
    constructor(options) {
        this._mutations = options.mutations;
        this._actions = options.actions;
        this._state = new Proxy(options.state, {
            set: (target, key, value) => {
                if (this._mutations[key]) {
                    this._mutations[key](target, value);
                }
                target[key] = value;
                return true;
            },
        });
    }
    commit(mutationName, payload) {
        if (this._mutations[mutationName]) {
            this._mutations[mutationName](this._state, payload);
        }
    }
    async dispatch(actionName, payload) {
        if (this._actions[actionName]) {
            await this._actions[actionName](this, payload);
        }
    }
    get state() {
        return this._state;
    }
}
