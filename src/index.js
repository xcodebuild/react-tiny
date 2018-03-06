
// react-tiny 虚拟 DOM 节点的类型
const TREACT_ELEMENT_NODE_TYPE = {
    DOM: 'DOM',
};

// react-tiny 内部存储虚拟 DOM 树的数据结构，一个节点
class TReactElement {
    constructor({
        nodeType,
        nodeOrigin, // 节点的原数据，function 或者 string 等
        children,
    }) {
        this.nodeType = nodeType;
        this.nodeOrigin = nodeOrigin;
        this.children = children;
    }

    // 挂载节点，返回渲染的 HTML
    mount() {
        if (this.nodeType === TREACT_ELEMENT_NODE_TYPE.DOM) {
            // DOM 元素，拼装一下就可以
            const children = this.children || [];
            const childrenMounted = children.map(child => {
                if (typeof child === 'string') {
                    // <div>test</div> => React.createElement('div', null, 'test')
                    // 当子节点为字符串时，他就真的是个字符串
                    return child;
                } else {
                    return child.mount();
                }
            }).join('');
            return `<${this.nodeOrigin}>${childrenMounted}</${this.nodeOrigin}>`;
        }
    }
}

// <div>Test</div> => document.createElement('div', null, 'Test', 其实这里还会有其他的 child)
function createElement(nodeType, attrs, ...children) {
    if (typeof nodeType === 'string') {
        // JSX 为 <div>xxx</div> 这种普通 DOM 时
        // 对应的是 React.createElement('div', null, ...)
        return new TReactElement({
            nodeType: TREACT_ELEMENT_NODE_TYPE.DOM,
            nodeOrigin: nodeType,
            children: children,
        });
    }
}

function render(tReactElement, domContainer) {
    domContainer.innerHTML = tReactElement.mount();
}

export default {
    createElement,
    render,
};