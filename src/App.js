import { html } from "./strve"
import helloTemplate from './template/helloTemplate';
import './style/index.css';

const App = html`
<div class="content">
    ${helloTemplate}
    <button class="color-red">点击111</button>
    <p class="txt">{a}，{b}，{name}，（a和b都改变）</p>
    <input value="{a}"/>
    <ul class="list">
      <li>{age}</li>
      <li>
      <div>
        {name}
      </div>
      </li>
      <li>{msg}</li>
    </ul>
    <p class="txt">{a}，（a会改变）</p>
    <p class="txt">{b}，（b会改变）</p>
    <p>{obj.a.b}</p>
    <p>{arr}</p>
    <p>{ob.name}</p>
</div>
`
export default App