function eventListener(el, event, cb) {
    document.querySelector(el).addEventListener(event, cb);
}

export {
    eventListener
}