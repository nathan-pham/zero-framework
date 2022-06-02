import ZeroDOM from "./ZeroDOM.js";
import ZeroStore from "./ZeroStore.js";
import { isFunction } from "./utils.js";

export default class Zero extends HTMLElement {
    props = {};
    store = {};
    style = "";

    _debounce = null;
    _mounted = false;

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
    _createStore() {
        this.store =
            this.store instanceof ZeroStore
                ? this.store
                : new ZeroStore(this.store);

        this.store.addSubscription(() => {
            this._updateDOM();
        });
    }

    // handle mounting & unmounting components
    connectedCallback() {
        if (this._debounce) {
            cancelAnimationFrame(this._debounce);
        }

        this._debounce = requestAnimationFrame(() => {
            if (!this._mounted) {
                this._internalMount();
                if (isFunction(this.mount)) {
                    this.mount();
                }
            }
        });
    }

    disconnectedCallback() {
        if (isFunction(this.unmount)) {
            this.unmount();
        }
    }

    _internalMount() {
        this._createProps();
        this._createStore();

        this._updateDOM(true);
        this._trackMutations();

        this._mounted = true;
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
        this.props = props;
    }

    // update DOM & styles
    _updateDOM(genesis) {
        const rendered = this.render();

        if (rendered) {
            if (genesis) {
                this.shadowRoot.appendChild(rendered);
            } else {
                const isFragment =
                    ZeroDOM._getNodeType(rendered) === "fragment";

                ZeroDOM.diff(
                    rendered,
                    isFragment ? this.shadowRoot : this.shadowRoot.firstChild
                );

                this._updateStyles();
            }
        } else {
            this.shadowRoot.innerHTML = "";
        }
    }

    _updateStyles() {
        if (this._styleElement) {
            this._styleElement = document.createElement("style");
            this.shadowRoot.appendChild(this._styleElement);
        }

        // prettier-ignore
        // set new styles
        const newStyle = isFunction(this.style) ? this.style() : this.style
        if (newStyle && newStyle !== this._styleElement.textContent) {
            this._styleElement.textContent = newStyle;
        }
    }
}
