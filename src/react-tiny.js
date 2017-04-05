// @flow

import { get, toString, forEach, merge, isArray, reduce, filter, keys, map } from 'lodash';

type MapT = { [string]: any };

type ReactElementItemT = ReactElement | string | number | null;
type ReactElementArrayT = Array<ReactElementItemT>;
type ReactElementT = ReactElementItemT | ReactElementArrayT | Array<ReactElementT>;

const DATA_ATTR_REACT_ID: string = 'data-reactid';


function getEventName(propKey: string): ?string {
    if (/^on[A-Za-z]+/.test(propKey)) {
        return propKey.replace(/^on/, '').toLocaleLowerCase();
    }
}

function insertChildAt(parentNode, childNode, reactID) {
    const beforeChild = getElementByReactIDPrefix(reactID);
    beforeChild ? parentNode.insertBefore(childNode, beforeChild) : parentNode.appendChild(childNode);
}

function nodeFromHTML(html: string): ?Element {
    if (html === '') {
        return document.createTextNode('');
    }
    const node = document.createElement('div');
    node.innerHTML = html;
    return node.firstChild;
}

function idWithNewIndex(id: string, newIndex: number) {
    return id.replace(/\d+$/, toString(newIndex))
}

function reactIDParent(reactID: string) {
    const reg = /[:.]\d+$/;
    if (reg.test(reactID)) {
        return reactID.replace(reg, '');
    }
}

function getElementByReactID(reactID: string): ?Element {
    return document.querySelector(`[${DATA_ATTR_REACT_ID}="${reactID}"]`);
}

function getElementByReactIDPrefix(reactID: string): ?Element {
    return document.querySelector(`[${DATA_ATTR_REACT_ID}^="${reactID}"]`);
}

function setProp(element: Element, propKey: string, value: any) {
    if (propKey === 'children') return;
    if (propKey === 'value') {
        element.value = value;
    } else {
        element.setAttribute(propKey, value);
    }
}

class EventController {
    _map: MapT;
    constructor() {
        this._map = {};
        const allEvent = map(filter(keys(window), item => /^on/.test(item)), item => item.replace(/^on/, ''));
        forEach(allEvent, event => {
            document.addEventListener(event, e => {
                const target: Element | HTMLDocument = e.target;
                const targetID = target.getAttribute && target.getAttribute(DATA_ATTR_REACT_ID);

                let curID = targetID;
                while (curID) {
                    const callback = get(this._map, [curID, event]);
                    callback && callback(e);
                    curID = reactIDParent(curID);
                }
            });
        });
    }

    setEventListener(rootID: string, eventName: string, callback: Function) {
        this._map[rootID] = this._map[rootID] || {};
        this._map[rootID][eventName] = callback;
    }

    removeEventListener(rootID, eventName) {
        if (this._map[rootID]) {
            this._map[rootID][eventName] = null;
        }
    }

    removeAllEventListener(rootID) {
        this._map[rootID] = {};
    }
}

const eventController = new EventController();

// 用户用来继承的 Component 类
class ReactClass {
    _internalReactComponent: ReactComponent;
    props: ?MapT;

    constructor(props: ?MapT) {
        this.props = props;
    }

    componentWillMount() { }

    render() {
        throw new Error('Component need a render()');
    }
    componentDidMount() { }
    componentWillReceiveProps() { }
    shouldComponentUpdate() { }
    componentWillUpdate() { }
    componentDidUpdate() { }
    componentWillUnmount() { }

    setState(nextState) {
        this._internalReactComponent.setState(nextState);
    }
}

// createElement 返回的 react element, 实际上就是 VirtualDOM
class ReactElement {
    type: string | Function;
    key: ?string;
    props: ?MapT;

    get children(): ReactElementT {
        return this.props && this.props.children;
    }

    constructor(type: string | Function, props: ?MapT) {
        this.type = type;
        this.key = get(props, 'key') || null;

        this.props = props;
    }
}

// React 内部 Component，所有被 mount 的 Component 都对应着一个内部 Component 实例
class ReactComponent {
    _rootID: string;
    _mountIndex: number;

    get domElement(): Element {
        return getElementByReactIDPrefix(this._rootID);
    }

    // 挂载并返回对应的 DOM String，只在该 Component 被初始化时被调用
    // 需要被重载
    mountComponent(rootID: string): string {
        throw new Error('mountComponent need to be override');
    }

    // 更新 Component
    // 需要被重载
    receiveComponent(component: string): void {
        throw new Error('receiveComponent need to be override');
    }
}

// 文字节点
class ReactTextNodeComponent extends ReactComponent {
    _element: string;
    constructor(text: string | number) {
        super();
        this._element = toString(text);
    }

    mountComponent(rootID: string): string {
        this._rootID = rootID;
        return `<span ${DATA_ATTR_REACT_ID}=${rootID}>${this._element}</span>`;
    }

    shouldReceive(element: ReactElementT): boolean {
        return (typeof element === 'string' || typeof element === 'number');
    }

    receiveComponent(component: string | number): void {
        const text = toString(component);
        if (this._element !== text) {
            // update
            this._text = text;
            this.domElement.innerText = text;
        }
    }
}

// 空节点
class ReactEmptyComponent extends ReactComponent {
    _element: ReactElementT;
    constructor() {
        super();
        this._element = null;
    }
    mountComponent(rootID: string): string {
        return '';
    }

    shouldReceive(): boolean {
        return false;
    }
}

const DIFF_TYPE = {
    INSERT: Symbol('insert'),
    REMOVE: Symbol('remove'),
    MOVE: Symbol('move'),
};

// DOM 节点: div, span etc.
class ReactDOMComponent extends ReactComponent {
    _element: ReactElement;
    _childrenComponent: {[string]: ReactComponent};
    constructor(element: ReactElementT) {
        super();
        this._element = element;
    }

    _mountChildren(children: Array<ReactElementT>, split = '.') {
        const componentChildren: Array<ReactComponent> = [];
        let result = '';
        forEach(children, (child, index) => {
            const childComponent: ReactComponent = instantiateReactComponent(child);
            const childID: string = `${this._rootID}${split}${index}`;
            childComponent._mountIndex = index;
            result += childComponent.mountComponent(childID);
            componentChildren.push(childComponent);
        });

        this._childrenComponent = this._generatePrevChildren(componentChildren);
        return result;
    }

    mountComponent(rootID): string {
        this._rootID = rootID;
        // 对于普通 DOM Component 来说，_element.type 一定是 string
        if (typeof this._element.type === 'string') {
            const props: ?MapT = this._element.props;

            const element: Element = document.createElement((this._element.type: string));
            element.setAttribute(DATA_ATTR_REACT_ID, rootID);
            let result = `<${this._element.type} ${DATA_ATTR_REACT_ID}=${this._rootID} `;

            forEach(props, (propValue, propKey) => {
                const eventName: ?string = getEventName(propKey);
                if (eventName) {
                    eventController.setEventListener(rootID, eventName, propValue);
                } else if (propKey !== 'children') {
                    result += `${propKey}=${propValue} `;
                }
            });

            result += `>`;

            const children: ?Array<ReactElementT> = get(props, 'children');
            // mount children
            result += this._mountChildren(children);
            result += `</${this._element.type}>`
            return result;
        } else {
            throw new Error('ReactDOMComponent\'s ReactElement.type must be string');
        }
    }

    shouldReceive(element: ReactElementT): boolean {
        return element && element.type === this._element.type;
    }

    _updateProps(prevProps: ?MapT, nextProps: ?MapT): void {
        const element: Element = this.domElement;
        forEach(prevProps, (value, propKey) => {
            if (propKey === 'children') return;
            const eventName = getEventName(propKey);
            const nextValue = get(nextProps, propKey);
            if (nextValue === undefined) {
                // remove
                if (eventName) {
                    eventController.removeEventListener(this._rootID, eventName);
                } else {
                    setProp(element, propKey, null);
                }
            } else if (value !== nextValue) {
                if (eventName) {
                    eventController.setEventListener(this._rootID, eventName, nextValue);
                } else {
                    setProp(element, propKey, nextValue);
                }
            }
        });
    }

    _generatePrevChildren(list: Array<ReactComponent>) {
        return reduce(list, (memo, component: ReactComponent, index) => {
            const item: ReactElementT = component._element;
            const name = item && item.key ? item.key : index.toString(36);
            memo[name] = component;
            return memo;
          }, {});
    }

    _generateNextChildren(prevChildrenMap: MapT, nextChildren: Array<ReactElementT>) {
        const nextChildrenComponent = {};
        forEach(nextChildren, (nextChild: ReactElementT, index) => {
            // 有 key 则按 key 对应，否则直接按照 index 的位置对应
            // 这也是为什么三目运算符是必须的
            const name = nextChild && nextChild.key ? nextChild.key : index.toString(36);
            const prevChild: ?ReactComponent = prevChildrenMap[name];
            if (prevChild) {
                if (prevChild.shouldReceive(nextChild)) {
                    prevChild.receiveComponent(nextChild);
                    // 所以当他们一样时，在 diff 里他们指向同一个 component
                    nextChildrenComponent[name] = prevChild;
                } else {
                    const nextChildComponent: ReactComponent = instantiateReactComponent(nextChild);
                    nextChildrenComponent[name] = nextChildComponent;   
                }
            } else {
                // 不存在，新增
                const nextChildComponent: ReactComponent = instantiateReactComponent(nextChild);
                nextChildrenComponent[name] = nextChildComponent;
            }
        });
        return nextChildrenComponent;
    }

    _updateChildren(prevChildren: ?Array<ReactElementT>, nextChildren: ?Array<ReactElementT>, split = '.', parentNode = this.domElement): void {
        const prevChildrenComponent = this._childrenComponent;
        const nextChildrenComponent = this._generateNextChildren(prevChildrenComponent, nextChildren);

        const renderedChildren = [];
        forEach(nextChildrenComponent, (nextChild: ReactComponent, index) => {
            renderedChildren.push(nextChild);
        });

        let lastIndex = 0;
        let nextIndex = 0;
        const diffs = [];

        forEach(nextChildrenComponent, (nextChild: ReactComponent, name) => {
            const prevChild: ?ReactComponent = prevChildrenComponent[name];
            if (prevChild === nextChild) {
                if (prevChild._mountIndex !== nextIndex) {
                    diffs.push({
                        type: DIFF_TYPE.MOVE,
                        parentID: this._rootID,
                        parentNode: this.domElement,
                        fromID: prevChild._mountId,
                        toID: idWithNewIndex(nextIndex),
                    });
                }
                lastIndex = Math.max(lastIndex, prevChild._mountIndex);
            } else {
                // 之前不存在，或者不是同一个
                // 同一个已经在 this._generateNextChildren 里更新了所以必然会是同一个引用
                // DOM 中不真实存在的 ReactEmptyComponent，需要一些特殊处理
                if (prevChild && !(prevChild instanceof ReactEmptyComponent)) {
                    // 存在，需要删除并且用新的替代
                    diffs.push({
                        type: DIFF_TYPE.REMOVE,
                        parentID: this._rootID,
                        parentNode: this.domElement,
                        fromID: prevChild._rootID,
                    });

                    eventController.removeAllEventListener(prevChild._rootID);
                }
                diffs.push({
                    type: DIFF_TYPE.INSERT,
                    parentID: this._rootID,
                    parentNode: this.domElement,
                    toID: idWithNewIndex(this._rootID + split + nextIndex, nextIndex + 1),
                    html: nextChild.mountComponent(`${this._rootID}.${name}`),
                });
            }
            nextChild._mountIndex = nextIndex;
            nextIndex ++;
        });


        let curIndex = 0;
        forEach(prevChildrenComponent, (prevChild: ReactComponent, name) => {
            // Empty (ReactElement 为 null 是不会输出到 DOM 中的所以并不对应)
            // 所以跳过 Empty 的计数和操作
            if (!nextChildrenComponent[name] && !(prevChild instanceof ReactEmptyComponent)) {
                diffs.push({
                    type: DIFF_TYPE.REMOVE,
                    parentID: this._rootID,
                    parentNode: this.domElement,
                    fromID: prevChild._rootID,
                });
                eventController.removeAllEventListener(prevChild._rootID);
            }
        });

        // patch
        forEach(diffs, diff => {
            const {type, fromID, toID, parentID, html} = diff;
            

            let backupElement: Element;
            if (type === DIFF_TYPE.MOVE || type === DIFF_TYPE.REMOVE) {
                const childToRemove: Element = getElementByReactIDPrefix(fromID);
                if (type === DIFF_TYPE.MOVE) {
                    backupElement = childToRemove;
                }
                parentNode.removeChild(childToRemove);
            }

            if (type === DIFF_TYPE.MOVE) {
                insertChildAt(parentNode, backupElement, toID);
            } else if (type === DIFF_TYPE.INSERT) {
                insertChildAt(parentNode, nodeFromHTML(html), toID);
            }
        });

        this._childrenComponent = nextChildrenComponent;
    }

    receiveComponent(next: ReactElement): void {

        // update props
        const nextProps: ?MapT = next && next.props;
        const prevProps: ?MapT = this._element.props;
        this._updateProps(prevProps, nextProps);

        // update children
        const nextChildren: ?Array<ReactElementT> = next && next.children;
        const prevChildren: ?Array<ReactElementT> = this._element.children;
        this._updateChildren(prevChildren, nextChildren);

        this._element = next;
    }
}

class ReactListComponent extends ReactDOMComponent {
    _element: ReactElementArrayT;


    get domElement(): Element {
        let curID = this._rootID;
        let element;
        while(curID) {
            curID = reactIDParent(curID);
            if (/\.\d+$/.test(curID)) break;
        }
        element = getElementByReactIDPrefix(curID);
        return element;
    }
    mountComponent(rootID): string {
        this._rootID = rootID;
        const children = this._element;
        return this._mountChildren(children, ':');
    }

    shouldReceive(elements: ReactElementT): boolean {
        return isArray(elements);
    }

    receiveComponent(next: ReactElementT): void {
        const prevChildren: Array<ReactElementT> = this._element;
        const nextChildren: Array<ReactElementT> = next;
        this._updateChildren(prevChildren, nextChildren, ':');
        this._element = next;
    }
}

class ReactCompositeComponent extends ReactComponent {
    _element: ReactElement;
    _instance: ReactClass;
    _renderedComponent: ReactComponent;

    constructor(element: ReactElement) {
        super();
        this._element = element;
    }

    mountComponent(rootID: string): string {
        this._rootID = rootID;
        if (typeof this._element.type === 'function') {
            const reactClass:Function = this._element.type;
            const props = this._element.props;

            // 初始化用户定义的 component，生命周期开始了
            const ins: ReactClass = new reactClass(props);
            ins.componentWillMount && ins.componentWillMount();

            // 获取 render 结果
            const renderedElement: ReactElement = ins.render();
            
            const renderedComponent: ReactComponent = instantiateReactComponent(renderedElement);
            const result = renderedComponent.mountComponent(rootID);

            ins._internalReactComponent = this;
            this._renderedComponent = renderedComponent;
            this._instance = ins;
            return result;
        } else {
            throw new Error('ReactCompositeComponent\'s ReactElement.type must be function');
        }
    }

    shouldReceive(element: ReactElementT): boolean {
        return element && element.type === this._element.type;
    }

    receiveComponent(next: ?ReactElement, state) {
        
        const nextElement: ReactElement = next || this._element;
        const inst: ReactClass = this._instance;
        const nextProps = nextElement.props;
        const nextState = state || inst.state;

        // Update state & props in instance
        inst.state = nextState;
        inst.props = nextProps;

        if (inst.shouldComponentUpdate && (inst.shouldComponentUpdate(nextProps, nextState) === false)) {
            return;
        }
        // If there is componentWillUpdate - Call it to indicate start of update.
        if (inst.componentWillUpdate) {
            inst.componentWillUpdate(nextProps, nextState);
        }

        const prevRenderedComponent: ReactComponent = this._renderedComponent;
        const prevRenderedElement: ReactElementT = prevRenderedComponent._element;

        const nextRenderedElement: ReactElementT = inst.render();
        if (prevRenderedComponent.shouldReceive(nextRenderedElement)) {
            prevRenderedComponent.receiveComponent(nextRenderedElement);
            inst.componentDidUpdate && inst.componentDidUpdate();
        } else {
            this._renderedComponent = instantiateReactComponent(nextRenderedElement);
            this.domElement.replaceWith(this._renderedComponent.mountComponent(this._rootID));
        }
    }

    setState(nextState) {
        this.receiveComponent(null, nextState);
    }
}

function instantiateReactComponent(element: ReactElementT): ReactComponent {
    if (!element) {
        return new ReactEmptyComponent(element);
    }
    if (typeof element === 'string' || typeof element === 'number') {
        return new ReactTextNodeComponent(element);
    }
    if (isArray(element)) {
        return new ReactListComponent(element);
    }
    const type = get(element, 'type');
    if (typeof type === 'string') {
        return new ReactDOMComponent(element);
    } else {
        console.assert(typeof type === 'function', 'type of ReactElement should be string or funciton');
        return new ReactCompositeComponent(element);
    }
}

function render(element: ReactElementT, container: Element): void{
    const component: ReactComponent = instantiateReactComponent(element);
    const rootID: string = '0';
    const result: string = component.mountComponent(rootID);
    container.innerHTML = result;
}

function createElement(type: string| Function, attributes: ?MapT, ...children: Array<ReactElementT>){
    const props: ?MapT = merge(attributes, {children});
    return new ReactElement(type, props);
}

export default {
    createElement,
    render,
    Component: ReactClass,
};
