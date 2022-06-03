export default class ZeroStore {
    subscriptions = [];
    initialState = {};
    state = {};

    reducer = null;

    constructor(initialState = {}, reducer = () => {}) {
        this.initialState = initialState;
        this.state = this.createStore(this.initialState);

        this.reducer = reducer;
    }

    // action = { type, payload }
    dispatch(action) {
        const result = this.reducer(this.state, action);
        Object.assign(this.state, result);
    }

    getState() {
        return this.state;
    }

    addSubscription(cb) {
        this.subscriptions.push(cb);
    }

    getEventListeners(name) {
        return this.eventListeners
            .filter((e) => e.name === name)
            .map((e) => e.cb);
    }

    // main logic for creating a proxy store
    createStore(state) {
        const stateHandler = {
            set: (target, key, value) => {
                target[key] = createProxy(value);
                this.subscriptions.forEach((subscription) => subscription());
                return true;
            },
        };

        const createProxy = (variable = {}) => {
            const canProxy = ["[object Object]", "[object Array]"].includes(
                variable.toString()
            );

            if (canProxy) {
                if (Array.isArray(variable)) {
                    for (let i = 0; i < variable.length; i++) {
                        variable[i] = createProxy(variable[i]);
                    }
                } else {
                    for (const [key, value] of Object.entries(variable)) {
                        variable[key] = createProxy(value);
                    }
                }

                return new Proxy(variable, stateHandler);
            }

            return variable;
        };

        return createProxy(state);
    }
}
