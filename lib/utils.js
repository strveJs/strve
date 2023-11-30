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
export { getType, isComplexType, isUndef, checkSameVnode, isVnode, checkVnode, setStyleProp, addEvent, removeEvent, setAttribute, removeAttribute, createNode, warn, getSequence, notTagComponent, };
