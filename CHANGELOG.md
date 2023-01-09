## v5.1.1 (Latest)

- Add the compile module;
- Adjust the source code warehouse building module;
- Different versions:
  1. Full version: both the compiler (code used to compile template strings into JavaScript rendering functions) and the runtime version are included;
  2. Runtime: code used to create instances, render and process virtual DOM. Basically, it is to remove everything else from the compiler;
- The prefix of listening events can be abbreviated as @;
- Introducing compilers: Develop a babel plugin [(babel-plugin-strve)](https://www.npmjs.com/package/babel-plugin-strve) to render the HTML template string into a Virtual Dom, which is transferred from the previous runtime to the compilation time;
- Introducing Web Components:
  1. New defineCustomElement API supports the introduction of Web Components;
  2. Support for Web Components UI frameworks (e.g. https://quark-design.hellobike.com/);
  3. Add the customElement field in the setDataAPI to update the component view as needed;
