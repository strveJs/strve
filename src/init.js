import state from './state.js'
import mountNode from './diff.js'

function Strve(el, v) {
    state._data = v.data;
    state._template = v.template;
    state._el = el;

    if (el) {
        if (v.template.type) {
            mountNode(v.template, el);
        } else {
            throw Error("[Strve warn]:Multiple root nodes returned from render function. Render function should return a single root node.");
        }
    } else {
        throw Error("[Strve warn]:Please set el property!")
    }
}

export { Strve }