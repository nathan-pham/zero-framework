import Zero from "./lib/Zero.js";
import { jsh, $ } from "./utils.js";

Zero.define(
    "z-counter",
    class Counter extends Zero {
        state = {
            count: 0,
        };

        onClick() {
            this.state.count++;
        }

        render() {
            return jsh.div(
                {},
                jsh.p({}, `count: ${this.state.count}`),
                (this.state.count > 10
                    ? jsh.p({}, "lmao you really be trying")
                    : null),
                jsh.button({ onClick: () => this.onClick() }, "increment")
            );
        }
    }
);
