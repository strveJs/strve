import { reactive, ref } from '../strve'

function executes() {
    console.log("点击了")
    reactive().obj.a.b = 3;
    ref().name = 'Strview.js';
}
function useItem() {
    ref().a = 100;
}

export {
    executes,
    useItem
}