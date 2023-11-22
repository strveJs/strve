import { getType, isComplexType, isUndef, checkSameVnode, isVnode, checkVnode, setStyleProp, addEvent, removeEvent, setAttribute, removeAttribute, createNode, warn, getSequence, } from './utils';
// version
const version = '__VERSION__';
// Private Global Data
let _el = Object.create(null);
let _template = Object.create(null);
let _oldTree = Object.create(null);
// Flag
const flag = ['$ref', '$name', '$define'];
// Component
const _components = new WeakMap();
// domInfo
const domInfo = new WeakMap();
// registerComponent
function registerComponent(name) {
    const obj = Object.create(null);
    if (name) {
        obj.name = name;
        return obj;
    }
    return obj;
}
// Update text node
function updateTextNode(val, el) {
    let _text = '';
    if (Array.isArray(val)) {
        if (val.length > 1) {
            let _texts = [];
            for (let index = 0; index < val.length; index++) {
                const c = val[index];
                _texts.push(isComplexType(c) ? JSON.stringify(c) : c);
            }
            _text = _texts.join('');
        }
        else if (val.length === 0) {
            _text = '';
        }
        else {
            _text = JSON.stringify(val).replace(/,/g, '');
        }
    }
    else if (isComplexType(val)) {
        _text = JSON.stringify(val);
    }
    else {
        _text = val;
    }
    el.textContent = _text;
}
// Convert virtual dom to real dom
function mount(vnode, container, anchor) {
    const { tag, props, children } = vnode;
    // tag
    if (!isUndef(tag)) {
        const el = createNode(tag);
        vnode.el = el;
        // props
        if (!isUndef(props)) {
            addEvent(el, props);
            const keys = Object.keys(props);
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                const propValue = props[key];
                const propValueType = getType(propValue);
                if (propValueType !== 'function' && key !== 'key' && !flag.includes(key)) {
                    setAttribute(el, key, propValue);
                }
                if (key === 'style' && propValueType === 'object') {
                    setStyleProp(el, propValue);
                }
                // domInfo
                if (key === flag[0] && propValueType === 'object') {
                    domInfo.set(propValue, el);
                }
                // components
                if (key === flag[1] && propValueType === 'object') {
                    _components.set(propValue, children);
                }
                // Web Component
                if (key === flag[2] && propValueType === 'array') {
                    const [comName, options] = propValue;
                    if (!customElements.get(comName.name)) {
                        defineCustomElement(propValue);
                    }
                    else {
                        const tem = options.template();
                        _components.set(comName, {
                            template: tem,
                            props: null,
                        });
                    }
                }
            }
        }
        // children
        if (!isUndef(children)) {
            if (!checkVnode(children)) {
                if (el) {
                    updateTextNode(children, el);
                }
            }
            else {
                const childrenType = getType(children);
                if (childrenType === 'array') {
                    for (let index = 0; index < children.length; index++) {
                        const child = children[index];
                        if (isVnode(child)) {
                            mount(child, el);
                        }
                    }
                }
                else if (childrenType === 'object') {
                    mount(children, el);
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
        const newKeys = Object.keys(newProps);
        const oldKeys = Object.keys(oldProps);
        for (let index = 0; index < newKeys.length; index++) {
            const key = newKeys[index];
            const newValue = newProps[key];
            const oldValue = oldProps[key];
            const newPropValueType = getType(newValue);
            if (newValue !== oldValue) {
                if (!isUndef(newValue)) {
                    if (newPropValueType !== 'function' && key !== 'key' && !flag.includes(key)) {
                        setAttribute(el, key, newValue);
                    }
                    if (key === 'style' && newPropValueType === 'object') {
                        setStyleProp(el, newValue);
                    }
                    if (newPropValueType === 'function' && newValue.toString() !== oldValue.toString()) {
                        removeEvent(el, key, oldProps);
                        addEvent(el, newProps);
                    }
                }
                else {
                    removeAttribute(el, key);
                }
            }
        }
        for (let index = 0; index < oldKeys.length; index++) {
            const key = oldKeys[index];
            if (!newKeys.includes(key)) {
                removeAttribute(el, key);
            }
        }
        // children
        const oc = oNode.children;
        const nc = nNode.children;
        if (getType(oc) === 'array' && getType(nc) === 'array') {
            patchKeyChildren(oc, nc, el);
        }
        else if (isVnode(oc) && isVnode(nc)) {
            patch(oc, nc);
        }
        else if (!checkVnode(oc) && !checkVnode(nc) && oc !== nc) {
            updateTextNode(nc, el);
        }
    }
}
// can be all-keyed or mixed
function patchKeyChildren(n1, n2, parentElm) {
    const l2 = n2.length;
    let i = 0;
    let e1 = n1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
        if (checkSameVnode(n1[i], n2[i])) {
            patch(n1[i], n2[i]);
        }
        else {
            break;
        }
        i++;
    }
    while (i <= e1 && i <= e2) {
        if (checkSameVnode(n1[e1], n2[e2])) {
            patch(n1[e1], n2[e2]);
        }
        else {
            break;
        }
        e1--;
        e2--;
    }
    if (i > e1) {
        if (i <= e2) {
            const nextPos = e2 + 1;
            const anchor = nextPos < l2 ? n2[nextPos].el : null;
            while (i <= e2) {
                parentElm.insertBefore(mount(n2[i]), anchor);
                i++;
            }
        }
    }
    else if (i > e2) {
        while (i <= e1) {
            parentElm.removeChild(n1[i].el);
            i++;
        }
    }
    else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = new Map();
        for (i = s2; i <= e2; i++) {
            const nextChild = n2[i];
            if (nextChild.key != null) {
                keyToNewIndexMap.set(nextChild.key, i);
            }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++)
            newIndexToOldIndexMap[i] = 0;
        for (let i = s1; i <= e1; i++) {
            if (patched >= toBePatched) {
                parentElm.removeChild(n1[i].el);
                continue;
            }
            let newIndex;
            if (n1[i].key !== null) {
                newIndex = keyToNewIndexMap.get(n1[i].key);
            }
            else {
                for (j = s2; j <= e2; j++) {
                    if (newIndexToOldIndexMap[j - s2] === 0 && checkSameVnode(n1[i], n2[j])) {
                        newIndex = j;
                        break;
                    }
                }
            }
            if (newIndex === undefined) {
                parentElm.removeChild(n1[i].el);
            }
            else {
                newIndexToOldIndexMap[newIndex - s2] = i + 1;
                if (newIndex > maxIndexSoFar) {
                    maxIndexSoFar = newIndex;
                }
                else {
                    moved = true;
                }
                patch(n1[i], n2[newIndex]);
                patched++;
            }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
        j = increasingNewIndexSequence.length - 1;
        for (let i = toBePatched - 1; i >= 0; i--) {
            const nextIndex = i + s2;
            const anchor = nextIndex + 1 < l2 ? n2[nextIndex + 1].el : null;
            if (newIndexToOldIndexMap[i] === 0) {
                parentElm.insertBefore(mount(n2[nextIndex]), anchor);
            }
            else if (moved) {
                if (j < 0 || i !== increasingNewIndexSequence[j]) {
                    parentElm.insertBefore(n2[nextIndex].el, anchor);
                }
                else {
                    j--;
                }
            }
        }
    }
}
// Web Component
function defineCustomElement(option) {
    const [comName, options] = option;
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
            if (options.template && comName.name) {
                const t = document.createElement('template');
                t.setAttribute('id', comName.name);
                const content = t.content.cloneNode(true);
                if (options.styles && Array.isArray(options.styles)) {
                    const s = document.createElement('style');
                    s.textContent = options.styles.join('');
                    content.appendChild(s);
                }
                this.shadow = this.attachShadow({ mode: 'open' });
                this.shadow.appendChild(content);
                if (!options.attributeChanged) {
                    const tem = options.template();
                    mount(tem, this.shadow);
                    _components.set(comName, {
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
                const tem = options.template(this.props);
                if (!this.isComMounted) {
                    mount(tem, this.shadow);
                    _components.set(comName, {
                        template: tem,
                        props: this.props,
                    });
                    this.comOldTree = tem;
                    this.isComMounted = true;
                }
                else {
                    patch(this.comOldTree, tem);
                    _components.set(comName, {
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
    if (comName.name.indexOf('-') !== -1) {
        customElements.define(comName.name, customElement);
    }
    else {
        warn(`[${comName.name}]>> please name the string with "-" as a custom element.`);
    }
}
// onMounted
let mountHook = [];
function onMounted(fn = null) {
    if (fn === null)
        return;
    if (typeof fn !== 'function') {
        console.warn('The parameter of onMounted is not a function!');
        return;
    }
    mountHook.push(fn);
}
// onUnmounted
let unMountedHook = [];
function onUnmounted(fn = null) {
    if (fn === null)
        return;
    if (typeof fn !== 'function') {
        console.warn('The parameter of onUnmounted is not a function!');
        return;
    }
    unMountedHook.push(fn);
}
const p = getType(Promise) !== 'undefined' && Promise.resolve();
// nextTick
const nextTick = (fn) => p.then(fn);
// Mount node
let _isMounted = false;
function mountNode(dom, selector) {
    if (!_isMounted) {
        mount(dom, selector);
        _oldTree = dom;
        _isMounted = true;
        if (mountHook.length > 0) {
            for (let i = 0, j = mountHook.length; i < j; i++) {
                mountHook[i] && mountHook[i]();
            }
        }
        mountHook = [];
    }
    else {
        const newTree = dom;
        patch(_oldTree, newTree);
        _oldTree = newTree;
    }
}
// Change data
function setData(callback, options) {
    if (typeof callback === 'function' && typeof Promise !== 'undefined') {
        return Promise.resolve()
            .then(() => {
            callback();
        })
            .then(() => {
            if (!options) {
                const tem = _template();
                mountNode(tem, null);
            }
            else {
                const optionsType = getType(options);
                // Component
                if (optionsType === 'array' && typeof options[1] === 'function') {
                    const [name, comFn] = options;
                    const newTree = comFn();
                    const oldTree = _components.get(name);
                    patch(oldTree, newTree);
                    _components.set(name, newTree);
                }
                // Web Component
                else if (optionsType === 'array' && typeof options[1] === 'object') {
                    const [name, comObj] = options;
                    const { template, props } = _components.get(name);
                    const newTree = comObj.template(props);
                    patch(template, newTree);
                    _components.set(name, newTree);
                }
                // Router
                else if (optionsType === 'string' && options === 'useRouter') {
                    if (unMountedHook.length > 0) {
                        for (let i = 0, j = unMountedHook.length; i < j; i++) {
                            unMountedHook[i] && unMountedHook[i]();
                        }
                    }
                    unMountedHook = [];
                    _isMounted = false;
                    _el.innerHTML = '';
                    const tem = _template();
                    mountNode(tem, _el);
                }
            }
        })
            .catch((err) => warn(err));
    }
}
function normalizeContainer(container) {
    if (typeof container === 'string') {
        const res = document.querySelector(container);
        if (!res) {
            let elem = null;
            if (container.startsWith('#')) {
                elem = document.createElement('div');
                elem.setAttribute('id', container.substring(1, container.length));
            }
            else if (container.startsWith('.')) {
                elem = document.createElement('div');
                elem.setAttribute('class', container.substring(1, container.length));
            }
            else {
                warn(`Failed to mount app: mount target selector "${container}" returned null.`);
            }
            document.body.insertAdjacentElement('afterbegin', elem);
            return elem;
        }
        return res;
    }
    else if (container instanceof HTMLElement) {
        return container;
    }
    else if (window.ShadowRoot &&
        container instanceof window.ShadowRoot &&
        container.mode === 'closed') {
        warn('mounting on a ShadowRoot with `{mode: "closed"}` may lead to unpredictable bugs.');
        return null;
    }
    else {
        return null;
    }
}
function createApp(template) {
    const app = {
        mount(el) {
            const mountNodeEl = normalizeContainer(el);
            if (mountNodeEl) {
                const tem = template();
                const temType = getType(tem) === 'array';
                if (temType) {
                    warn('Please provide a root node.');
                }
                else {
                    _template = template;
                    _el = mountNodeEl;
                    mountNode(tem, _el);
                }
            }
            else {
                warn('There must be a mount element node.');
            }
        },
    };
    return app;
}
export { createApp, domInfo, nextTick, onMounted, onUnmounted, setData, version, registerComponent, };
