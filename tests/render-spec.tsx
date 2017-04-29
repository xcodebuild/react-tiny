import {createDiv} from './utils';

import {render, h} from '../src/index';

declare const describe: Function;
declare const it: Function;
declare const expect: Function;

describe('#render', () => {
    it('render "hello" should got <span>hello</span>', () => {
    	const container: HTMLElement = createDiv();
    	render('hello', container);
        const target: Element | null = container.children[0];
        expect(target).to.not.be.undefined;
        expect(target.tagName.toLowerCase()).to.be.equal('span');
        expect(target.innerHTML).to.be.equal('hello');
    });

    it('render "<div>test</div> should got html itself', () => {
        const container: HTMLElement = createDiv();
        render(<div>test</div>, container);
    });
});