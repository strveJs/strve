/*!
 * Strve.js v1.1.7
 * (c) 2021-2021 maomincoding
 * Released under the MIT License.
 */
const state = {
  _el: null,
  _data: null,
  _template: null,
  oldTree: null,
  isMounted: false,
};

// init
function Strve(el, v) {
  state._data = v.data;
  state._template = v.template;
  state._el = el;
  if (el && state._template().type) {
    mountNode(state._template(), el);
  }
}

async function updateView(cb) {
  if (typeof cb === 'function') {
    await cb();
    mountNode(state._template(), state._el);
  }
}

// diff
const reg = new RegExp('{(.+?)}');

function safeGet(obj, path) {
  try {
    return path.split('.').reduce((o, k) => o[k], obj);
  } catch (e) {
    return undefined;
  }
}

function remove({ el, key, oldProps }) {
  el.removeAttribute(key);
  if (key.startsWith('on')) {
    el.removeEventListener(key.split('on')[1], oldProps[key], false);
  }
}

function add(el, props) {
  for (let index = 0; index < Object.keys(props).length; index++) {
    const element = Object.keys(props)[index].toString();
    if (element.startsWith('on')) {
      el.addEventListener(element.split('on')[1], props[element], false);
    }
  }
}

function toVal(val, el, _val) {
  if (_val) {
    val = val.replace(reg, _val);
  }

  if (reg.test(val)) {
    const key = reg.exec(val)[1];
    state._data.hasOwnProperty(key) ? toVal(val, el, state._data[key]) : toVal(val, el, safeGet(state._data, key.toString()));
  } else {
    el.textContent = val.toString();
    return;
  }
}

function mount(vnode, container, anchor) {
  if (vnode.type) {
    const el = document.createElement(vnode.type);
    vnode.el = el;

    if (vnode.props) {
      add(el, vnode.props);

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
        toVal(vnode.children[0], el);
      } else if (typeof vnode.children[0] === 'number') {
        toVal(vnode.children[0].toString(), el);
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

  add(el, newProps);

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
    toVal(nc[0], el);
  } else if (typeof nc[0] === 'number') {
    toVal(nc[0].toString(), el);
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

// vdom
function ht(type, props, ...children) {
  return { type, props, children };
}

let n = function (t, s, r, e) {
  let u;
  s[0] = 0;
  for (let h = 1; h < s.length; h++) {
    let p = s[h++],
      a = s[h] ? ((s[0] |= p ? 1 : 2), r[s[h++]]) : s[++h];
    if (a) {
      3 === p
        ? (e[0] = a)
        : 4 === p
          ? (e[1] = Object.assign(e[1] || {}, a))
          : 5 === p
            ? ((e[1] = e[1] || {})[s[++h]] = a)
            : 6 === p
              ? (e[1][s[++h]] += a + '')
              : p
                ? ((u = t.apply(a, n(t, a, r, ['', null]))), e.push(u), a[0] ? (s[0] |= 2) : ((s[h - 2] = 0), (s[h] = u)))
                : e.push(a);
    }
  }
  return e;
};

let t = new Map();

function vnode(s) {
  let r = t.get(this);
  return (
    r || ((r = new Map()), t.set(this, r)),
    (r = n(
      this,
      r.get(s) ||
      (r.set(
        s,
        (r = (function (n) {
          let t,
            s,
            r = 1,
            e = '',
            u = '',
            h = [0],
            p,
            a = 0;
          for (
            t,
            s,
            r,
            e,
            u,
            h,
            p = function (n) {
              1 === r && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, '')))
                ? h.push(0, n, e)
                : 3 === r && (n || e)
                  ? (h.push(3, n, e), (r = 2))
                  : 2 === r && '...' === e && n
                    ? h.push(4, n, 0)
                    : 2 === r && e && !n
                      ? h.push(5, 0, !0, e)
                      : r >= 5 && ((e || (!n && 5 === r)) && (h.push(r, 0, e, s), (r = 6)), n && (h.push(r, n, 0, s), (r = 6))),
                (e = '');
            },
            a;
            a < n.length;
            a++
          ) {
            a && (1 === r && p(), p(a));
            for (let l = 0; l < n[a].length; l++)
              (t = n[a][l]),
                1 === r
                  ? '<' === t
                    ? (p(), (h = [h]), (r = 3))
                    : (e += t)
                  : 4 === r
                    ? '--' === e && '>' === t
                      ? ((r = 1), (e = ''))
                      : (e = t + e[0])
                    : u
                      ? t === u
                        ? (u = '')
                        : (e += t)
                      : '"' === t || "'" === t
                        ? (u = t)
                        : '>' === t
                          ? (p(), (r = 1))
                          : r &&
                          ('=' === t
                            ? ((r = 5), (s = e), (e = ''))
                            : '/' === t && (r < 5 || '>' === n[a][l + 1])
                              ? (p(), 3 === r && (h = h[0]), (r = h), (h = h[0]).push(2, 0, r), (r = 0))
                              : ' ' === t || '\t' === t || '\n' === t || '\r' === t
                                ? (p(), (r = 2))
                                : (e += t)),
                3 === r && '!--' === e && ((r = 4), (h = h[0]));
          }
          return p(), h;
        })(s))
      ),
        r),
      arguments,
      []
    )).length > 1
      ? r
      : r[0]
  );
}

const render = vnode.bind(ht);

export { Strve, updateView, render };
