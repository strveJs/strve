// Version:3.0.0
import { state, useTemplate } from './init.js';
import { getType, checkVnode, isHasFlag, isComplexType, isXlink, isSameObject, isVnode, xlinkNS, setStyleProp, addEvent, removeEvent, createNode, useFragmentNode, } from './util.js';
const _com_ = Object.create(null);
const _components = new WeakMap();
const flag = ['$key', '$name'];
let componentName = '';
function mount(vnode, container, anchor) {
    if (vnode.tag) {
        const el = createNode(vnode.tag);
        if (vnode.props) {
            addEvent(el, vnode.props);
            if (isHasFlag(vnode.props, flag[0])) {
                vnode.el = el;
            }
            if (vnode.props[flag[1]]) {
                _com_[vnode.props[flag[1]]] = Object.create(null);
                _components.set(_com_[vnode.props[flag[1]]], vnode.children[0]);
            }
            for (const key in vnode.props) {
                if (vnode.props.hasOwnProperty(key)) {
                    if (getType(vnode.props[key]) !== 'function') {
                        if (isXlink(key)) {
                            el.setAttributeNS(xlinkNS, key, vnode.props[key]);
                        }
                        else {
                            if (key !== flag[0] && key !== flag[1]) {
                                el.setAttribute(key, vnode.props[key]);
                            }
                        }
                    }
                    if (getType(vnode.props[key]) === 'object') {
                        setStyleProp(el, vnode.props[key]);
                    }
                }
            }
        }
        if (vnode.children) {
            updateChildrenNode(vnode.children, el, mountChildren);
            function mountChildren() {
                if (getType(vnode.children[0]) === 'array') {
                    vnode.children[0].forEach((child) => {
                        if (isVnode(child)) {
                            mount(child, el);
                        }
                    });
                }
                else {
                    if (getType(vnode.children) === 'array') {
                        vnode.children.forEach((child) => {
                            if (isVnode(child)) {
                                mount(child, el);
                            }
                        });
                    }
                }
            }
        }
        if (anchor) {
            container.insertBefore(el, anchor);
        }
        else {
            container.appendChild(el);
        }
    }
}
function patch(n1, n2, status) {
    const oldProps = n1.props || {};
    if (isHasFlag(oldProps, flag[0]) && n1.tag !== n2.tag) {
        const parent = n1.el.parentNode;
        const anchor = n1.el.nextSibling;
        if (parent) {
            parent.removeChild(n1.el);
            anchor && mount(n2, parent, anchor);
        }
    }
    else {
        let el = null;
        if (isHasFlag(oldProps, flag[0])) {
            const newProps = n2.props || {};
            el = n2.el = n1.el;
            for (const key in newProps) {
                let [newValue, oldValue] = [newProps[key], oldProps[key]];
                if (newValue !== oldValue) {
                    if (newValue !== null) {
                        if (getType(newValue) !== 'function' && key !== flag[0]) {
                            el[key] && (el[key] = newValue); // property
                            if (isXlink(key)) {
                                el.setAttributeNS(xlinkNS, key, newValue);
                            }
                            else {
                                el.setAttribute(key, newValue);
                            }
                            if (getType(newValue) === 'object') {
                                setStyleProp(el, newValue);
                            }
                        }
                        else {
                            if (key.startsWith('on')) {
                                const name = key.split('on')[1][0].toLowerCase() +
                                    key.split('on')[1].substring(1);
                                el.addEventListener(name, newValue, false);
                            }
                        }
                    }
                    else {
                        removeEvent(el, key, oldProps);
                    }
                }
            }
            for (const key in oldProps) {
                if (!(key in newProps)) {
                    removeEvent(el, key, oldProps);
                }
            }
        }
        const oc = n1.children[0];
        const nc = n2.children[0];
        const ocs = n1.children;
        const ncs = n2.children;
        if (!isSameObject(ocs, ncs)) {
            updateChildrenNode(ncs, el, patchChildren);
            function patchChildren() {
                if (getType(oc) !== 'array' && getType(nc) === 'array') {
                    el.innerHTML = '';
                    nc.forEach((c) => mount(c, el));
                }
                else if (getType(oc) === 'array' && getType(nc) === 'array') {
                    patchNode(oc, nc, el, status);
                }
                else {
                    patchNode(ocs, ncs, el, status);
                }
            }
        }
    }
}
function patchNode(o, n, el, status) {
    if (status === 'useFirstKey') {
        for (let i = 1; i <= Math.max(o.length, n.length); i++) {
            if (!o[o.length - i]) {
                mount(n[n.length - i], o[o.length - 1].el.parentNode, o[0].el);
            }
            else if (!n[n.length - i]) {
                el.removeChild(o[o.length - i].el);
            }
            else {
                patch(o[o.length - i], n[n.length - i], status);
            }
        }
    }
    else {
        for (let i = 0; i < Math.min(o.length, n.length); i++) {
            patch(o[i], n[i], status);
        }
        if (n.length > o.length) {
            n.slice(o.length).forEach((c) => mount(c, el));
        }
        else if (o.length > n.length) {
            o.slice(n.length).forEach((c) => {
                c.el && el.removeChild(c.el);
            });
        }
    }
}
function updateChildrenNode(childNode, el, setChildrenNode) {
    if (childNode.length === 1 && !isComplexType(childNode[0])) {
        el && updateTextNode(childNode, el);
    }
    else if (childNode.length > 1 && !checkVnode(childNode)) {
        el && updateTextNode(childNode.join().replace(/,/g, ''), el);
    }
    else if (isComplexType(childNode[0]) &&
        !childNode[0].tag &&
        !checkVnode(childNode[0])) {
        el && updateTextNode(childNode[0], el);
    }
    else {
        setChildrenNode();
    }
}
function updateTextNode(val, el) {
    if (isComplexType(val)) {
        if (getType(val) === 'function' ||
            getType(val) === 'regexp' ||
            getType(val) === 'array') {
            el.textContent = String(val);
        }
        else {
            el.textContent = JSON.stringify(val, null, 2);
        }
    }
    else {
        el.textContent = val ? val.toString() : String(val);
    }
}
export function mountNode(dom, selector, status, name) {
    if (!state.isMounted) {
        const _template = useFragmentNode(dom);
        mount(_template, selector);
        state.oldTree = _template;
        state.isMounted = true;
    }
    else {
        const newTree = useFragmentNode(dom);
        patch(state.oldTree, newTree, status);
        state.oldTree = newTree;
        if (name) {
            _components.set(_com_[name], dom);
        }
    }
}
export function setData(callback, options) {
    if (getType(callback) === 'function' && getType(Promise) !== 'undefined') {
        return Promise.resolve()
            .then(() => {
            callback();
        })
            .then(() => {
            if (options && options.status === 'useRouter') {
                state._el.innerHTML = '';
                mount((state.oldTree = useTemplate(state._template())), state._el);
            }
            else if (options && typeof options.name === 'function') {
                const name = options.name.name;
                const _component = options.name();
                if (componentName !== name) {
                    componentName = name;
                    state.oldTree = useFragmentNode(_components.get(_com_[name]));
                }
                mountNode(_component, state._el, options.status, name);
            }
            else {
                const status = options && options.status ? options.status : null;
                mountNode(useTemplate(state._template()), state._el, status);
            }
        })
            .catch((err) => console.error(err));
    }
}
