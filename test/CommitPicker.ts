/// <reference path="test.d.ts" />
import * as sinon from 'sinon';
import {
    ICommitPickerView,
    CommitPickerPresenter,
    CommitPickerView,
} from '../src/components/CommitPicker';

function createCommitPickerView(): ICommitPickerView {
    return {
        updatePicker(anchor?: HTMLAnchorElement): void {},
        updateError(): void {},
    };
}

describe('CommitPickerPresenter', () => {
    it('#setup', () => {
        let view = createCommitPickerView();
        let updatePicker = sinon.spy(view, 'updatePicker');

        let presenter = new CommitPickerPresenter(view);
        assert.ok(updatePicker.notCalled);
        presenter.setup();
        assert.ok(updatePicker.calledOnce);

        assert.equal(presenter.isPicking, false);
        assert.equal(presenter.pickText, 'compare');
        assert.equal(presenter.pickHref, '#');
        assert.equal(presenter.visible, false);
        assert.equal(presenter.hoveringCommit, null);
    });

    it('#handleMouseOver, #handleMouseOut', () => {
        let view = createCommitPickerView();
        let updatePicker = sinon.spy(view, 'updatePicker');

        let presenter = new CommitPickerPresenter(view);
        presenter.setup();
        assert.equal(updatePicker.callCount, 1);

        let commitHref = `https://github.com/owner/repo/commit/${'a'.repeat(40)}`;
        let aElem = document.createElement('a');
        aElem.href = commitHref;

        // mouseOver on CommitURL
        presenter.handleMouseOver(aElem.href, aElem);
        assert.equal(updatePicker.callCount, 2);
        assert.equal(presenter.visible, true);
        assert.equal(presenter.hoveringCommit.url, commitHref);

        // mouseOut
        presenter.handleMouseOut();
        assert.equal(updatePicker.callCount, 3);
        assert.equal(presenter.visible, false);
        assert.equal(presenter.hoveringCommit.url, commitHref); // keep last commit

        // mouseOver on not CommitURL
        presenter.handleMouseOver('http://example.com', document.createElement('a'));
        assert.equal(updatePicker.callCount, 3);
        assert.equal(presenter.visible, false);
        assert.equal(presenter.hoveringCommit.url, commitHref);
    });

    it('#handlePick, #handleCancel', () => {
        let clock = sinon.useFakeTimers();

        let view = createCommitPickerView();
        let updatePicker = sinon.spy(view, 'updatePicker');

        let presenter = new CommitPickerPresenter(view);
        presenter.setup();

        let sha1 = 'a'.repeat(40);
        let commitHref = `https://github.com/owner/repo/commit/${sha1}`;
        let aElem = document.createElement('a');
        aElem.href = commitHref;

        assert.equal(updatePicker.callCount, 1);

        // mouseOver
        presenter.handleMouseOver(aElem.href, aElem);
        assert.equal(updatePicker.callCount, 2);
        assert.equal(presenter.visible, true);
        assert.equal(presenter.isPicking, false);
        assert.equal(presenter.fromCommit, null);
        assert.equal(presenter.pickText, 'compare');
        assert.equal(presenter.pickHref, '#');

        // pick a fromCommit
        presenter.handlePick(false);
        assert.equal(updatePicker.callCount, 3);
        assert.equal(presenter.visible, true);
        assert.equal(presenter.isPicking, true);
        assert.equal(presenter.fromCommit.revision, sha1);
        assert.equal(presenter.pickText, 'aaaaaaa...aaaaaaa');
        assert.equal(presenter.pickHref, `https://github.com/owner/repo/compare/${sha1}...${sha1}`);

        // cancel picking
        presenter.handleCancel();
        assert.equal(updatePicker.callCount, 4);
        assert.equal(presenter.visible, true);
        assert.equal(presenter.isPicking, false);
        assert.equal(presenter.fromCommit, null);
        assert.equal(presenter.pickText, 'compare');
        assert.equal(presenter.pickHref, '#');

        // pick a fromCommit
        presenter.handlePick(true);
        assert.equal(updatePicker.callCount, 5);
        assert.equal(presenter.visible, true);
        assert.equal(presenter.isPicking, true);
        assert.equal(presenter.fromCommit.revision, sha1 + '~');
        assert.equal(presenter.pickText, 'aaaaaa~...aaaaaaa');
        assert.equal(presenter.pickHref, `https://github.com/owner/repo/compare/${sha1}~...${sha1}`);

        // pick a toCommit
        presenter.handlePick(false);
        assert.equal(updatePicker.callCount, 6);
        assert.equal(presenter.visible, true);
        assert.equal(presenter.isPicking, true);
        assert.equal(presenter.fromCommit.revision, sha1 + '~');
        assert.equal(presenter.pickText, 'aaaaaa~...aaaaaaa');
        assert.equal(presenter.pickHref, `https://github.com/owner/repo/compare/${sha1}~...${sha1}`);

        clock.tick(1);
        assert.equal(updatePicker.callCount, 6);
        assert.equal(presenter.visible, true);
        assert.equal(presenter.isPicking, false);
        assert.equal(presenter.fromCommit, null);
        assert.equal(presenter.pickText, 'compare');
        assert.equal(presenter.pickHref, '#');
    });
});
