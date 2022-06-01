import Zero, { ZeroUtils, ZeroStore } from "./index.js";
const jsh = ZeroUtils.jsh;

const store = new ZeroStore({
    count: 0,
});

Zero.define(
    "z-counter",
    class ZCounter extends Zero {
        state = store;

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
