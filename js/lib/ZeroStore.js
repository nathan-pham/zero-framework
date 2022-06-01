export default class ZeroStore {
    subscriptions = [];

    initialState = {};
    state = {};

    reducer = () => {};

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
}
