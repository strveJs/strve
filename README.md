<p align="center">
  <a href="" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://www.maomin.club/site/strvejs/logo.png" alt="Strve logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/strvejs"><img src="https://badgen.net/npm/v/strvejs" alt="npm package"></a>
</p>
<br/>

# Strve

> A JS library that can convert strings into view.

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
        import { Strve, render, useEvent, updateView } from 'https://cdn.jsdelivr.net/npm/strvejs@1.0.4/dist/strve.esm.min.js';

        const state = {
            arr: ['1', '2'],
        };

        function App() {
            return render`
              <div class='inner'>
                  <button id='btn2'>push</button>
                  <ul>
                    ${state.arr.map((todo) => render`<li key=${todo}>${todo}</li>`)}
                  </ul>
              </div>
          `;
        }

        Strve('#app', {
            data: Object.assign(state),
            template: App,
            ways: [useEvent('#btn2', 'click', f2)],
        });

        function f2() {
            updateView(() => {
                state.arr.push('3');
            });
        }
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

```js
import { Strve, useEvent } from 'strvejs';

const state = {
    arr: ['1', '2'],
};

function App() {
    return render`
    <div class='inner'>
        <button id='btn2'>push</button>
        <ul>
            ${state.arr.map((todo) => render`<li key=${todo}>${todo}</li>`)}
        </ul>
    </div>
`;
}

Strve('#app', {
    data: Object.assign(state),
    template: App,
    ways: [useEvent('#btn2', 'click', f2)],
});

function f2() {
    updateView(() => {
        state.arr.push('3');
    });
}

```

## Documentation

To learn more about Strve, check [its documentation]().

## License

[MIT](http://opensource.org/licenses/MIT)
