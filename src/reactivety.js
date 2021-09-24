import state from './state.js'
import mountNode from './diff.js'

function ref() {
    return new Proxy(state._data, {
        get: (target, key) => {
            return target[key]
        },
        set: (target, key, newValue) => {
            console.log(newValue);
            target[key] = newValue;
            mountNode(state._template, state._el);
            return true;
        }
    })
}

const reactiveHandlers = {
    get: (target, key) => {
        if (typeof target[key] === 'object' && target[key] !== null) {
            return new Proxy(target[key], reactiveHandlers);
        }
        return Reflect.get(target, key);
    },
    set: (target, key, value) => {
        Reflect.set(target, key, value);
        mountNode(state._template, state._el);
        return true
    }
};

function reactive() {
    return new Proxy(state._data, reactiveHandlers)
}

export {
    ref,
    reactive
}