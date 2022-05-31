import Zero, { jsh } from "./index.js";

Zero.define(
    "z-counter",
    class ZCounter extends Zero {
        state = {
            count: 0,
        };

        onClick() {
            this.state.count++;
        }

        render() {
            return jsh.fragment(
                {},
                jsh.p({}, `count: ${this.state.count}`),

                jsh.button(
                    {
                        onClick: () => this.onClick(),
                        style: `color: ${
                            this.state.count < 10 ? "blue" : "red"
                        }`,
                    },
                    "increment"
                ),
                this.state.count > 10
                    ? jsh.p({}, "lmao you really be trying")
                    : null
            );
        }
    }
);
