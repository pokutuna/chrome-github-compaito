/// <reference path="test.d.ts" />
import { TestSampleTarget, TestSampleWithHtml } from '../src/components/TestSample';

describe('TestSampleTarget', () => {
    it('returns a greeting text', () => {
        let cocoa = new TestSampleTarget('cocoa');
        assert.equal(cocoa.greet(), 'My name is cocoa');

        let chino = new TestSampleTarget('chino');
        assert.equal(chino.greet(), 'My name is chino');
    });
});

describe('TestSampleWithHtml', () => {
    beforeEach(() => {
        document.body.innerHTML = __html__['test/TestSample.html'];
    });

    it('add attribute `data-test`', () => {
        let elem = document.querySelector('.js-test-sample');
        let view = new TestSampleWithHtml(elem);

        assert.equal(elem.getAttribute('data-test'), null);
        view.addAttr();
        assert.equal(elem.getAttribute('data-test'), 'true');
    });
});
