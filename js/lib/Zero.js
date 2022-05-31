import ZeroDOM from "./ZeroDOM.js";
import { isFunction } from "./utils.js";

export default class Zero extends HTMLElement {
    props = {};
    state = {};
    style = "";

    constructor() {
        super();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        }
    }

    // create new custom web component
    static define(name, component) {
        customElements.define(name, component);
    }

    // empty methods (overwrite in extended components)
    render() {}
    mount() {}
    unmount() {}

    // convert state into a Proxy
    _createStore(state) {
        const stateHandler = {
            set: (target, key, value) => {
                target[key] = createProxy(value);
                this._updateDOM();
                return true;
            },
        };

        const createProxy = (variable = {}) => {
            if (Array.isArray(variable)) {
                for (let i = 0; i < variable.length; i++) {
                    variable[i] = createProxy(variable);
                }
            } else {
                for (const [key, value] of Object.entries(variable)) {
                    variable[key] = createProxy(value);
                }
            }

            const canProxy =
                (typeof variable == "object" || Array.isArray(variable)) &&
                variable !== null;

            return canProxy ? new Proxy(variable, stateHandler) : variable;
        };

        return createProxy(state);
    }

    // handle mounting & unmounting components
    connectedCallback() {
        if (isFunction(this.mount)) {
            this._internalMount();
            this.mount(this);
        }
    }

    disconnectedCallback() {
        if (isFunction(this.unmount)) {
            this.unmount(this);
        }
    }

    _internalMount() {
        this.props = this._createProps();
        this.state = this._createStore(this.state);

        this._updateDOM(true);
        this._trackMutations();
    }

    // update DOM when component changes
    _trackMutations() {
        new MutationObserver(() => {
            this._createProps();
            this._updateDOM();
        }).observe(this, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }

    // create initial properties
    _createProps() {
        const props = {};
        for (const key of this.getAttributeNames()) {
            props[key] = this.getAttribute(key);
        }

        props.children = [...this.childNodes];

        return props;
    }

    // update DOM & styles
    _updateDOM(genesis) {
        if (genesis) {
            this.shadowRoot.appendChild(this.render());
        } else {
            const rendered = this.render();
            const isFragment = ZeroDOM._getNodeType(rendered) === "fragment";

            ZeroDOM.diff(
                rendered,
                isFragment ? this.shadowRoot : this.shadowRoot.firstChild
            );
        }

        this._updateStyles();
    }

    _updateStyles() {
        if (this._styleElement) {
            this._styleElement = document.createElement("style");
            this.shadowRoot.appendChild(this._styleElement);
        }

        // prettier-ignore
        // set new styles
        const newStyle = isFunction(this.style) ? this.style(this) : this.style
        if (newStyle && newStyle !== this._styleElement.textContent) {
            this._styleElement.textContent = newStyle;
        }
    }
}
