![project banner](https://project-banner.phamn23.repl.co/?title=Zero%20Framwork&description=The%20frameworkless%20framework&stack=js)

# Zero Framework

The frameworkless framework for building reactive UIs with web components. Builds off of my previous library, styled components, but implements a more robust and versatile diffing system without a "virtual" intermediatory.

Zero is extremely light weight at only 4.1 kb (minified).

## Usage

Start by importing `Zero.min.js` into your project.

```js
import Zero, { jsh } from "./index.js";
```

The default export is a class called `Zero`, which extends `HTMLElement` to create a custom web component. `jsh` is a utility proxy that allows you to crete elements through functions, as opposed to verbose Vanilla DOM methods.

### Javascript Hyperfunctions (JSH)

JSH is extremely intuitive. Any "key" in the `jsh` export serves as an html tag that takes a dictionary of attributes and child elements. You can nest jsh tags in other jsh tags.

```js
jsh.p({ style: "color: red;" }, "This is a paragraph.");
```

Camel case tag names are automatically converted to snake case for convenience.

```js
jsh.zCounter(); // => <z-counter></z-counter>
```

You can also create jsh fragments to return multiple elements without adding a wrapper (like a div) to the DOM.

```js
// fragments cannot have attributes, any passed through will be ignored
jsh.fragment({}, jsh.p({}, "Hello World"), jsh.p({}, "Yippee"));
```

### Creating Components

Syntax-wise, Zero is similar to a React class component. For example, anything returned from `render` will be added to the component Shadow DOM. You must extend the `Zero` class and use the `Zero.define` method to create a web component with access to the lifecycle and internal methods.

```js
Zero.define("z-counter", class ZCounter extends Zero {
    render() {
        return (
            jsh.p({ style: "color: red;" }, "This is a paragraph.");
        )
    }
});
```

```html
<!-- after defining the component you can use it directly in html or append it to the document with jsh -->
<z-counter></z-counter>
```

Zero also has several "lifecycle" and internal methods.

#### State

By default, `Zero.state` is converted into a Proxy that updates the DOM when it is changed. Although I have not run any benchmarks, Zero should be fairly fast because it uses a diffing algorithm rather than replacing the entire DOM.

```js
class ZCounter extends Zero {
    state = { counter: 0 };

    render() {
        return jsh.button({}, `counter: ${this.state.counter}`);
    }
}
```

#### Props

Properties or attributes passed into the web component are accessible with `Zero.props`.

```html
<z-counter href="link"></z-counter>
<!-- this.props.href = "link" -->
```

#### Mount and Unmount

`Zero.mount` is triggered when the element is added to the DOM.  
`Zero.unmount` is triggered when the element is removed from the DOM.

Like React, you can use these methods to add and remove event listeners.

#### Style

Styles are scoped to the web component and can either be static or dynamic.

Static styles are simply a string.

```js
class ZCounter extends Zero {
    style = `
        p {
            color: red;
        }
    `;
}
```

Dyanmic styles are functions that can change depending on state.

```js
class ZCounter extends Zero {
    style() {
        return `
            p {
                color: ${this.state.counter > 10 ? "red" : "blue"} 
            }
        `;
    }
}
```
