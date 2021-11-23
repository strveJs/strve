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
## Usage

### CDN

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

### Install the plugin

```bash
yarn add strvejs
# or with npm
npm install strvejs
```

## Documentation

To learn more about Strve, check [its documentation](https://www.maomin.club/site/strvejs/).

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2021-present, maomincoding
