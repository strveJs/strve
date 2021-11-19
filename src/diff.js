import state from './state.js';

const reg = new RegExp('{(.+?)}');

function safeGet(obj, path) {
  try {
    return path.split('.').reduce((o, k) => o[k], obj);
  } catch (e) {
    return undefined;
  }
}

function mount(vnode, container, anchor) {
  const el = document.createElement(vnode.type);
  vnode.el = el;

  if (vnode.props) {
    for (let index = 0; index < Object.keys(vnode.props).length; index++) {
      const element = Object.keys(vnode.props)[index].toString();
      if (element.startsWith('on')) {
        el.addEventListener(element.split('on')[1], vnode.props[element], false);
      }
    }

    for (const key in vnode.props) {
      if (typeof vnode.props[key] === 'string' && reg.test(vnode.props[key])) {
        const ikey = reg.exec(vnode.props[key])[1];
        vnode.props[key] = vnode.props[key].replace(reg, state._data[ikey]);
      }
      el.setAttribute(key, vnode.props[key]);
    }
  }
  if (vnode.children) {
    if (typeof vnode.children[0] === 'string') {
      toValue(vnode.children[0], el);
    } else if (Array.isArray(vnode.children[0])) {
      vnode.children[0].forEach((child) => {
        mount(child, el);
      });
    } else {
      vnode.children.forEach((child) => {
        mount(child, el);
      });
    }
  }
  if (anchor) {
    container.insertBefore(el, anchor);
  } else {
    container.appendChild(el);
  }
}

function remove({ el, key, oldProps }) {
  el.removeAttribute(key);
  if (key.startsWith('on')) {
    el.removeEventListener(key.split('on')[1], oldProps[key], false);
  }
}

function patch(n1, n2) {
  if (n1.type !== n2.type) {
    const parent = n1.el.parentNode;
    const anchor = n1.el.nextSibling;
    parent.removeChild(n1.el);
    mount(n2, parent, anchor);
    return;
  }

  const el = (n2.el = n1.el);

  const oldProps = n1.props || {};
  const newProps = n2.props || {};

  for (let index = 0; index < Object.keys(newProps).length; index++) {
    const element = Object.keys(newProps)[index].toString();
    if (element.startsWith('on')) {
      el.addEventListener(element.split('on')[1], newProps[element], false);
    }
  }

  for (const key in newProps) {
    let newValue = newProps[key];
    let oldValue = oldProps[key];
    if (newValue !== null) {
      if (newValue !== oldValue) {
        if (reg.test(newValue)) {
          const key = reg.exec(newValue)[1];
          if (state._data.hasOwnProperty(key)) {
            newValue = state._data[key];
          } else {
            newValue = safeGet(state._data, key.toString());
          }
        }
        el.setAttribute(key, newValue);
      }
    } else {
      remove({ el, key, oldProps });
    }
  }

  for (const key in oldProps) {
    if (!(key in newProps)) {
      remove({ el, key, oldProps });
    }
  }

  const oc = n1.children;
  const nc = n2.children;

  if (typeof nc[0] === 'string') {
    toValue(nc[0], el);
  } else {
    if (oc[0] !== 'string') {
      if (Array.isArray(oc[0]) && Array.isArray(nc[0])) {
        for (let index = 0; index < Math.min(oc[0].length, nc[0].length); index++) {
          patch(oc[0][index], nc[0][index]);
        }

        if (nc[0].length > oc[0].length) {
          nc[0].slice(oc[0].length).forEach((c) => mount(c, el));
        } else if (oc[0].length > nc[0].length) {
          oc[0].slice(nc[0].length).forEach((c) => {
            el.removeChild(c.el);
          });
        }
      } else {
        for (let i = 0; i < Math.min(oc.length, nc.length); i++) {
          patch(oc[i], nc[i]);
        }

        if (nc.length > oc.length) {
          nc.slice(oc.length).forEach((c) => mount(c, el));
        } else if (oc.length > nc.length) {
          oc.slice(nc.length).forEach((c) => {
            el.removeChild(c.el);
          });
        }
      }
    } else {
      el.innerHTML = '';
      nc.forEach((c) => mount(c, el));
    }
  }
}

function testVal(val, el, _val) {
  val = val.replace(reg, _val);
  reg.test(val) ? toValue(val, el) : (el.textContent = val);
}

function toValue(val, el) {
  if (reg.test(val)) {
    const key = reg.exec(val)[1];
    state._data.hasOwnProperty(key) ? testVal(val, el, state._data[key]) : testVal(val, el, safeGet(state._data, key.toString()));
  } else {
    el.textContent = val;
  }
}

function mountNode(render, selector) {
  if (!state.isMounted) {
    mount((state.oldTree = render), document.querySelector(selector));
    state.isMounted = true;
  } else {
    const newTree = render;
    patch(state.oldTree, newTree);
    state.oldTree = newTree;
  }
}

export default mountNode;
