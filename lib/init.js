import { mountNode } from './diff';
export const version = '__VERSION__';
export const state = {
    _el: null,
    _template: null,
    oldTree: null,
    isMounted: false,
    observer: null,
};
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
                console.warn(`[Strve warn]: Failed to mount app: mount target selector "${container}" returned null.`);
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
        console.warn(`[Strve warn]: mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs.`);
        return null;
    }
    else {
        return null;
    }
}
export function createApp(template) {
    const app = {
        mount(el) {
            if (normalizeContainer(el)) {
                const tem = template();
                state._template = template;
                state._el = normalizeContainer(el);
                state._el && mountNode(tem, state._el);
            }
            else {
                console.warn('[Strve warn]: There must be a mount element node.');
            }
        },
    };
    return app;
}
