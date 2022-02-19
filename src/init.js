// version:2.3.2

import {
    mountNode
} from './diff.js';

const strveVersion = '2.3.2';

const state = {
    _el: null,
    _template: null,
    kTemplate: null,
    oldTree: null,
    isMounted: false,
    observer: null
};

// Before using this API, confirm whether the browser is compatible
function watchDOMChange(el, config, fn) {
    if (el) {
        const elNode = document.querySelector(el);
        if (state.observer === null) {
            state.observer = new MutationObserver(fn);
        }
        return {
            start() {
                state.observer.observe(elNode, config);
            },
            stop() {
                let records = state.observer.takeRecords();
                state.observer.disconnect();
                if (getType(records) === 'array' && records.length === 0) {
                    state.observer = null;
                }
            }
        }
    } else {
        console.error('[Strve warn]: Please check whether the element exists or need to put watchDOMChange on the mount node.')
    }
}

function getType(v) {
    return Object.prototype.toString.call(v).match(/\[object (.+?)\]/)[1].toLowerCase()
}

// Object and array is not supported,But you can use JSON.stringify() to convert it to string type
const isToTextType = makeMap('function,regexp,date,math,undefined,null,boolean,string,number,symbol,bigInt');

function makeMap(str) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return function (val) {
        return map[val]
    }
}

function isVnode(vnodes) {
    if (vnodes.hasOwnProperty('tag') && vnodes.hasOwnProperty('props') && vnodes.hasOwnProperty('children')) {
        return true
    }
}

function checkVnode(vnodes) {
    if (getType(vnodes) === 'array') {
        for (let index = 0; index < vnodes.length; index++) {
            if (isVnode(vnodes[index])) {
                return true
            }
        }
    } else if (getType(vnodes) === 'object') {
        return isVnode(vnodes)
    }
}

function useOtherNode(template) {
    for (let index = 0; index < template.length; index++) {
        const element = template[index];

        if (getType(element) === 'array') {
            useOtherNode(element);
        }

        if (element === '') {
            template.splice(index, 1, {
                tag: 'comment',
                children: [],
                props: null
            })
        } else if (isToTextType(getType(element))) {
            template.splice(index, 1, {
                tag: 'textnode',
                children: [element],
                props: null
            })
        } else if (element.children && checkVnode(element.children)) {
            useOtherNode(element.children);
        }

    }
    return template
}

function useTemplate(template) {
    if (getType(template) === 'array') {
        return useOtherNode(template)
    } else if (checkVnode(template) && getType(template) === 'object') {
        template.children = useOtherNode(template.children);
        return template
    } else {
        return {
            tag: 'textnode',
            children: [template],
            props: null
        }
    }
}

function Strve(el, v) {
    if (el) {
        [state._el, state._template] = [el, v.template];
        const template = useTemplate(v.template());
        mountNode(template, el);
    } else {
        console.error('[Strve warn]: There must be a mount element node.');
    }
}

export {
    watchDOMChange,
    makeMap,
    checkVnode,
    useTemplate,
    state,
    getType,
    strveVersion,
    Strve
}