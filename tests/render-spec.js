import {createDiv} from './utils';

import {render} from '../src/index';

describe('#render', function () {
    it('render "hello" should got hello', function () {
    	const container = createDiv();
    	render(container, 'hello');
        expect(container.innerText).to.be.equal('hello');
    });
});