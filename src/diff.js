import {
  state
} from "./init.js";

const reg = new RegExp('{(.+?)}');

function useStyle(el, prototype) {
  for (let i in prototype) {
    el.style[i] = prototype[i];
  }
}

function deepGet(obj, path) {
  try {
    return path.split('.').reduce((o, k) => o[k], obj);
  } catch (e) {
    return undefined;
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
  el.removeAttribute(key);
  if (key.startsWith('on')) {
    const name = key.split('on')[1][0].toLowerCase() + key.split('on')[1].substring(1);
    el.removeEventListener(name, oldProps[key], false);
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
  }
}

function mount(vnode, container, anchor) {
  if (vnode.type) {
    const el = document.createElement(vnode.type);
    vnode.el = el;

    if (vnode.props) {
      addEvent(el, vnode.props);

      for (const key in vnode.props) {
        if (vnode.props.hasOwnProperty(key)) {
          if (typeof vnode.props[key] !== 'function') {
            el.setAttribute(key, vnode.props[key]);
          }

          if (typeof vnode.props[key] === 'object' && typeof vnode.props[key] !== null) {
            useStyle(el, vnode.props[key]);
          }
        }
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

function sameNode(n1, n2) {
  if (n1.type !== n2.type) {
    const parent = n1.el.parentNode;
    const anchor = n1.el.nextSibling;
    parent.removeChild(n1.el);
    mount(n2, parent, anchor);
  }
}

function patch(n1, n2, status) {
  sameNode(n1, n2);

  const el = (n2.el = n1.el);

  const oldProps = n1.props || {};
  const newProps = n2.props || {};

  addEvent(el, newProps);

  for (const key in newProps) {
    let [newValue, oldValue] = [newProps[key], oldProps[key]];
    if (newValue !== oldValue) {
      if (newValue !== null) {
        if (typeof newValue !== 'function') {
          el.setAttribute(key, newValue);
        }
      } else {
        removeEvent({
          el,
          key,
          oldProps
        });
      }
    } else if (typeof newValue === 'object' && typeof newValue !== null) {
      useStyle(el, newValue);
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

  const [oc, nc, ocs, ncs] = [n1.children[0], n2.children[0], n1.children, n2.children];

  if (typeof nc === 'string' || typeof nc === 'number') {
    useText(nc.toString(), el);
  } else {
    if (typeof oc !== 'string') {
      if (Array.isArray(oc) && Array.isArray(nc)) {
        patchNode(oc, nc, el, status);
      } else {
        patchNode(ocs, ncs, el, status);
      }
    } else {
      el.innerHTML = '';
      ncs.forEach((c) => mount(c, el));
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
}

function mountNode(dom, selector, status) {
  if (!state.isMounted) {
    mount((state.oldTree = dom), document.querySelector(selector));
    state.isMounted = true;
  } else {
    const newTree = dom;
    patch(state.oldTree, newTree, status);
    state.oldTree = newTree;
  }
}

async function updateView(cb, status) {
  if (typeof cb === 'function') {
    await cb();
    if (status === 'useRouter') {
      document.querySelector(state._el).innerHTML = '';
      mount(state._template(), document.querySelector(state._el));
    } else {
      mountNode(state._template(), state._el, status);
    }
  }
}

export {
  mountNode,
  updateView,
  emitEvent
}