/// <reference path="test.d.ts" />
import { TestSampleTarget, TestSampleWithHtml } from '../src/components/TestSampleTarget';

describe('TestSampleTarget', () => {
    it('returns a greeting text', () => {
        let cocoa = new TestSampleTarget('cocoa');
        assert.equal(cocoa.greet(), 'My name is cocoa');

        let chino = new TestSampleTarget('chino');
        assert.equal(chino.greet(), 'My name is chino');
    });
});

describe('TestSampleWithHtml', () => {
    it('add attribute `data-test`', () => {

    });
});
