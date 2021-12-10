import { mountNode } from './diff.js';

const state = {
    _el: null,
    _data: null,
    _template: null,
    oldTree: null,
    isMounted: false,
};

function Strve(el, v) {
    [state._el, state._data, state._template] = [el, v.data, v.template];
    mountNode(v.template(), el);
}

export {
    state,
    Strve
}