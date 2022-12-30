import { state } from './init';
import { getType, checkVnode, isComplexType, isXlink, isSameObject, isVnode, xlinkNS, setStyleProp, addEvent, removeEvent, createNode, useFragmentNode, } from './util';
const _com_ = Object.create(null);
const _components = new WeakMap();
const flag = ['$key', '$name', '$props'];
let componentName = '';
export const domInfo = Object.create(null);
export let propsData = reactive(Object.create(null));
function reactive(target = {}) {
    if (typeof target !== 'object' || target === null) {
        return target;
    }
    const proxyConf = {
        get(target, key, receiver) {
            const ownKeys = Reflect.ownKeys(target);
            if (ownKeys.includes(key)) {
                const result = Reflect.get(target, key, receiver);
                return reactive(result);
            }
        },
        set(target, key, val, receiver) {
            if (val === target[key]) {
                return true;
            }
            const ownKeys = Reflect.ownKeys(target);
            if (ownKeys.includes(key) || Object.keys(_com_).includes(key)) {
                const result = Reflect.set(target, key, val, receiver);
                return result;
            }
        },
        deleteProperty(target, key) {
            const result = Reflect.deleteProperty(target, key);
            return result;
        },
    };
    const observed = new Proxy(target, proxyConf);
    return observed;
}
export function mount(vnode, container, anchor) {
    if (vnode.tag) {
        const el = createNode(vnode.tag);
        if (vnode.props) {
            addEvent(el, vnode.props);
            if (vnode.props.hasOwnProperty(flag[0])) {
                vnode.el = el;
                if (getType(vnode.props[flag[0]]) === 'string') {
                    domInfo[vnode.props[flag[0]]] = el;
                }
            }
            if (vnode.props.hasOwnProperty(flag[1])) {
                _com_[vnode.props[flag[1]]] = Object.create(null);
                _components.set(_com_[vnode.props[flag[1]]], vnode.children[0]);
            }
            if (vnode.props.hasOwnProperty(flag[1]) &&
                vnode.props.hasOwnProperty(flag[2])) {
                propsData[vnode.props[flag[1]]] = vnode.props[flag[2]];
            }
            for (const key in vnode.props) {
                if (vnode.props.hasOwnProperty(key)) {
                    if (getType(vnode.props[key]) !== 'function') {
                        if (isXlink(key)) {
                            el.setAttributeNS(xlinkNS, key, vnode.props[key]);
                        }
                        else {
                            if (!flag.includes(key)) {
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
    if (oldProps.hasOwnProperty(flag[0]) && n1.tag !== n2.tag) {
        const parent = n1.el.parentNode;
        const anchor = n1.el.nextSibling;
        parent.removeChild(n1.el);
        mount(n2, parent, anchor);
    }
    else {
        let el = null;
        if (oldProps.hasOwnProperty(flag[0])) {
            const newProps = n2.props || {};
            el = n2.el = n1.el;
            for (const key in newProps) {
                let [newValue, oldValue] = [newProps[key], oldProps[key]];
                if (newValue !== oldValue) {
                    if (newValue !== null) {
                        if (getType(newValue) !== 'function' && !flag.includes(key)) {
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
                el.removeChild(c.el);
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
let mountHook = null;
export function onMounted(fn) {
    mountHook = fn;
}
let unMountedHook = null;
export function onUnmounted(fn) {
    unMountedHook = fn;
}
let nextTickHook = null;
export function nextTick(fn) {
    nextTickHook = fn;
}
export function mountNode(dom, selector, status, name) {
    if (!state.isMounted) {
        const _template = useFragmentNode(dom);
        mount(_template, selector);
        state.oldTree = _template;
        state.isMounted = true;
        mountHook && mountHook();
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
                unMountedHook && unMountedHook();
                state._el.innerHTML = '';
                unMountedHook = null;
                mount((state.oldTree = state._template()), state._el);
                mountHook && mountHook();
            }
            else if (options && options.name === 'useCustomElement') {
                const oldTree = _components.get(_com_[options.customElement.id]).template;
                const props = _components.get(_com_[options.customElement.id]).props;
                const newTree = useFragmentNode(options.customElement.template(props));
                patch(oldTree, newTree, options.status);
            }
            else if (options && typeof options.name === 'function') {
                const name = options.name.name;
                const _component = options.name();
                if (componentName !== name) {
                    componentName = name;
                    state.oldTree = useFragmentNode(_components.get(_com_[name]));
                }
                mountNode(_component, null, options.status, name);
            }
            else {
                const status = options && options.status ? options.status : null;
                mountNode(state._template(), null, status);
            }
            nextTickHook && nextTickHook();
        })
            .catch((err) => console.error(err));
    }
}
export function defineCustomElement(options, tag) {
    class customElement extends HTMLElement {
        shadow;
        props;
        isComMounted;
        comOldTree;
        static get observedAttributes() {
            if (options.attributeChanged && options.attributeChanged.length > 0) {
                return options.attributeChanged;
            }
        }
        constructor() {
            super();
            this.shadow = null;
            this.props = Object.create(null);
            this.isComMounted = false;
            this.comOldTree = Object.create(null);
            if (options.template && options.id) {
                const t = document.createElement('template');
                t.setAttribute('id', options.id);
                const content = t.content.cloneNode(true);
                if (options.styles && Array.isArray(options.styles)) {
                    const s = document.createElement('style');
                    s.textContent = options.styles.join('');
                    content.appendChild(s);
                }
                this.shadow = this.attachShadow({ mode: 'open' });
                this.shadow.appendChild(content);
                if (!options.attributeChanged) {
                    const tem = useFragmentNode(options.template());
                    mount(tem, this.shadow);
                    _com_[options.id] = Object.create(null);
                    _components.set(_com_[options.id], {
                        template: tem,
                        props: null,
                    });
                }
            }
        }
        // Called when the custom element is first connected to the document DOM.
        connectedCallback() {
            const arg = arguments;
            options.lifetimes &&
                typeof options.lifetimes.connectedCallback === 'function' &&
                options.lifetimes.connectedCallback(arg);
        }
        // Called when a custom element is disconnected from the document DOM.
        disconnectedCallback() {
            const arg = arguments;
            options.lifetimes &&
                typeof options.lifetimes.disconnectedCallback === 'function' &&
                options.lifetimes.disconnectedCallback(arg);
        }
        // Called when a custom element is moved to a new document.
        adoptedCallback() {
            const arg = arguments;
            options.lifetimes &&
                typeof options.lifetimes.adoptedCallback === 'function' &&
                options.lifetimes.adoptedCallback(arg);
        }
        // Called when an attribute of a custom element is added, removed, or changed.
        attributeChangedCallback() {
            const arg = arguments;
            if (options.attributeChanged && options.attributeChanged.length > 0) {
                this.props[arg[0]] = arg[2];
                const tem = useFragmentNode(options.template(this.props));
                if (!this.isComMounted) {
                    mount(tem, this.shadow);
                    _com_[options.id] = Object.create(null);
                    _components.set(_com_[options.id], {
                        template: tem,
                        props: this.props,
                    });
                    this.comOldTree = tem;
                    this.isComMounted = true;
                }
                else {
                    patch(this.comOldTree, tem);
                    _components.set(_com_[options.id], {
                        template: tem,
                        props: this.props,
                    });
                    this.comOldTree = tem;
                }
            }
            if (options.immediateProps) {
                options.lifetimes &&
                    typeof options.lifetimes.attributeChangedCallback === 'function' &&
                    options.lifetimes.attributeChangedCallback(arg);
            }
        }
    }
    if (typeof tag === 'string' && tag.indexOf('-') !== -1) {
        customElements.define(tag, customElement);
    }
    else {
        console.warn(`[Strve warn]: [${tag}]>> please name the string with "-" as a custom element. `);
    }
}
