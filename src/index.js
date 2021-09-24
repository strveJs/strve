import state from './state.js'
import mountNode from './diff.js'

function createView(v) {
    state._data = v.data;
    state._template = v.template;
    state._el = v.el;
    v.el ? mountNode(v.template, v.el) : console.error("Error: Please set el property!");
}

export { template } from './vnode.js'
export { eventListener } from './eventListener.js'
export { reactive, ref } from './reactivety.js'
export { createView }
