import state from './state.js'

const reg = new RegExp("\{(.+?)\}");

function mount(vnode, container, anchor) {
    const el = document.createElement(vnode.type);
    vnode.el = el;

    if (vnode.props) {
        for (const key in vnode.props) {
            if (typeof vnode.props[key] === "string" && reg.test(vnode.props[key])) {
                const ikey = reg.exec(vnode.props[key])[1];
                vnode.props[key] = vnode.props[key].replace(reg, state._data[ikey]);
            }
            el.setAttribute(key, vnode.props[key]);
        }
    }
    if (vnode.children) {
        if (typeof vnode.children[0] === "string") {
            toValue(vnode.children[0], el);
        } else {
            vnode.children.forEach(child => {
                mount(child, el);
            });
        }
    }
    if (anchor) {
        container.insertBefore(el, anchor)
    } else {
        container.appendChild(el);
    }
}

function patch(n1, n2) {
    if (n1.type !== n2.type) {
        const parent = n1.el.parentNode
        const anchor = n1.el.nextSibling
        parent.removeChild(n1.el)
        mount(n2, parent, anchor)
        return
    }

    const el = n2.el = n1.el

    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    for (const key in newProps) {
        let newValue = newProps[key]
        let oldValue = oldProps[key]
        if (newValue != null) {
            if (newValue !== oldValue) {
                if (reg.test(newValue)) {
                    const key = reg.exec(newValue)[1];
                    if (state._data.hasOwnProperty(key)) {
                        newValue = state._data[key];
                    }
                    else {
                        newValue = eval(`state._data.${key}`);
                    }
                }
                el.setAttribute(key, newValue)
            }
        } else {
            el.removeAttribute(key)
        }

    }
    for (const key in oldProps) {
        if (!(key in newProps)) {
            el.removeAttribute(key)
        }
    }

    const oc = n1.children
    const nc = n2.children
    if (typeof nc[0] === 'string') {
        toValue(nc[0], el);
    } else if (Array.isArray(nc) && nc[0] !== 'string') {
        if (Array.isArray(oc) && oc[0] !== 'string') {
            const commonLength = Math.min(oc.length, nc.length)
            for (let i = 0; i < commonLength; i++) {
                patch(oc[i], nc[i])
            }
            if (nc.length > oc.length) {
                nc.slice(oc.length).forEach(c => mount(c, el))
            } else if (oc.length > nc.length) {
                oc.slice(nc.length).forEach(c => {
                    el.removeChild(c.el)
                })
            }
        } else {
            el.innerHTML = ''
            nc.forEach(c => mount(c, el))
        }
    }
}

function testVal(val, el, _val) {
    val = val.replace(reg, _val);
    reg.test(val) ? toValue(val, el) : el.textContent = val;
}

function toValue(val, el) {
    if (reg.test(val)) {
        const key = reg.exec(val)[1];
        state._data.hasOwnProperty(key) ? testVal(val, el, state._data[key]) : testVal(val, el, eval(`state._data.${key}`));
    } else {
        el.textContent = val;
    }
}

// Mount node
function mountNode(render, selector) {
    if (!state.isMounted) {
        mount(state.oldTree = render, document.querySelector(selector));
        state.isMounted = true;
    } else {
        const newTree = render;
        patch(state.oldTree, newTree);
        state.oldTree = newTree;
    }

}

export default mountNode