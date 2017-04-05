// @flow

import {ReactClass} from './component';

import {createElement, render} from './vdom';


const ReactTiny = {
    createElement,
    render,
    Component: ReactClass,
};

if (window) {
    window['ReactTiny'] = ReactTiny;
}

export default ReactTiny;

