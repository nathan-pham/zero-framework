import ZeroDOM from "./ZeroDOM.js";
import ZeroStore from "./ZeroStore.js";
import { isFunction, jsh } from "./utils.js";

export default class Zero extends HTMLElement {
    props = {};
    store = {};
    _debounce = null;
    _mounted = false;

    constructor() {
        super();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(jsh.div());
        }
    }

    // create new custom web component
    static define(name, component) {
        customElements.define(name, component);
    }

    // empty methods (overwrite in extended components)
    render() {}
    style() {}
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

        this._updateStyles();

        if (genesis) {
            if (rendered) {
                this.shadowRoot.firstChild.appendChild(rendered);
            }

            return;
        }

        if (rendered) {
            const isFragment = ZeroDOM._getNodeType(rendered) === "fragment";

            ZeroDOM.diff(
                isFragment
                    ? jsh.div({}, [...rendered.childNodes])
                    : jsh.div({}, rendered),
                this.shadowRoot.firstChild
            );
        } else {
            this.shadowRoot.firstChild.innerHTML = "";
        }
    }

    _updateStyles() {
        const newStyle = isFunction(this.style) ? this.style() : this.style;

        if (!this._styleElement && newStyle) {
            this._styleElement = document.createElement("style");
            this.shadowRoot.appendChild(this._styleElement);
        }

        // prettier-ignore
        // set new styles
        if (newStyle && newStyle !== this._styleElement.textContent) {
            this._styleElement.textContent = newStyle;
        }
    }
}
