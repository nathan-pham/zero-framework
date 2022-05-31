export default class ZeroDOM {
    constructor() {}

    // get list of attributes from node
    static getAttributes(attributes) {
        const _attributes = [];
        for (let i = 0; i < attributes.length; i++) {
            _attributes.push(attributes[i].name);
        }

        return _attributes;
    }

    // create obj with useful properties
    static createNode(node, parent) {
        if (!node) {
            return null;
        }

        const type = node.nodeType === 3 ? "text" : node.tagName.toLowerCase();

        return {
            attributes:
                type !== "text" && node.hasAttributes()
                    ? ZeroDOM.getAttributes(node.attributes)
                    : [],

            children: [...node.childNodes].map((childNode) =>
                ZeroDOM.createNode(childNode, node)
            ),

            content:
                node.childNodes && node.childNodes.length > 0
                    ? null
                    : node.textContent,

            parent,
            node,
            type,
        };
    }

    // update an old node with new properties & event listeners
    static update(oldNode, newNode) {
        if (oldNode.type === "text") {
            oldNode.parent.textContent = newNode.content;
            return;
        }

        const allAttributes = [...oldNode.attributes, ...newNode.attributes];

        const setProp = (key, value) => {
            key.startsWith("on")
                ? (oldNode.node[key.toLowerCase()] = value)
                : oldNode.node.setAttributeNS(null, key, value);
        };

        const removeProp = (key) => {
            key.startsWith("on")
                ? (oldNode.node[key.toLowerCase()] = "")
                : oldNode.node.removeAttribute(key);
        };

        for (const attribute of allAttributes) {
            const oldValue = oldNode.node.getAttribute(key);
            const newValue = newNode.node.getAttribute(key);

            // set a new value
            if (!oldValue || oldValue !== newValue) {
                setProp(attribute, newValue);
            } else if (!newValue) {
                removeProp(attribute);
            }
        }
    }

    // not a diffing algorithm (basically update stuff and otherwise replace)
    static diff(oldNode, newNode) {
        if (!newNode) {
            oldNode.node.remove();
        } else if (oldNode.children.length !== newNode.children.length) {
            oldNode.node.replaceWith(newNode.node);
        } else {
            ZeroDOM.update(oldNode, newNode);

            oldNode.children.forEach((child, i) => {
                ZeroDOM.diff(child, newNode.children[i]);
            });
        }
    }
}
