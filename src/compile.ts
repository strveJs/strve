const MODE_SLASH: number = 0;
const MODE_TEXT: number = 1;
const MODE_WHITESPACE: number = 2;
const MODE_TAGNAME: number = 3;
const MODE_COMMENT: number = 4;
const MODE_PROP_SET: number = 5;
const MODE_PROP_APPEND: number = 6;

const CHILD_APPEND: number = 0;
const CHILD_RECURSE: number = 2;
const TAG_SET: number = 3;
const PROPS_ASSIGN: number = 4;
const PROP_SET: number = MODE_PROP_SET;
const PROP_APPEND: number = MODE_PROP_APPEND;

const evaluate = (
  h: any,
  built: Array<any>,
  fields: IArguments,
  args: Array<any>
) => {
  let tmp;

  built[0] = 0;

  for (let i = 1; i < built.length; i++) {
    const type = built[i++];

    const value = built[i]
      ? ((built[0] |= type ? 1 : 2), fields[built[i++]])
      : built[++i];

    if (type === TAG_SET) {
      args[0] = value;
    } else if (type === PROPS_ASSIGN) {
      args[1] = Object.assign(args[1] || {}, value);
    } else if (type === PROP_SET) {
      (args[1] = args[1] || {})[built[++i]] = value;
    } else if (type === PROP_APPEND) {
      args[1][built[++i]] += value + "";
    } else if (type) {
      tmp = h.apply(value, evaluate(h, value, fields, ["", null]));
      args.push(tmp);

      if (value[0]) {
        built[0] |= 2;
      } else {
        built[i - 2] = CHILD_APPEND;
        built[i] = tmp;
      }
    } else {
      args.push(value);
    }
  }

  return args;
};

const build = function (this: any, statics: any) {
  let mode: number = MODE_TEXT;
  let buffer = "";
  let quote = "";
  let current: any = [0];
  let char, propName: number | string;

  const commit = (field?: any) => {
    if (
      mode === MODE_TEXT &&
      (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, "")))
    ) {
      current.push(CHILD_APPEND, field, buffer);
    } else if (mode === MODE_TAGNAME && (field || buffer)) {
      current.push(TAG_SET, field, buffer);
      mode = MODE_WHITESPACE;
    } else if (mode === MODE_WHITESPACE && buffer === "..." && field) {
      current.push(PROPS_ASSIGN, field, 0);
    } else if (mode === MODE_WHITESPACE && buffer && !field) {
      current.push(PROP_SET, 0, true, buffer);
    } else if (mode >= MODE_PROP_SET) {
      if (buffer || (!field && mode === MODE_PROP_SET)) {
        current.push(mode, 0, buffer, propName);
        mode = MODE_PROP_APPEND;
      }
      if (field) {
        current.push(mode, field, 0, propName);
        mode = MODE_PROP_APPEND;
      }
    }

    buffer = "";
  };

  for (let i = 0; i < statics.length; i++) {
    if (i) {
      if (mode === MODE_TEXT) {
        commit();
      }
      commit(i);
    }

    for (let j = 0; j < statics[i].length; j++) {
      char = statics[i][j];

      if (mode === MODE_TEXT) {
        if (char === "<") {
          commit();
          current = [current];
          mode = MODE_TAGNAME;
        } else {
          buffer += char;
        }
      } else if (mode === MODE_COMMENT) {
        if (buffer === "--" && char === ">") {
          mode = MODE_TEXT;
          buffer = "";
        } else {
          buffer = char + buffer[0];
        }
      } else if (quote) {
        if (char === quote) {
          quote = "";
        } else {
          buffer += char;
        }
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === ">") {
        commit();
        mode = MODE_TEXT;
      } else if (!mode) {
      } else if (char === "=") {
        mode = MODE_PROP_SET;
        propName = buffer;
        buffer = "";
      } else if (
        char === "/" &&
        (mode < MODE_PROP_SET || statics[i][j + 1] === ">")
      ) {
        commit();
        if (mode === MODE_TAGNAME) {
          current = current[0];
        }
        mode = current;
        (current = current[0]).push(CHILD_RECURSE, 0, mode);
        mode = MODE_SLASH;
      } else if (
        char === " " ||
        char === "\t" ||
        char === "\n" ||
        char === "\r"
      ) {
        commit();
        mode = MODE_WHITESPACE;
      } else {
        buffer += char;
      }

      if (mode === MODE_TAGNAME && buffer === "!--") {
        mode = MODE_COMMENT;
        current = current[0];
      }
    }
  }
  commit();
  return current;
};

const CACHES = new Map();

const regular = function (this: any, statics: any) {
  let tmp = CACHES.get(this);
  if (!tmp) {
    tmp = new Map();
    CACHES.set(this, tmp);
  }
  tmp = evaluate(
    this,
    tmp.get(statics) || (tmp.set(statics, (tmp = build(statics))), tmp),
    arguments,
    []
  );
  return tmp.length > 1 ? tmp : tmp[0];
};

const createVNode = function (tag: string, props: any, child: any) {
  let key: any = null;
  let el: any = null;
  let i: string = null;
  let children: any = null;

  for (i in props) {
    if (i === "key") key = props[i];
  }

  if (arguments.length > 2) {
    children =
      arguments.length > 3 ? Array.prototype.slice.call(arguments, 2) : child;
  }

  // Vnode
  return {
    tag,
    props,
    children,
    key,
    el,
  };
};

export const html = regular.bind(createVNode);
