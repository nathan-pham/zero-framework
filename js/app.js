import Zero, { ZeroUtils, ZeroStore } from "./index.js";
const jsh = ZeroUtils.jsh;

const globalStore = new ZeroStore(
    { count: 0, example: "data type" },
    (state, action) => {
        console.log("dispatch");
        switch (action.type) {
            case "increment":
                return {
                    count: state.count + 1,
                };

            default:
                return state;
        }
    }
);

Zero.define(
    "z-counter",
    class ZCounter extends Zero {
        store = globalStore;

        style = `
            .button {
                color: red;
            }
        `;

        onClick() {
            globalStore.dispatch({
                type: "increment",
            });
        }

        render() {
            return jsh.fragment(
                {},
                jsh.p(
                    {
                        style: {
                            fontSize: "2rem",
                        },
                    },
                    `count: ${globalStore.state.count}`
                ),

                jsh.button(
                    {
                        class: "button",
                        onClick: () => this.onClick(),
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
