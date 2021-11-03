import state from './state.js';
import mountNode from './diff.js';
import methods from './ways.js';

function Strve(el, v) {
  state._data = v.data;
  state._template = v.template;
  state._el = el;
  if (el) {
    if (state._template().type) {
      mountNode(state._template(), el);
      methods(v.ways);
    } else {
      throw Error('[Strve warn]:Multiple root nodes returned from render function. Render function should return a single root node.');
    }
  } else {
    throw Error('[Strve warn]:Please set el property!');
  }
}

async function updateView(cb) {
  if (typeof cb === 'function') {
    await cb();
    mountNode(state._template(), state._el);
  }
}

export { Strve, updateView };
