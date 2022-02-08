// version:2.3.1

import {
    mountNode
} from './diff.js';

const state = {
    _el: null,
    _data: null,
    _template: null,
    oldTree: null,
    isMounted: false,
};

const strveVersion = '2.3.1';

function Strve(el, v) {
    if (el) {
        [state._el, state._data, state._template] = [el, v.data, v.template];
        const template = v.template();
        if (!template[0]) {
            mountNode(template, el);
        } else {
            console.error('[Strve warn]: Check that the view has only one root element, or that other elements are written correctly.');
        }
    } else {
        console.error('[Strve warn]: There must be a mount element node.');
    }
}

export {
    state,
    strveVersion,
    Strve
}