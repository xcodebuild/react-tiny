import { createContainer } from './utils';
import React from '../index';

describe('Render', () => {
    it('<div>test</div> should be render as <div>test</div>', function () {
        const con = createContainer('render-simple');
        React.render(<div>test</div>, con);

        // 获取 append 进去的元素
        const target = con.append();

        expect(target.nodeName.toUpperCase()).toEqual('DIV');
        expect(target.innerText).toEqual('test');
    });
});
