// convert camel case to snake case
const camelToSnake = (str) => {
    if (str.startsWith("_")) {
        return str.substring(1);
    }

    let snakeCase = "";

    for (const char of str) {
        const charLower = char.toLowerCase();
        snakeCase += charLower === char ? char : `-${charLower}`;
    }

    return snakeCase.toLowerCase();
};

// create elements in js more easily
const h = (tag, props = {}, children = []) => {
    const isFragment = tag === "fragment";
    const isSvg = ["svg", "path"].includes(tag);

    // prettier-ignore
    const element = isFragment
        ? document.createDocumentFragment()
        : isSvg
            ? document.createElementNS(
                props.xmlns || "http://www.w3.org/2000/svg",
                tag
            )
            : document.createElement(tag);

    // set props & event listeners
    if (!isFragment) {
        for (const [key, value] of Object.entries(props)) {
            if (key === "style" && value.toString() === "[object Object]") {
                Object.assign(element.style, value);
            } else if (key === "__innerHTML") {
                element.innerHTML = value;
            } else {
                key.startsWith("on")
                    ? (element[key.toLowerCase()] = value)
                    : element.setAttribute(camelToSnake(key), value);
            }
        }
    }

    // loop through the children
    const formattedChildren = children.flat(Infinity).filter((c) => c);
    for (const child of formattedChildren) {
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
export const isFunction = (prop) => prop && typeof prop === "function";
