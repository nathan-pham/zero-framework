export default class ZeroDOM {
    static _getAttributes(node) {
        return [...node.attributes].map((attr) => attr.name);
    }

    static _getNodeType(node) {
        if (node.nodeType === 3) return "text";
        if (node.nodeType === 8) return "comment";
        if (node.nodeType === 11) return "fragment";
        return node.tagName.toLowerCase();
    }

    static _getNodeContent(node) {
        if (node.childNodes && node.childNodes.length > 0) return null;
        return node.textContent;
    }

    static update(template, elem) {
        if (
            this._getNodeType(template) === "text" ||
            this._getNodeType(elem) === "text"
        ) {
            return;
        }

        // all attributes with filtered duplicates
        const allAttributes = [
            ...new Set([
                ...ZeroDOM._getAttributes(template),
                ...ZeroDOM._getAttributes(elem),
            ]),
        ];

        const setProp = (attribute, value) => {
            attribute.startsWith("on")
                ? (elem[attribute.toLowerCase()] = value)
                : elem.setAttributeNS(null, attribute, value);
        };

        const removeProp = (attribute) => {
            attribute.startsWith("on")
                ? (elem[attribute.toLowerCase()] = () => {})
                : elem.removeAttribute(attribute);
        };

        for (const attribute of allAttributes) {
            const templateValue = template.getAttribute(attribute);
            const elemValue = elem.getAttribute(attribute);

            if (!elemValue || elemValue !== templateValue) {
                setProp(attribute, templateValue);
            } else if (!templateValue) {
                removeProp(attribute);
            }
        }
    }

    static diff(template, elem) {
        const domNodes = [...elem.childNodes];
        const templateNodes = [...template.childNodes];

        // update parent node attributes
        if (this._getNodeType(template) !== this._getNodeType(elem)) {
            elem.replaceWith(template);
            return;
        }

        // removing extra elements
        const count = domNodes.length - templateNodes.length;
        if (count > 0) {
            for (let i = count; i > 0; i--) {
                domNodes[domNodes.length - count].remove();
            }
        }

        templateNodes.forEach((node, i) => {
            // create element if it does not exist
            if (!domNodes[i]) {
                elem.appendChild(node);
                return;
            }

            // update node if same type, otherwise replace
            if (this._getNodeType(node) !== this._getNodeType(domNodes[i])) {
                domNodes[i].replaceWith(node);
                return;
            }

            // update attributes
            ZeroDOM.update(node, domNodes[i]);

            // update content
            const templateContent = this._getNodeContent(node);
            if (
                templateContent &&
                templateContent !== this._getNodeContent(domNodes[i])
            ) {
                domNodes[i].textContent = templateContent;
            }

            // if target element is empty, wipe it
            if (
                domNodes[i].childNodes.length > 0 &&
                node.childNodes.length < 1
            ) {
                domNodes[i].innerHTML = "";
                return;
            }

            // build new element
            if (
                domNodes[i].childNodes.length < 1 &&
                node.childNodes.length > 0
            ) {
                const fragment = document.createDocumentFragment();
                this.diff(node, fragment);
                domNodes[i].appendChild(fragment);
                return;
            }

            // diff node child elements
            if (node.childNodes.length > 0) {
                this.diff(node, domNodes[i]);
            }
        });
    }
}
