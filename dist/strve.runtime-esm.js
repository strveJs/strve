/*!
 * Strve.js v6.0.2
 * (c) 2021-2023 maomincoding
 * Released under the MIT License.
 */
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer," +
    "header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption," +
    "figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code," +
    "data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup," +
    "time,u,var,wbr,area,audio,map,track,video,embed,object,param,source," +
    "canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td," +
    "th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup," +
    "option,output,progress,select,textarea,details,dialog,menu," +
    "summary,template,blockquote,iframe,tfoot";
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const SVG_TAGS = "svg,animate,circle,clippath,cursor,image,defs,desc,ellipse,filter,font-face" +
    "foreignobject,g,glyph,line,marker,mask,missing-glyph,path,pattern," +
    "polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view," +
    "feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feFlood,feGaussianBlur," +
    "feImage,feMerge,feMorphology,feOffset,feSpecularLighting,feTile,feTurbulence,feDistantLight,fePointLight,feSpotLight," +
    "linearGradient,stop,radialGradient," +
    "animateTransform,animateMotion";
const isHTMLTag = /*#__PURE__*/ makeMap(HTML_TAGS);
const isSVG = /*#__PURE__*/ makeMap(SVG_TAGS);
function isXlink(name) {
    return name.charAt(5) === ":" && name.slice(0, 5) === "xlink";
}
function makeMap(str) {
    const map = Object.create(null);
    const list = str.split(",");
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return function (val) {
        return map[val];
    };
}
function isComplexType(v) {
    const typeData = ["object", "array", "function", "regexp", "date", "math"];
    return typeData.indexOf(getType(v)) !== -1;
}
function getType(v) {
    return Object.prototype.toString
        .call(v)
        .match(/\[object (.+?)\]/)[1]
        .toLowerCase();
}
function isUndef(v) {
    return v === undefined || v === null;
}
function checkSameVnode(o, n) {
    return o.tag === n.tag && o.key === n.key;
}
function isVnode(vnodes) {
    if (vnodes) {
        return (vnodes.hasOwnProperty("tag") &&
            vnodes.hasOwnProperty("props") &&
            vnodes.hasOwnProperty("children") &&
            vnodes.hasOwnProperty("key") &&
            vnodes.hasOwnProperty("el"));
    }
}
function isArrayVnode(vnodes) {
    for (let index = 0; index < vnodes.length; index++) {
        return isVnode(vnodes[index]);
    }
}
function checkVnode(vnodes) {
    if (getType(vnodes) === "array") {
        return isArrayVnode(vnodes);
    }
    else if (getType(vnodes) === "object") {
        return isVnode(vnodes);
    }
}
const isComplexDataType = (obj) => (typeof obj === "object" || typeof obj === "function") && obj !== null;
function isSameObject(obj1, obj2) {
    if (!isComplexDataType(obj1) || !isComplexDataType(obj2)) {
        return obj1 === obj2;
    }
    if (obj1 === obj2) {
        return true;
    }
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }
    for (const key in obj1) {
        const res = isSameObject(obj1[key], obj2[key]);
        if (!res) {
            return false;
        }
    }
    return true;
}
const namespaceMap = {
    svg: "http://www.w3.org/2000/svg",
    math: "http://www.w3.org/1998/Math/MathML",
};
const xlinkNS = "http://www.w3.org/1999/xlink";
function getXlinkProp(name) {
    return isXlink(name) ? name.slice(6, name.length) : "";
}
function getTagNamespace(tag) {
    if (isSVG(tag)) {
        return "svg";
    }
    if (tag === "math") {
        return "math";
    }
}
function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
}
function setStyleProp(el, prototype) {
    for (let i in prototype) {
        el.style[i] = prototype[i];
    }
}
function addEvent(el, props) {
    for (let index = 0; index < Object.keys(props).length; index++) {
        const element = Object.keys(props)[index].toString();
        if (element.startsWith("on")) {
            const name = element.split("on")[1][0].toLowerCase() +
                element.split("on")[1].substring(1);
            el.addEventListener(name, props[element]);
        }
        else if (element.startsWith("@")) {
            const name = element.split("@")[1];
            el.addEventListener(name, props[element]);
        }
    }
}
function removeEvent(el, key, oldProps) {
    if (key.startsWith("on")) {
        const name = key.split("on")[1][0].toLowerCase() + key.split("on")[1].substring(1);
        el.removeEventListener(name, oldProps[key]);
    }
    else if (key.startsWith("@")) {
        const name = key.split("@")[1];
        el.removeEventListener(name, oldProps[key]);
    }
}
function removeAttribute(el, key, oldProps) {
    if (isXlink(key)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    }
    else {
        el.removeAttribute(key);
    }
    removeEvent(el, key, oldProps);
}
function createNode(tag) {
    // Html
    if (isHTMLTag(tag)) {
        return document.createElement(tag);
    }
    // Svg
    else if (isSVG(tag)) {
        return createElementNS(getTagNamespace(tag), tag);
    }
    // Fragment
    else if (tag === "fragment" || tag === "component") {
        return document.createDocumentFragment();
    }
    // Comment
    else if (tag === "comment" || tag === "null") {
        return document.createComment(tag);
    }
    // Web-components
    else if (tag.indexOf("-") !== -1) {
        return document.createElement(tag);
    }
    // Default
    else {
        return document.createElement(tag);
    }
}

const flag = ["$ref", "$name", "$props"];
const _com_ = Object.create(null);
const _components = new WeakMap();
let componentName = "";
let mountHook = [];
let unMountedHook = [];
// domInfo
const domInfo = Object.create(null);
// propsData
let propsData = reactive(Object.create(null));
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
function mount(vnode, container, anchor) {
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
                    if (getType(vnode.props[key]) !== "function" &&
                        !vnode.props.hasOwnProperty("key")) {
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
                if (!isUndef(newValue)) {
                    if (getType(newValue) !== "function" && key !== "key") {
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
                    else if (getType(newValue) === "function" &&
                        newValue.toString() !== oldValue.toString()) {
                        removeEvent(el, key, oldProps);
                        addEvent(el, newProps);
                    }
                }
                else {
                    removeAttribute(el, key, oldProps);
                }
            }
        }
        for (const key in oldProps) {
            if (!(key in newProps)) {
                removeAttribute(el, key, oldProps);
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
function onMounted(fn = null) {
    if (fn === null)
        return;
    if (typeof fn !== "function") {
        console.error(`[Strve warn]: The parameter of onMounted is not a function!`);
        return;
    }
    mountHook.push(fn);
}
// onUnmounted
function onUnmounted(fn = null) {
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
const nextTick = (fn) => p.then(fn);
// Mount node
function mountNode(dom, selector, name) {
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
function setData(callback, options) {
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
function defineCustomElement(options, tag) {
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

const version = "6.0.2";
const state = {
    _el: null,
    _template: null,
    oldTree: null,
    isMounted: false,
};
function normalizeContainer(container) {
    if (typeof container === "string") {
        const res = document.querySelector(container);
        if (!res) {
            let elem = null;
            if (container.startsWith("#")) {
                elem = document.createElement("div");
                elem.setAttribute("id", container.substring(1, container.length));
            }
            else if (container.startsWith(".")) {
                elem = document.createElement("div");
                elem.setAttribute("class", container.substring(1, container.length));
            }
            else {
                console.warn(`[Strve warn]: Failed to mount app: mount target selector "${container}" returned null.`);
            }
            document.body.insertAdjacentElement("afterbegin", elem);
            return elem;
        }
        return res;
    }
    else if (container instanceof HTMLElement) {
        return container;
    }
    else if (window.ShadowRoot &&
        container instanceof window.ShadowRoot &&
        container.mode === "closed") {
        console.warn(`[Strve warn]: mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs.`);
        return null;
    }
    else {
        return null;
    }
}
function createApp(template) {
    const app = {
        mount(el) {
            if (normalizeContainer(el)) {
                const tem = template();
                if (getType(tem) === "array") {
                    console.error("[Strve warn]: Please provide a root node.");
                }
                else {
                    state._template = template;
                    state._el = normalizeContainer(el);
                    state._el && mountNode(tem, state._el);
                }
            }
            else {
                console.error("[Strve warn]: There must be a mount element node.");
            }
        },
    };
    return app;
}

export { createApp, defineCustomElement, domInfo, nextTick, onMounted, onUnmounted, propsData, setData, version };
