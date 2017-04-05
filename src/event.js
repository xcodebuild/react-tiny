// @flow
import {map, forEach, filter, keys, get} from 'lodash';
import {DATA_ATTR_REACT_ID} from './const';
import {reactIDParent} from './utils';

class EventController {
    _map: {[string]: object};
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

export default {
	EventController,
};