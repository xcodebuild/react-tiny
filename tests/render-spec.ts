import {createDiv} from './utils';

import {render} from '../src/index';

declare const describe: Function;
declare const it: Function;
declare const expect: Function;

describe('#render', function () {
    it('render "hello" should got <span>hello</span>', function () {
    	const container: HTMLElement = createDiv();
    	render('hello', container);
        const target: Element | null = container.children[0];
        expect(target).to.not.be.undefined;
        expect(target.tagName.toLowerCase()).to.be.equal('span');
        expect(target.innerHTML).to.be.equal('hello');
    });
});