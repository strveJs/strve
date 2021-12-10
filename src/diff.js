import { state } from "./init.js";

const reg = new RegExp('{(.+?)}');

function deepGet(obj, path) {
  try {
    return path.split('.').reduce((o, k) => o[k], obj);
  } catch (e) {
    return undefined;
  }
}

function removeEvent({ el, key, oldProps }) {
  el.removeAttribute(key);
  if (key.startsWith('on')) {
    el.removeEventListener(key.split('on')[1], oldProps[key], false);
  }
}

function addEvent(el, props) {
  for (let index = 0; index < Object.keys(props).length; index++) {
    const element = Object.keys(props)[index].toString();
    if (element.startsWith('on')) {
      el.addEventListener(element.split('on')[1], props[element], false);
    }
  }
}

function useText(val, el, _val) {
  if (_val) {
    val = val.replace(reg, _val);
  }

  if (reg.test(val)) {
    const key = reg.exec(val)[1];
    state._data.hasOwnProperty(key) ? useText(val, el, state._data[key]) : useText(val, el, deepGet(state._data, key.toString()));
  } else {
    el.textContent = val.toString();
    return;
  }
}

function patchNode(o, n, el) {
  for (let i = 0; i < Math.min(o.length, n.length); i++) {
    patch(o[i], n[i]);
  }
  if (n.length > o.length) {
    n.slice(o.length).forEach((c) => mount(c, el));
  } else if (o.length > n.length) {
    o.slice(n.length).forEach((c) => {
      el.removeChild(c.el);
    });
  }
}

function mount(vnode, container, anchor) {
  if (vnode.type) {
    const el = document.createElement(vnode.type);
    vnode.el = el;

    if (vnode.props) {
      addEvent(el, vnode.props);

      for (const key in vnode.props) {
        if (typeof vnode.props[key] === 'string' && reg.test(vnode.props[key])) {
          const ikey = reg.exec(vnode.props[key])[1];
          vnode.props[key] = vnode.props[key].replace(reg, state._data[ikey]);
        }
        el.setAttribute(key, vnode.props[key]);
      }
    }

    if (vnode.children) {
      if (typeof vnode.children[0] === 'string' || typeof vnode.children[0] === 'number') {
        useText(vnode.children[0].toString(), el);
      } else {
        if (Array.isArray(vnode.children[0])) {
          vnode.children[0].forEach((child) => {
            mount(child, el);
          });
        } else {
          vnode.children.forEach((child) => {
            mount(child, el);
          });
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

  addEvent(el, newProps);

  for (const key in newProps) {
    let [newValue, oldValue] = [newProps[key], oldProps[key]];
    if (newValue !== null) {
      if (newValue !== oldValue) {
        if (reg.test(newValue)) {
          const key = reg.exec(newValue)[1];
          if (state._data.hasOwnProperty(key)) {
            newValue = state._data[key];
          } else {
            newValue = deepGet(state._data, key.toString());
          }
        }
        el.setAttribute(key, newValue);
      }
    } else {
      removeEvent({ el, key, oldProps });
    }
  }

  for (const key in oldProps) {
    if (!(key in newProps)) {
      removeEvent({ el, key, oldProps });
    }
  }

  const [oc, nc, ocs, ncs] = [n1.children[0], n2.children[0], n1.children, n2.children];
  if (typeof nc === 'string' || typeof nc === 'number') {
    useText(nc.toString(), el);
  } else {
    if (typeof oc !== 'string') {
      if (Array.isArray(oc) && Array.isArray(nc)) {
        patchNode(oc, nc, el);
      } else {
        patchNode(ocs, ncs, el);
      }
    } else {
      el.innerHTML = '';
      ncs.forEach((c) => mount(c, el));
    }
  }
}

function mountNode(dom, selector) {
  if (!state.isMounted) {
    mount((state.oldTree = dom), document.querySelector(selector));
    state.isMounted = true;
  } else {
    const newTree = dom;
    patch(state.oldTree, newTree);
    state.oldTree = newTree;
  }
}

async function updateView(cb,router) {
  if (typeof cb === 'function'&& !router) {
    await cb();
    mountNode(state._template(), state._el);
  } else if(router==='useRouter'){
    await cb();
    document.querySelector(state._el).innerHTML = '';
    mount(state._template(), document.querySelector(state._el));
  }
}

export {
  mountNode,
  updateView
}