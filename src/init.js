// version:2.2.0

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

const strveVersion = '2.2.0';

function Strve(el, v) {
    if (el) {
        [state._el, state._data, state._template] = [el, v.data, v.template];
        const template = v.template();
        if (!template[0]) {
            mountNode(template, el);
        } else {
            console.error('[Strve warn]: Please check whether the' + ' ' + template[0] + ' ' + 'element is correct or other elements are correct.');
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