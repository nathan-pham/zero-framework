// convert camel case to snake case
export const camelToSnake = (str) => {
    let snakeCase = "";

    for (const char of str) {
        const charLower = char.toLowerCase();
        snakeCase += charLower === char ? char : `-${charLower}`;
    }

    return snakeCase.toLowerCase();
};

// create elements in js more easily
const h = (tag, props = {}, children = []) => {
    const element = document.createElement(tag);

    // set props & event listeners
    for (const [key, value] of Object.entries(props)) {
        key.startsWith("on")
            ? element.addEventListener(key.substring(2).toLowerCase(), value)
            : element.setAttribute(key, value);
    }

    // loop through the children
    for (const child of children.flat(Infinity).filter((c) => c)) {
        typeof child == "string"
            ? element.appendChild(document.createTextNode(child))
            : element.appendChild(child);
    }

    return element;
};

export const jsh = new Proxy(
    {},
    {
        get:
            (_, tag) =>
            (props, ...children) =>
                h(camelToSnake(tag), props, children),
    }
);

// mock jquery to select elements
export const $ = (parent, selector) => {
    return parent && selector
        ? parent.querySelector(selector)
        : document.body.querySelector(parent);
};

export const $$ = (parent, selector) => {
    return [
        ...(parent && selector
            ? parent.querySelectorAll(selector)
            : document.body.querySelectorAll(parent)),
    ];
};

// is type a function
export const isFunction = (prop) => typeof prop === "function";
