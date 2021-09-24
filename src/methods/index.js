import { eventListener } from '../strve';
import { useItem } from './item';

const eventList = [
    ['.color-red', 'click', useItem]
]

function methods() {
    for (let index = 0; index < eventList.length; index++) {
        const element = eventList[index];
        eventListener(...element);
    }
}

export default methods