<p align="center">
  <a href="https://github.com/maomincoding/strve" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://maomincoding.github.io/strvejs-doc/logo.png" alt="Strve logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/strvejs"><img src="https://badgen.net/npm/v/strvejs" alt="npm package"></a>
</p>
<br/>

# Strve.js

A JS library that can convert strings into view.

- Easier to get started.
- Blazing Fast Virtual DOM.
- Flexible manipulation of code blocks.

## Introduce

The pronunciation of Strve.js /str'vi/ is the splicing of a string (String) and a view (View). Strve.js is a JS library that can convert strings to views. The strings here refer to template strings, so you only need to develop the view in JavaScript. The view here refers to the HTML page we usually write, that is, the view layer.

Strve.js is not only easy to use, but also flexible to disassemble different code blocks. Using template strings to develop views mainly takes advantage of the capabilities of native JavaScript, which allows for more flexible separation of code blocks, and you only focus on JavaScript files.

Strve.js is another lightweight MVVM framework, you only need to care about the data and how to operate it, and leave the rest to Strve.js for internal processing. Strve.js first converts the template string into a virtual DOM, and then performs the Diff algorithm to update the real DOM by comparing the state differences between the two before and after. This is also the solution used by many frameworks to improve browser performance, but Strve.js is more lightweight.

## Started

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Strve.js</title>
	</head>

	<body>
		<div id="app"></div>
		<script type="module">
			import {
				h,
				createApp,
				setData,
			} from 'https://cdn.jsdelivr.net/npm/strvejs@3.1.0/dist/strve.esm.min.js';

			const state = {
				count: 0,
			};

			function App() {
				return h`
                    <h1 $key>${state.count}</h1>
                    <button onClick=${add}>Add</button> 
                `;
			}

			function add() {
				setData(() => {
					state.count++;
				});
			}

			const app = createApp(App);
			app.mount('#app');
		</script>
	</body>
</html>
```

## Documentation

To learn more about Strve, check [its documentation](https://maomincoding.github.io/strvejs-doc/).

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2021-present, maomincoding
