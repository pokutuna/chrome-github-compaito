/// <reference path="test.d.ts" />
import * as sinon from 'sinon';
import { Util } from '../src/components/Util';

describe('Util', () => {
    beforeEach(() => {
        document.body.innerHTML = __html__['test/Util.html'];
    });

    describe('addClasses', () => {
        it('can add classes with chrome-extension-compaito', () => {
            Util.addClasses(<HTMLElement>document.querySelector('.outer'), ['hoge', 'fuga']);
            let classes = Array.prototype.slice.apply(document.querySelector('.outer').classList);
            assert.sameMembers(classes, ['outer', 'hoge', 'fuga', 'chrome-extension-compaito']);
        });
    });

    describe('delegate', () => {
        it('can delegate event handler', () => {
            let handler = sinon.stub();
            document.querySelector('.inner').addEventListener(
                'click', Util.delegate('.b', handler)
            );
            assert.equal(handler.callCount, 0, 'initialized');

            (<HTMLElement>document.querySelector('a.a')).click();
            assert.equal(handler.callCount, 0);

            (<HTMLElement>document.querySelector('a.b')).click();
            assert.equal(handler.callCount, 1);

            (<HTMLElement>document.querySelector('.inner')).click();
            assert.equal(handler.callCount, 1);

            (<HTMLElement>document.querySelector('div.b')).click();
            assert.equal(handler.callCount, 1, 'not a child of .inner');
        });

        it('can handle a event from new element', () => {
            let handler = sinon.stub();
            document.querySelector('.inner').addEventListener(
                'click', Util.delegate('.b', handler)
            );
            assert.equal(handler.callCount, 0);

            // new element
            let newElem = document.createElement('div');
            newElem.classList.add('b');
            document.querySelector('.inner').appendChild(newElem);

            (<HTMLElement>document.querySelector('div.b')).click();
            assert.equal(handler.callCount, 1);
        });
    });
});
