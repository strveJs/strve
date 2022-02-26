## 2.3.4 (2022-02-26)
### Features

- Added data deep copy API `deepCloneData`;
## 2.3.3 (2022-02-20)

### Features

- Parameter adjustment of `Strve` API;

## 2.3.2 (2022-02-19)

### Features

- HTML tag content supports displaying non-string types;
- The `${}` symbol is used for data binding, and the `{}` symbol is no longer supported;
- View templates support multiple root nodes;
- View template supports Text node;
- Fixed switching states during conditional rendering, and nodes could not be rendered correctly;
- Added `watchDOMChange` API for monitoring DOM tree changes;
- Added support for HTML template string highlighting (VSCode editor needs to install `es6-string-html` plugin);
- Remove the `data` attribute parameter of the `Strve` API;
- View templates support Class writing;
## 2.3.1 (2022-02-08)

### Features

- Modify some error prompts;
## 2.3.0 (2022-02-08)

### Features

- Add version number ` strveversion ` API;
- Modify the internal logic of the `updateview` API;
## 2.2.0 (2022-02-05)

### Features

- Support SVG elements;
- Optimize internal diff algorithm;
- Add necessary error prompt;
## 2.1.0 (2022-01-25)

### Features

- Fixed the problem that the DOM attribute property could not be assigned;
- Improve the logical problem of converting strings to virtual DOM;

## 2.0.0 (2022-01-23)

### Features

- Inserting data into the head of the list needs to bind the `useFkey` field to avoid repeated rendering of the `DOM` node;

- Hide the `DOM` node event method after rendering;
   
- Bind the `Style` style (object);
   
- The binding properties are uniformly bound using the `${}` symbol;
   
- Support HTML template string highlighting (VSCode editor needs to install `comment-tagged-templates` plugin);
   
- Support parent and child components to pass values to each other;

- Adapt to Bootstrap5、Tailwindcss UI framework;
