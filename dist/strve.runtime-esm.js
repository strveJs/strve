/*!
 * Strve.js v6.7.0
 * (c) 2021-2024 maomincoding
 * Released under the MIT License.
 */
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
function addEventListener(el, name, listener) {
    const eventName = name.slice(2).toLowerCase();
    if (typeof listener === 'function') {
        el.addEventListener(eventName, listener);
    }
}
function removeEventListener(el, name, listener) {
    const eventName = name.slice(2).toLowerCase();
    if (typeof listener === 'function') {
        el.removeEventListener(eventName, listener);
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
const version = '6.7.0';
// Flag
const flag = ['$ref', '$is'];
// Component
let componentMap = new WeakMap();
// domInfo
const domInfo = Object.create(null);
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
            const keys = Object.keys(props);
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                const propValue = props[key];
                const propValueType = getType(propValue);
                if (key.startsWith('on')) {
                    addEventListener(el, key, propValue);
                }
                if (propValueType !== 'function' && key !== 'key' && !flag.includes(key)) {
                    setAttribute(el, key, propValue);
                }
                if (key === 'style' && propValueType === 'object') {
                    setStyleProp(el, propValue);
                }
                // domInfo
                if (key === flag[0] && propValueType === 'string') {
                    domInfo[propValue] = el;
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
                            removeEventListener(el, key, oldValue);
                            addEventListener(el, key, newValue);
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
// Reset view
function resetView(content) {
    _el.innerHTML = '';
    componentMap = null;
    componentMap = new WeakMap();
    const newTree = content.template();
    mount(newTree, _el);
    componentMap.set(content, newTree);
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

export { defineComponent, domInfo, resetView, setData, version };
