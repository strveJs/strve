import { state } from "./init";
import { getType, checkVnode, isComplexType, isXlink, isSameObject, isVnode, createNode, xlinkNS, setStyleProp, addEvent, removeEvent, isUndef, checkSameVnode, } from "./util";
const flag = ["$ref", "$name", "$props"];
const _com_ = Object.create(null);
const _components = new WeakMap();
let componentName = "";
let mountHook = [];
let unMountedHook = [];
// domInfo
export const domInfo = Object.create(null);
// propsData
export let propsData = reactive(Object.create(null));
// Responsive object handling
function reactive(target = {}) {
    if (typeof target !== "object" || target === null) {
        return target;
    }
    const proxyConf = {
        get(target, key, receiver) {
            const ownKeys = Reflect.ownKeys(target);
            if (ownKeys.includes(key)) {
                const result = Reflect.get(target, key, receiver);
                return reactive(result);
            }
            else if (typeof key === "symbol") {
                // Handle symbol keys
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
            else if (typeof key === "symbol") {
                // Handle symbol keys
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
// Update text node
function updateTextNode(val, el) {
    if (isComplexType(val)) {
        if (getType(val) === "array") {
            if (val.length > 1) {
                let _text = "";
                for (let index = 0; index < val.length; index++) {
                    const c = val[index];
                    _text += isComplexType(c) ? JSON.stringify(c) : c;
                }
                el.textContent = _text;
            }
            else if (val.length === 0) {
                el.textContent = "";
            }
            else {
                const _text = JSON.stringify(val).replace(/,/g, "");
                el.textContent = _text;
            }
        }
        else {
            el.textContent = JSON.stringify(val);
        }
    }
    else {
        el.textContent = val.toString();
    }
}
// Convert virtual dom to real dom
export function mount(vnode, container, anchor) {
    // tag
    if (!isUndef(vnode.tag)) {
        const el = createNode(vnode.tag);
        vnode.el = el;
        // props
        if (!isUndef(vnode.props)) {
            addEvent(el, vnode.props);
            // domInfo
            if (vnode.props.hasOwnProperty(flag[0]) &&
                getType(vnode.props[flag[0]]) === "string") {
                domInfo[vnode.props[flag[0]]] = el;
            }
            // components
            if (vnode.props.hasOwnProperty(flag[1])) {
                _com_[vnode.props[flag[1]]] = Object.create(null);
                _components.set(_com_[vnode.props[flag[1]]], vnode.children);
            }
            // propsData
            if (vnode.props.hasOwnProperty(flag[1]) &&
                vnode.props.hasOwnProperty(flag[2])) {
                propsData[vnode.props[flag[1]]] = vnode.props[flag[2]];
            }
            // props
            for (const key in vnode.props) {
                if (vnode.props.hasOwnProperty(key)) {
                    if (getType(vnode.props[key]) !== "function") {
                        if (isXlink(key)) {
                            el.setAttributeNS(xlinkNS, key, vnode.props[key]);
                        }
                        else {
                            if (!flag.includes(key)) {
                                el.setAttribute(key, vnode.props[key]);
                            }
                        }
                    }
                    if (getType(vnode.props[key]) === "object") {
                        setStyleProp(el, vnode.props[key]);
                    }
                }
            }
        }
        // children
        if (!isUndef(vnode.children)) {
            const childNode = vnode.children;
            if (!checkVnode(childNode)) {
                el && updateTextNode(childNode, el);
            }
            else {
                if (getType(childNode) === "array") {
                    for (let index = 0; index < childNode.length; index++) {
                        const child = childNode[index];
                        if (isVnode(child)) {
                            mount(child, el);
                        }
                    }
                }
                else if (getType(childNode) === "object") {
                    mount(childNode, el);
                }
            }
        }
        if (anchor) {
            container.insertBefore(el, anchor);
        }
        else if (container) {
            container.appendChild(el);
        }
        else {
            return el;
        }
    }
}
// diff
function patch(oNode, nNode) {
    if (!checkSameVnode(oNode, nNode)) {
        const parent = oNode.el.parentNode;
        const anchor = oNode.el.nextSibling;
        parent.removeChild(oNode.el);
        mount(nNode, parent, anchor);
    }
    else {
        const el = (nNode.el = oNode.el);
        // props
        const oldProps = oNode.props || {};
        const newProps = nNode.props || {};
        for (const key in newProps) {
            const newValue = newProps[key];
            const oldValue = oldProps[key];
            if (newValue !== oldValue) {
                if (newValue !== null) {
                    if (getType(newValue) !== "function") {
                        el[key] && (el[key] = newValue); // property
                        if (isXlink(key)) {
                            el.setAttributeNS(xlinkNS, key, newValue);
                        }
                        else {
                            el.setAttribute(key, newValue);
                        }
                        if (getType(newValue) === "object") {
                            setStyleProp(el, newValue);
                        }
                    }
                    else {
                        removeEvent(el, key, oldProps);
                        addEvent(el, newProps);
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
        // children
        const ocs = oNode.children;
        const ncs = nNode.children;
        if (!checkVnode(ocs) && !checkVnode(ncs) && !isSameObject(ocs, ncs)) {
            el && updateTextNode(ncs, el);
        }
        else if (isVnode(ocs) && isVnode(ncs)) {
            patch(ocs, ncs);
        }
        else if (getType(ocs) === "array" && getType(ncs) === "array") {
            updateChildren(ocs, ncs, el);
        }
    }
}
// Two-ended algorithm
function updateChildren(oldCh, newCh, parentElm) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let newEndIdx = newCh.length - 1;
    let oldStartVnode = oldCh[0];
    let newStartVnode = newCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndVnode = newCh[newEndIdx];
    let keyMap = {};
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx];
        }
        else if (isUndef(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (checkSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (checkSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (checkSameVnode(oldStartVnode, newEndVnode)) {
            parentElm.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
            patch(oldStartVnode, newEndVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (checkSameVnode(oldEndVnode, newStartVnode)) {
            parentElm.insertBefore(oldEndVnode.el, oldStartVnode.el);
            patch(oldEndVnode, newStartVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            if (!keyMap) {
                keyMap = {};
                for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                    keyMap[oldCh[i].key] = i;
                }
            }
            const idxInOld = keyMap[newStartVnode.key];
            if (isUndef(idxInOld)) {
                parentElm.insertBefore(mount(newStartVnode), oldStartVnode.el);
            }
            else {
                const oldVnode = oldCh[idxInOld];
                parentElm.insertBefore(oldVnode.el, oldStartVnode.el);
                patch(oldVnode, newStartVnode);
                oldCh[idxInOld] = undefined;
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }
    if (newStartIdx <= newEndIdx) {
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            const before = newCh[newEndIdx + 1]?.el || null;
            parentElm.insertBefore(mount(newCh[i]), before);
        }
    }
    else if (oldStartIdx <= oldEndIdx) {
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            parentElm.removeChild(oldCh[i].el);
        }
    }
}
// onMounted
export function onMounted(fn = null) {
    if (fn === null)
        return;
    if (typeof fn !== "function") {
        console.error(`[Strve warn]: The parameter of onMounted is not a function!`);
        return;
    }
    mountHook.push(fn);
}
// onUnmounted
export function onUnmounted(fn = null) {
    if (fn === null)
        return;
    if (typeof fn !== "function") {
        console.error(`[Strve warn]: The parameter of onUnmounted is not a function!`);
        return;
    }
    unMountedHook.push(fn);
}
// nextTick
const p = getType(Promise) !== "undefined" && Promise.resolve();
export const nextTick = (fn) => p.then(fn);
// Mount node
export function mountNode(dom, selector, name) {
    if (!state.isMounted) {
        mount(dom, selector);
        state.oldTree = dom;
        state.isMounted = true;
        if (mountHook.length > 0) {
            for (let i = 0, j = mountHook.length; i < j; i++) {
                mountHook[i] && mountHook[i]();
            }
        }
        mountHook = [];
    }
    else {
        const newTree = dom;
        patch(state.oldTree, newTree);
        state.oldTree = newTree;
        if (name) {
            _components.set(_com_[name], dom);
        }
    }
}
// Change data
export function setData(callback, options) {
    if (getType(callback) === "function" && getType(Promise) !== "undefined") {
        return Promise.resolve()
            .then(() => {
            callback();
        })
            .then(() => {
            // Router
            if (options && options.status === "useRouter") {
                if (unMountedHook.length > 0) {
                    for (let i = 0, j = unMountedHook.length; i < j; i++) {
                        unMountedHook[i] && unMountedHook[i]();
                    }
                }
                unMountedHook = [];
                state.isMounted = false;
                state._el.innerHTML = "";
                const tem = state._template();
                mountNode(tem, state._el);
            }
            // Web Component
            else if (options && options.name === "useCustomElement") {
                const oldTree = _components.get(_com_[options.customElement.id]).template;
                const props = _components.get(_com_[options.customElement.id]).props;
                const newTree = options.customElement.template(props);
                patch(oldTree, newTree);
            }
            // component
            else if (options && typeof options.name === "function") {
                const name = options.name.name;
                const _component = options.name();
                if (componentName !== name) {
                    componentName = name;
                    state.oldTree = _components.get(_com_[name]);
                }
                mountNode(_component, null, name);
            }
            else {
                mountNode(state._template(), null);
            }
        })
            .catch((err) => console.error(err));
    }
}
// Web Component
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
                const t = document.createElement("template");
                t.setAttribute("id", options.id);
                const content = t.content.cloneNode(true);
                if (options.styles && Array.isArray(options.styles)) {
                    const s = document.createElement("style");
                    s.textContent = options.styles.join("");
                    content.appendChild(s);
                }
                this.shadow = this.attachShadow({ mode: "open" });
                this.shadow.appendChild(content);
                if (!options.attributeChanged) {
                    const tem = options.template();
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
                typeof options.lifetimes.connectedCallback === "function" &&
                options.lifetimes.connectedCallback(arg);
        }
        // Called when a custom element is disconnected from the document DOM.
        disconnectedCallback() {
            const arg = arguments;
            options.lifetimes &&
                typeof options.lifetimes.disconnectedCallback === "function" &&
                options.lifetimes.disconnectedCallback(arg);
        }
        // Called when a custom element is moved to a new document.
        adoptedCallback() {
            const arg = arguments;
            options.lifetimes &&
                typeof options.lifetimes.adoptedCallback === "function" &&
                options.lifetimes.adoptedCallback(arg);
        }
        // Called when an attribute of a custom element is added, removed, or changed.
        attributeChangedCallback() {
            const arg = arguments;
            if (options.attributeChanged && options.attributeChanged.length > 0) {
                this.props[arg[0]] = arg[2];
                const tem = options.template(this.props);
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
                    typeof options.lifetimes.attributeChangedCallback === "function" &&
                    options.lifetimes.attributeChangedCallback(arg);
            }
        }
    }
    if (typeof tag === "string" && tag.indexOf("-") !== -1) {
        customElements.define(tag, customElement);
    }
    else {
        console.error(`[Strve warn]: [${tag}]>> please name the string with "-" as a custom element. `);
    }
}
