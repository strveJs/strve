/*!
 * Strve.js v6.4.0
 * (c) 2021-2024 maomincoding
 * Released under the MIT License.
 */
const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_COMMENT = 4;
const MODE_PROP_SET = 5;
const MODE_PROP_APPEND = 6;
const CHILD_APPEND = 0;
const CHILD_RECURSE = 2;
const TAG_SET = 3;
const PROPS_ASSIGN = 4;
const PROP_SET = MODE_PROP_SET;
const PROP_APPEND = MODE_PROP_APPEND;
const evaluate = (h, built, fields, args) => {
    let tmp;
    built[0] = 0;
    for (let i = 1; i < built.length; i++) {
        const type = built[i++];
        const value = built[i]
            ? ((built[0] |= type ? 1 : 2), fields[built[i++]])
            : built[++i];
        if (type === TAG_SET) {
            args[0] = value;
        }
        else if (type === PROPS_ASSIGN) {
            args[1] = Object.assign(args[1] || {}, value);
        }
        else if (type === PROP_SET) {
            (args[1] = args[1] || {})[built[++i]] = value;
        }
        else if (type === PROP_APPEND) {
            args[1][built[++i]] += value + "";
        }
        else if (type) {
            tmp = h.apply(value, evaluate(h, value, fields, ["", null]));
            args.push(tmp);
            if (value[0]) {
                built[0] |= 2;
            }
            else {
                built[i - 2] = CHILD_APPEND;
                built[i] = tmp;
            }
        }
        else {
            args.push(value);
        }
    }
    return args;
};
const build = function (statics) {
    let mode = MODE_TEXT;
    let buffer = "";
    let quote = "";
    let current = [0];
    let char, propName;
    const commit = (field) => {
        if (mode === MODE_TEXT &&
            (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, "")))) {
            current.push(CHILD_APPEND, field, buffer);
        }
        else if (mode === MODE_TAGNAME && (field || buffer)) {
            current.push(TAG_SET, field, buffer);
            mode = MODE_WHITESPACE;
        }
        else if (mode === MODE_WHITESPACE && buffer === "..." && field) {
            current.push(PROPS_ASSIGN, field, 0);
        }
        else if (mode === MODE_WHITESPACE && buffer && !field) {
            current.push(PROP_SET, 0, true, buffer);
        }
        else if (mode >= MODE_PROP_SET) {
            if (buffer || (!field && mode === MODE_PROP_SET)) {
                current.push(mode, 0, buffer, propName);
                mode = MODE_PROP_APPEND;
            }
            if (field) {
                current.push(mode, field, 0, propName);
                mode = MODE_PROP_APPEND;
            }
        }
        buffer = "";
    };
    for (let i = 0; i < statics.length; i++) {
        if (i) {
            if (mode === MODE_TEXT) {
                commit();
            }
            commit(i);
        }
        for (let j = 0; j < statics[i].length; j++) {
            char = statics[i][j];
            if (mode === MODE_TEXT) {
                if (char === "<") {
                    commit();
                    current = [current];
                    mode = MODE_TAGNAME;
                }
                else {
                    buffer += char;
                }
            }
            else if (mode === MODE_COMMENT) {
                if (buffer === "--" && char === ">") {
                    mode = MODE_TEXT;
                    buffer = "";
                }
                else {
                    buffer = char + buffer[0];
                }
            }
            else if (quote) {
                if (char === quote) {
                    quote = "";
                }
                else {
                    buffer += char;
                }
            }
            else if (char === '"' || char === "'") {
                quote = char;
            }
            else if (char === ">") {
                commit();
                mode = MODE_TEXT;
            }
            else if (!mode) ;
            else if (char === "=") {
                mode = MODE_PROP_SET;
                propName = buffer;
                buffer = "";
            }
            else if (char === "/" &&
                (mode < MODE_PROP_SET || statics[i][j + 1] === ">")) {
                commit();
                if (mode === MODE_TAGNAME) {
                    current = current[0];
                }
                mode = current;
                (current = current[0]).push(CHILD_RECURSE, 0, mode);
                mode = MODE_SLASH;
            }
            else if (char === " " ||
                char === "\t" ||
                char === "\n" ||
                char === "\r") {
                commit();
                mode = MODE_WHITESPACE;
            }
            else {
                buffer += char;
            }
            if (mode === MODE_TAGNAME && buffer === "!--") {
                mode = MODE_COMMENT;
                current = current[0];
            }
        }
    }
    commit();
    return current;
};
const CACHES = new Map();
const regular = function (statics) {
    let tmp = CACHES.get(this);
    if (!tmp) {
        tmp = new Map();
        CACHES.set(this, tmp);
    }
    tmp = evaluate(this, tmp.get(statics) || (tmp.set(statics, (tmp = build(statics))), tmp), arguments, []);
    return tmp.length > 1 ? tmp : tmp[0];
};
const createVNode = function (tag, props, child) {
    let key = null;
    let el = null;
    let i = null;
    let children = null;
    for (i in props) {
        if (i === "key")
            key = props[i];
    }
    if (arguments.length > 2) {
        children =
            arguments.length > 3 ? Array.prototype.slice.call(arguments, 2) : child;
    }
    // Vnode
    return {
        tag,
        props,
        children,
        key,
        el,
    };
};
const html = regular.bind(createVNode);

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const HTML_TAGS = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,' +
    'header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,' +
    'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
    'data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,' +
    'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
    'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
    'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
    'option,output,progress,select,textarea,details,dialog,menu,' +
    'summary,template,blockquote,iframe,tfoot';
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const SVG_TAGS = 'svg,animate,circle,clippath,cursor,image,defs,desc,ellipse,filter,font-face' +
    'foreignobject,g,glyph,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view,' +
    'feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feFlood,feGaussianBlur,' +
    'feImage,feMerge,feMorphology,feOffset,feSpecularLighting,feTile,feTurbulence,feDistantLight,fePointLight,feSpotLight,' +
    'linearGradient,stop,radialGradient,' +
    'animateTransform,animateMotion';
function makeMap(str) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return function (val) {
        return map[val];
    };
}
const isHTMLTag = /*#__PURE__*/ makeMap(HTML_TAGS);
const isSVG = /*#__PURE__*/ makeMap(SVG_TAGS);
function isXlink(name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
}
const namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML',
};
const xlinkNS = 'http://www.w3.org/1999/xlink';
function getXlinkProp(name) {
    return isXlink(name) ? name.slice(6, name.length) : '';
}
function getTagNamespace(tag) {
    if (isSVG(tag)) {
        return 'svg';
    }
    if (tag === 'math') {
        return 'math';
    }
    return undefined;
}
function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
}
function getType(v) {
    return Object.prototype.toString
        .call(v)
        .match(/\[object (.+?)\]/)[1]
        .toLowerCase();
}
const typeData = ['object', 'array', 'function', 'regexp', 'date', 'math'];
function isComplexType(v) {
    return typeData.includes(getType(v));
}
function isUndef(v) {
    return v === undefined || v === null;
}
function checkSameVnode(o, n) {
    return o.tag === n.tag && o.key === n.key;
}
function notTagComponent(oNode, nNode) {
    return nNode.tag !== 'component' && oNode.tag !== 'component';
}
function hasOwnProperty(obj, prop) {
    return obj.hasOwnProperty(prop);
}
function isVnode(vnode) {
    if (vnode) {
        return (hasOwnProperty(vnode, 'tag') &&
            hasOwnProperty(vnode, 'props') &&
            hasOwnProperty(vnode, 'children') &&
            hasOwnProperty(vnode, 'key') &&
            hasOwnProperty(vnode, 'el'));
    }
}
function isArrayVnode(vnodes) {
    return vnodes.every(isVnode);
}
function checkVnode(vnodes) {
    return Array.isArray(vnodes) ? isArrayVnode(vnodes) : isVnode(vnodes);
}
function warn(msg) {
    console.warn(`[Strve warn]: ${msg}`);
}
function setStyleProp(el, prototype) {
    Object.assign(el.style, prototype);
}
function addEvent(el, props) {
    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith('on')) {
            const name = key.slice(2).toLowerCase();
            el.addEventListener(name, value);
        }
    }
}
function removeEvent(el, key, oldProps) {
    if (key.startsWith('on')) {
        const name = key.slice(2, 3).toLowerCase() + key.slice(3);
        if (typeof oldProps[key] === 'function') {
            el.removeEventListener(name, oldProps[key]);
        }
    }
}
function setAttribute(el, key, value) {
    if (typeof isXlink === 'function' && !isXlink(key)) {
        el.setAttribute(key, value.toString());
    }
    else {
        const xlinkNS = 'http://www.w3.org/1999/xlink';
        el.setAttributeNS(xlinkNS, key, value.toString());
    }
}
function removeAttribute(el, key) {
    if (!isXlink(key)) {
        el.removeAttribute(key);
    }
    else {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    }
}
function createNode(tag) {
    switch (true) {
        // Html
        case isHTMLTag(tag):
            return document.createElement(tag);
        // Svg
        case isSVG(tag):
            return createElementNS(getTagNamespace(tag), tag);
        // Fragment
        case tag === 'fragment' || tag === 'component':
            return document.createDocumentFragment();
        // Comment
        case tag === 'comment' || tag === 'null':
            return document.createComment(tag);
        // Default
        default:
            return document.createElement(tag);
    }
}
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = ((u + v) / 2) | 0;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}

// version
const version = '6.4.0';
// Flag
const flag = ['$ref', '$is'];
// Component
const componentMap = new WeakMap();
// domInfo
const domInfo = new WeakMap();
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
                // component
                if (key === flag[1] && propValueType === 'object') {
                    const newTree = propValue.template();
                    mount(newTree, el);
                    componentMap.set(propValue, newTree);
                }
            }
        }
        // children
        if (tag !== 'component') {
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
// Diff
function patch(oNode, nNode) {
    if (notTagComponent(oNode, nNode)) {
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
// Change data
async function setData(callback, content) {
    if (typeof callback === 'function' && typeof Promise !== 'undefined') {
        try {
            await Promise.resolve(callback());
            const target = content ? content : this;
            const newTree = target.template();
            const oldTree = componentMap.get(target);
            patch(oldTree, newTree);
            componentMap.set(target, newTree);
        }
        catch (err) {
            warn(err);
        }
    }
}
let _el = Object.create(null);
let _template = Object.create(null);
// Reset view
function resetView() {
    _el.innerHTML = '';
    const newTemplate = _template();
    mount(newTemplate, _el);
}
// Normalize Container
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
// Define Component
function defineComponent(options, factory) {
    if (typeof options === 'function') {
        factory = options;
        options = Object.create(null);
    }
    class Component {
        template;
        static instance;
        constructor() {
            const param = { content: this, setData: setData.bind(this) };
            const template = factory.call(this, param);
            this.template = template;
            const newTree = template();
            if (options.mount) {
                const mountNodeEl = normalizeContainer(options.mount);
                mount(newTree, mountNodeEl);
                componentMap.set(this, newTree);
                _el = mountNodeEl;
                _template = newTree;
            }
        }
        static getInstance() {
            if (!this.instance) {
                this.instance = new Component();
            }
            return this.instance;
        }
    }
    return Component.getInstance();
}

// It is a flexible and powerful JavaScript state management library.
class createStateFlow {
    _mutations;
    _actions;
    _state;
    constructor(options) {
        this._mutations = options.mutations;
        this._actions = options.actions;
        this._state = new Proxy(options.state, {
            set: (target, key, value) => {
                if (this._mutations[key]) {
                    this._mutations[key](target, value);
                }
                target[key] = value;
                return true;
            },
        });
    }
    commit(mutationName, payload) {
        if (this._mutations[mutationName]) {
            this._mutations[mutationName](this._state, payload);
        }
    }
    async dispatch(actionName, payload) {
        if (this._actions[actionName]) {
            await this._actions[actionName](this, payload);
        }
    }
    get state() {
        return this._state;
    }
}

export { createStateFlow, defineComponent, domInfo, html, resetView, setData, version };
