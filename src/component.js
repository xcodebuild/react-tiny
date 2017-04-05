// @flow
// 用户用来继承的 Component 类
class ReactClass {
    _internalReactComponent: ReactComponent;
    props: ?{[string]: any};

    constructor(props: ?{[string]: any}) {
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

export default {
    ReactClass,
};