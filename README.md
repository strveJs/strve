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
- 📦 The size of the source code file is only 4KB.
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
    <title>Hello Strve.js</title>
</head>

<body>
    <div id="app"></div>
    <script type="module">
        import { Strve, updateView, render } from 'https://cdn.jsdelivr.net/npm/strvejs/dist/strve.esm.js';

        const state = {
            arr: ['1', '2'],
            msg: 'hello',
            a: 1
        };

        function App() {
            return render`
              <div class='inner'>
                  <p>{state.msg}</p>
                  <p>${state.a + state.a}</p> 
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
## Documentation

To learn more about Strve, check [its documentation](https://www.maomin.club/site/strvejs/).

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2021-present, maomincoding
