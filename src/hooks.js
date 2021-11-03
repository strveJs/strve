function eventListener(el, event, cb) {
  document.querySelector(el).addEventListener(event, cb);
}

function useEvent(el, event, cb) {
  return {
    el,
    event,
    cb,
  };
}

export { useEvent, eventListener };
