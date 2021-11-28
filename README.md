<p align="center">
  <a href="https://github.com/maomincoding/strve" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://www.maomin.club/site/strvejs/logo.png" alt="Strve logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/strvejs"><img src="https://badgen.net/npm/v/strvejs" alt="npm package"></a>
</p>
<br/>

# Strve.js

A JS library that can convert strings into view.

- ⚡️ Blazing Fast Virtual DOM.
- 📦 Only 8KB before compression.
- 🗂 Easy to flexibly disassemble and assemble different code blocks.

## Introduce

Strve.js is a JS library that can convert strings into views. The string here refers to the template string, so you only need to develop the view in JavaScript. Strve.js is not only easy to use, but also easy to flexibly disassemble and assemble different code blocks.

## Started

The easiest way to try `Strve.js` is to use the direct import CDN link. You can open it in your browser and follow the examples to learn some basic usage.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strve.js</title>
</head>

<body>
    <div id="app"></div>
    <script type="module">
        import { Strve, render, updateView } from 'https://cdn.jsdelivr.net/npm/strvejs/dist/strve.esm.min.js';

        const state = {
            arr: ['1', '2'],
        };

        function App() {
            return render`
              <div class='inner'>
                  <button id='btn2' onclick=${usePush}>push</button>
                  <ul>
                    ${state.arr.map((todo) => render`<li key=${todo}>${todo}</li>`)}
                  </ul>
              </div>
          `;
        }

        function usePush() {
            updateView(() => {
                state.arr.push('3');
            });
        }

        Strve('#app', {
            data: { state },
            template: App
        });
    </script>
</body>

</html>
```
## Usage

### API

`Strve.js` currently only has three APIs.

- Strve
- render
- updateView

Is not it simple! Come and see what these three APIs mean? How to use them?

#### Strve

- Parameter:
    - `string`
    - `object`

- Detailed:

Initialize `Strve.js`. The first parameter is the name of the node selector that needs to be mounted to the HTML page. The second parameter is passed in an object, the first attribute `data` means the state object, and the second attribute `template` means the template function.

```js
Strve('#app', {
    data: { state },
    template: App
});
```
#### render

- Type:`Function`
- Detailed:

`render`` ` is a label function. The syntax of the label function is to directly follow the function name with a template string and get the parameters from the interpolation expression in the template string. For example, you can write HTML tags directly in the template string.

```js
function App() {
    return render`
        <div class='inner'>
            <h1>Hello</h1>
        </div >
    `;
}
```

#### updateView

- Parameter:
    - `Function`
- Detailed:
  
It has only one parameter, and this parameter is a function. The function body needs to be executed to change the value of the page state, such as `state.msg` in the following example.

```js
const state = {
    msg:'1'
};

function App() {
    return render`
        <div class='inner'>
            <button onclick=${useChange}>change</button>
            <p>{state.msg}</p>
        }
        </div >
    `;
}

function useChange() {
    updateView(() => {
        state.msg = '2';
    });
}
```



### Interpolation

`Strve.js` uses JavaScript-based template string syntax, allowing developers to declaratively bind the DOM to the data of the underlying instance. All template strings of `Strve.js` are legal HTML, so they can be parsed by browsers and HTML parsers that follow the specification.

In the underlying implementation, `Strve.js` compiles the template string into a virtual DOM rendering function and minimizes the number of DOM operations.

In `Strve.js`, you can use JavaScript template strings to your heart's content and feel its unique charm!

#### Text

The most common form of data binding is text interpolation using the symbol `${}`:

```js
const state = {
    msg: 'hello'
};

function App() {
    return render`
        <div class='inner'>
            <p>${state.msg}</p>
        </div >
    `;
}
```

In addition, you can also use the more convenient method symbol `{}`, which can also achieve the desired effect.

```js
const state = {
    msg: 'hello'
};

function App() {
    return render`
        <div class='inner'>
            <p>{state.msg}</p>
        </div >
    `;
}
```
However, the use of this symbol `{}` needs to be noted that it is only suitable for text interpolation within the label. For example, in the following situation, it does not work, but you can use the powerful symbol `${}`.

```js
// Bad
function App() {
    return render`
        <div class='inner'>
            <input type="text" value={state.msg}/>
        }
        </div >
    `;
}

// Good
function App() {
    return render`
        <div class='inner'>
            <input type="text" value=${state.msg}/>
        }
        </div >
    `;
}
```

#### Expression

Currently, only expressions in the symbol `${}` are supported. E.g,

```js
const state = {
    a: 1,
    b: 2
};

function App() {
    return render`
        <div class='inner'>
            <p>${String(state.a + state.b)}</p>
        }
        </div >
    `;
}
```

### Property binding

Earlier, we can see that the use of the symbol `${}` can bind the value to the property `value`.

```js
function App() {
    return render`
        <div class='inner'>
            <input type="text" value=${state.msg}/>
        }
        </div >
    `;
}
```

In addition, you can also bind other attributes, such as `class`.

```js
const state = {
    isRed: true
};

function App() {
    return render`
    <div class='inner'>
        <p class=${state.isRed ? 'red' : ''}>Strve.js</p>
    </div >
`;
}
```

### Conditional rendering

We can also use the symbol `${}`, this piece of content will only be rendered when the expression of the instruction returns a value of `true`.

```js
const state = {
    isShow: false
};

function App() {
    return render`
        <div class='inner'>
            <button onclick=${useShow}>show</button>
            ${state.isShow ? render`<p>Strve.js</p>` : ''
        }
        </div >
    `;
}

function useShow() {
    updateView(() => {
        state.isShow = !state.isShow;
    });
}
```

### List rendering

We can use the symbol `${}` to render a list based on an array. For example, we use the `map` method of arrays to render the list, and we can add array items dynamically.

```js
const state = {
    arr: ['1', '2']
};

function App() {
    return render`
        <div class='inner'>
            <button onclick=${usePush}>push</button>
            <ul>
            ${state.arr.map((todo) => render`<li key=${todo}>${todo}</li>`)}
            </ul>
        }
        </div >
    `;
}

function usePush() {
    updateView(() => {
        state.arr.push('3');
    });
}

```

### Event handling

We can use the native `onclick` instruction to listen to DOM events and execute some JavaScript when the event is triggered. Need to use the symbol `${}` to bind events.

```js
function App() {
    return render`
        <div class='inner'>
            <button onclick=${useClick}>sayHello</button>
        }
        </div >
    `;
}

function useClick() {
    console.log('hello');
}
```
### Pair with Vue.js

`Strve.js` can be used not only alone, but also with [Vue.js]('https://v3.vuejs.org/'). You need to call the `Strve()` registration method after the Vue instance is mounted, and the first parameter already exists in the `template` tag.

**App.vue**
```html
<template>
  <div id="container">
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld ,{hello} from './components/HelloWorld.vue';
import { about,state } from './components/About.vue';
import { render, Strve } from "strvejs";
const AppTm = () => render`
      <div>
        ${hello()}
        ${about()}
      </div>
`;
export default {
  name: "App",
  components:{
    HelloWorld
  },
  mounted() {
    Strve("#container", {
      data: {state},
      template: AppTm,
    });
  },
};
</script>
```
If you need to share a method with Vue, it is recommended to use it in the `setup` method.

**HelloWorld.vue**
```html
<template>
  <div>
    <img src="../assets/logo.png" alt="" @click="useCliimg">
  </div>
</template>
<script>
import { render } from "strvejs";
import styles from '../assets/hello/hello.module.css';

export const hello = ()=>render`
<h2 class="${styles.color}" onclick=${useCliimg}>hello</h2>
`
function useCliimg(){
    console.log(1);
}

export default {
  name:'HelloWorld',
  setup(){
    return {
      useCliimg
    }
  }
}
</script>

```
If you want to fully use `Strve.js` in Vue components, of course you can. But in the end, it is recommended to use `export default` to export component names.

**About.vue**
```html
<script>
import { render, updateView } from "strvejs";
import styles from '../assets/about/about.module.css';

export const about = ()=>render`
<div>
    <p>{state.msg}</p>
   <h2 class="${styles.color}" onclick=${useClick}>about</h2>
</div>
`
export const state = {
    msg:"hello"
}

function useClick() {
    updateView(()=>{
        state.msg = 'world';
    })
}
export default {
    name:"About"
}
</script>

```

### Pair with React.js
Compared with the combination of `Strve.js` and [Vue.js]('https://v3.vuejs.org/'), it is better to use it with [React.js]('https://reactjs.org/') For flexibility. It is also necessary to call the `Strve()` method registration method after the first rendering of the component is completed.

**App.js**
```js
import {useEffect} from 'react'
import {Strve,render,updateView} from 'strvejs';
import './App.css';

const state = {
  msg:"Hello"
}

function Home(){
  return render`<h1 onclick=${useClick}>{state.msg}</h1>`
}

function useClick(){
  updateView(()=>{
    state.msg = "World";
  })
}

function App() {
  useEffect(()=>{
    Strve(".App",{
      data:{state},
      template: Home
    })
  })
  return (<div className="App"></div>);
}

export default App;
```
## Documentation

To learn more about Strve, check [its documentation](https://www.maomin.club/site/strvejs/).

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2021-present, maomincoding
