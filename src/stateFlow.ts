// It is a flexible and powerful JavaScript state management library.

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

export class createStateFlow {
  private _mutations: Mutations;
  private _actions: Actions;
  private _state: State;

  constructor(options: Options) {
    this._mutations = options.mutations;
    this._actions = options.actions;
    this._state = new Proxy(options.state, {
      set: (target: State, key: string, value: any) => {
        if (this._mutations[key]) {
          this._mutations[key](target, value);
        }
        target[key] = value;
        return true;
      },
    });
  }

  commit(mutationName: string, payload?: any) {
    if (this._mutations[mutationName]) {
      this._mutations[mutationName](this._state, payload);
    }
  }

  async dispatch(actionName: string, payload?: any) {
    if (this._actions[actionName]) {
      await this._actions[actionName](this, payload);
    }
  }

  get state() {
    return this._state;
  }
}
