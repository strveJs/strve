import { createView } from './strve';
import data from './data';
import App from './App';
import methods from './methods';

// init
function init(_app) {
  createView({
    el: "#app",
    template: _app ? _app.default : App,
    data: data
  });
  // The event is handled after the createview API
  methods();
}

// HMR
if (import.meta.hot) {
  init();
  import.meta.hot.accept('./App.js', (_app) => {
    init(_app);
  })
}