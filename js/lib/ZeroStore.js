export default class ZeroStore {
    eventListeners = [];

    initialState = {};
    state = {};

    constructor(initialState = {}) {
        this.initialState = initialState;
        this.state = this.createIndependentStore(this.initialState);
    }

    on(name, cb) {
        this.eventListeners.push({ name, cb });
    }

    getEventListeners(name) {
        return this.eventListeners
            .filter((e) => e.name === name)
            .map((e) => e.cb);
    }

    // main logic for creating a proxy store
    createIndependentStore(state) {
        const stateHandler = {
            set: (target, key, value) => {
                target[key] = createProxy(value);
                this.getEventListeners("change").forEach((cb) => cb());
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
