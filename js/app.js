import Zero, { ZeroUtils, ZeroStore } from "./index.js";
const jsh = ZeroUtils.jsh;

const globalStore = new ZeroStore({ count: 0 }, (state, action) => {
    switch (action.type) {
        case "increment":
            return {
                ...state,
                count: state.count + 1,
            };

        default:
            return state;
    }
});

Zero.define(
    "z-counter",
    class ZCounter extends Zero {
        store = globalStore;

        onClick() {
            globalStore.dispatch({
                type: "increment",
            });
        }

        render() {
            return jsh.fragment(
                {},
                jsh.p({}, `count: ${globalStore.state.count}`),

                jsh.button(
                    {
                        onClick: () => this.onClick(),
                        style: `color: ${
                            globalStore.state.count < 10 ? "blue" : "red"
                        }`,
                    },
                    "increment"
                ),
                globalStore.state.count > 10
                    ? jsh.p({}, "lmao you really be trying")
                    : null
            );
        }
    }
);
