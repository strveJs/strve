// version:2.3.4

import {
  state,
  getType,
  useTemplate,
  checkVnode,
  makeMap
} from "./init.js";

const isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

const namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

const xlinkNS = 'http://www.w3.org/1999/xlink';

const isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,image,defs,desc,ellipse,filter,font-face' +
  'foreignobject,g,glyph,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view,' +
  'feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feFlood,feGaussianBlur,' +
  'feImage,feMerge,feMorphology,feOffset,feSpecularLighting,feTile,feTurbulence,feDistantLight,fePointLight,feSpotLight,' +
  'linearGradient,stop,radialGradient,' +
  'animateTransform,animateMotion'
);

function isComplexType(v) {
  const typeData = ['object', 'array', 'function', 'regexp', 'date', 'math'];
  return typeData.indexOf(getType(v)) !== -1
}

function setStyleProp(el, prototype) {
  for (let i in prototype) {
    el.style[i] = prototype[i];
  }
}

function emitEvent(eventName, data, el) {
  const customEvent = new CustomEvent(eventName, data);
  if (customEvent) {
    document.querySelector(el).dispatchEvent(customEvent);
  }
}

function addEvent(el, props) {
  for (let index = 0; index < Object.keys(props).length; index++) {
    const element = Object.keys(props)[index].toString();
    if (element.startsWith('on')) {
      const name = element.split('on')[1][0].toLowerCase() + element.split('on')[1].substring(1);
      el.addEventListener(name, props[element], false);
    }
  }
}

function removeEvent({
  el,
  key,
  oldProps
}) {
  if (isXlink(key)) {
    el.removeAttributeNS(xlinkNS, getXlinkProp(key));
  } else {
    el.removeAttribute(key);
  }

  if (key.startsWith('on')) {
    const name = key.split('on')[1][0].toLowerCase() + key.split('on')[1].substring(1);
    el.removeEventListener(name, oldProps[key], false);
  }
}

function isXlink(name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

function getXlinkProp(name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

function getTagNamespace(tag) {
  if (isSVG(tag)) {
    return 'svg'
  }

  if (tag === 'math') {
    return 'math'
  }
}

function createElementNS(namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createNode(tag) {
  if (isHTMLTag(tag)) {
    return document.createElement(tag)
  } else if (isSVG(tag)) {
    return createElementNS(getTagNamespace(tag), tag)
  } else if (tag === 'fragment') {
    return document.createDocumentFragment()
  } else if (tag === 'comment') {
    return document.createComment('comment')
  } else if (tag === 'textnode') {
    return document.createTextNode('')
  }
}

function setChildrenNode(childNode, fun, el) {
  if (childNode.length === 1 && !isComplexType(childNode[0])) {
    setTextNode(childNode, el);
  } else if (childNode.length > 1 && !checkVnode(childNode)) {
    const str = childNode.join().replace(/,/g, '');
    setTextNode(str, el);
  } else if (isComplexType(childNode[0]) && !childNode[0].tag && !checkVnode(childNode[0])) {
    setTextNode(childNode[0], el);
  } else {
    fun();
  }
}

function setTextNode(val, el) {
  if (isComplexType(val)) {
    if (getType(val) === 'function' || getType(val) === 'regexp' || getType(val) === 'array') {
      el.textContent = String(val)
    } else {
      el.textContent = JSON.stringify(val);
    }
  } else {
    el.textContent = val ? val.toString() : String(val);
  }
}

function mount(vnode, container, anchor) {
  if (vnode.tag) {
    const el = createNode(vnode.tag);
    vnode.el = el;

    if (vnode.props) {
      addEvent(el, vnode.props);

      for (const key in vnode.props) {
        if (vnode.props.hasOwnProperty(key)) {
          if (getType(vnode.props[key]) !== 'function') {
            if (isXlink(key)) {
              el.setAttributeNS(xlinkNS, key, vnode.props[key]);
            } else {
              el.setAttribute(key, vnode.props[key]);
            }
          }
          if (getType(vnode.props[key]) === 'object') {
            setStyleProp(el, vnode.props[key]);
          }
        }
      }
    }

    if (vnode.children) {
      setChildrenNode(vnode.children, mountChildrenNodes, el)

      function mountChildrenNodes() {
        if (getType(vnode.children[0]) === 'array') {
          vnode.children[0].forEach((child) => {
            mount(child, el);
          });
        } else {
          if (getType(vnode.children) === 'array') {
            vnode.children.forEach((child) => {
              mount(child, el);
            });
          }
        }
      }
    }
    if (anchor) {
      container.insertBefore(el, anchor);
    } else {
      container.appendChild(el);
    }
  }
}

function patch(n1, n2, status) {
  if (n1.tag !== n2.tag) {
    const parent = n1.el.parentNode;
    const anchor = n1.el.nextSibling;
    parent.removeChild(n1.el);
    mount(n2, parent, anchor);
  } else {
    if (n1 && n2 && checkVnode(n1) && checkVnode(n2)) {
      const el = (n2.el = n1.el);

      const oldProps = n1.props || {};
      const newProps = n2.props || {};

      for (const key in newProps) {
        let [newValue, oldValue] = [newProps[key], oldProps[key]];
        if (newValue !== oldValue) {
          if (newValue !== null) {
            if (getType(newValue) !== 'function') {

              el[key] && (el[key] = newValue); // property
              if (isXlink(key)) {
                el.setAttributeNS(xlinkNS, key, newValue);
              } else {
                el.setAttribute(key, newValue);
              }

              if (getType(newValue) === 'object') {
                setStyleProp(el, newValue);
              }
            } else {
              if (key.startsWith('on')) {
                const name = key.split('on')[1][0].toLowerCase() + key.split('on')[1].substring(1);
                el.addEventListener(name, newValue, false);
              }
            }
          } else {
            removeEvent({
              el,
              key,
              oldProps
            });
          }
        }
      }

      for (const key in oldProps) {
        if (!(key in newProps)) {
          removeEvent({
            el,
            key,
            oldProps
          });
        }
      }

      const [oc, nc, ocs, ncs] = [n1.children && n1.children[0], n2.children && n2.children[0], n1.children, n2.children];

      if (JSON.stringify(ocs) !== JSON.stringify(ncs)) {
        setChildrenNode(ncs, patchChildrenNodes, el);
      }

      function patchChildrenNodes() {
        if (getType(oc) === 'array' && getType(nc) === 'array') {
          patchNode(oc, nc, el, status);
        } else if (getType(oc) !== 'array' && getType(nc) === 'array') {
          el.innerHTML = '';
          nc.forEach((c) => mount(c, el));
        } else {
          patchNode(ocs, ncs, el, status);
        }
      }
    }
  }
}

function patchNode(o, n, el, status) {
  if (status === 'useFkey') {
    for (let i = 1; i <= Math.max(o.length, n.length); i++) {
      if (!o[o.length - i]) {
        mount(n[n.length - i], o[o.length - 1].el.parentNode, o[0].el)
      } else if (!n[n.length - i]) {
        el.removeChild(o[o.length - i].el);
      } else {
        patch(o[o.length - i], n[n.length - i], status);
      }
    }
  } else {
    for (let i = 0; i < Math.min(o.length, n.length); i++) {
      patch(o[i], n[i], status);
    }
    if (n.length > o.length) {
      n.slice(o.length).forEach((c) => mount(c, el));
    } else if (o.length > n.length) {
      o.slice(n.length).forEach((c) => {
        el.removeChild(c.el);
      });
    }
  }
}

function setFragmentNode(dom) {
  return {
    tag: 'fragment',
    props: null,
    children: dom
  }
}

function mountNode(dom, selector, status) {
  if (!state.isMounted) {
    const _template = !dom.tag ? setFragmentNode(dom) : dom;
    mount(_template, document.querySelector(selector));
    state.oldTree = _template;
    state.isMounted = true;
  } else {
    let newTree = null;
    newTree = !dom.tag ? setFragmentNode(dom) : dom;
    patch(state.oldTree, newTree, status);
    state.oldTree = newTree;
  }
}

function updateView(callback, status) {
  if (getType(callback) === 'function' && getType(Promise) !== 'undefined') {
    return Promise.resolve().then(() => {
      callback();
    }).then(() => {
      const _template = useTemplate(state._template());
      if (status === 'useRouter') {
        document.querySelector(state._el).innerHTML = '';
        mount((state.oldTree = _template), document.querySelector(state._el));
      } else {
        mountNode(_template, state._el, status);
      }
    }).catch((err) => console.error(err))
  }
}

export {
  mountNode,
  updateView,
  emitEvent
}