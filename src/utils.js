// @flow
import {DATA_ATTR_REACT_ID} from './const';
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

function propKeyMap(propKey) {
    const table = {
        className: 'class',
    };
    return table[propKey] || propKey;
}

function setProp(element: Element, propKey: string, value: any) {
    if (propKey === 'children') return;
    propKey = propKeyMap(propKey);
    if (propKey === 'value') {
        element.value = value;
    } else {
        element.setAttribute(propKey, value);
    }
}

export default {
	getEventName,
	insertChildAt,
	nodeFromHTML,
	idWithNewIndex,
	reactIDParent,
	getElementByReactID,
	getElementByReactIDPrefix,
	setProp,
    propKeyMap,
};