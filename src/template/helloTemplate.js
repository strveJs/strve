import { html } from "../strve"
import logo from '../assets/logo.png';
import './helloTemplate.css';

export default html`
<div class="container">
  <img src="${logo}"/>
  <h1>Hello Strview.js</h1>
</div>
`;
