import { eventListener } from './hooks.js';

function ways(eventList) {
  for (let index = 0; index < eventList.length; index++) {
    const element = eventList[index];
    eventListener(element.el, element.event, element.cb, element.isUpdate);
  }
}

export default ways;
