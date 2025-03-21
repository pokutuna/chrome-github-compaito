/// <reference path="test.d.ts" />
import * as sinon from 'sinon';
import { IConfigEditorView, ConfigEditorPresenter, ConfigEditorView } from '../src/components/ConfigEditor'
import { setupLocalStorageStub } from './LocalStorageStub';

function createConfigEditoView(): IConfigEditorView {
    return {
        restoreHostConfigJson(): void { },
        updateButton(): void { },
        updateError(): void { },
    };
}

describe('ConfigEditorPresenter', () => {
    setupLocalStorageStub();

    it('basic flow', async () => {
        let view = createConfigEditoView();
        let updateButton = sinon.spy(view, 'updateButton');
        let presenter = new ConfigEditorPresenter(view);

        assert.ok(updateButton.notCalled);
        await presenter.setup();
        assert.equal(updateButton.callCount, 1);
        assert.equal(presenter.hasDiff, false);
        assert.equal(presenter.hasSaved, false);
        assert.equal(presenter.isSaveButtonEnable, false);
        assert.equal(presenter.saveButtonText, 'Save');

        presenter.handleHostConfigInput('{ "isNotValidJson');
        assert.equal(updateButton.callCount, 2);
        assert.equal(presenter.hasDiff, true);
        assert.equal(presenter.hasSaved, false);
        assert.equal(presenter.isSaveButtonEnable, false);
        assert.equal(presenter.saveButtonText, 'Save');

        presenter.handleHostConfigInput('{ "isValidJson": true }');
        assert.equal(updateButton.callCount, 3);
        assert.equal(presenter.hasDiff, true);
        assert.equal(presenter.hasSaved, false);
        assert.equal(presenter.isSaveButtonEnable, true);
        assert.equal(presenter.saveButtonText, 'Save');

        await presenter.handleSave();
        assert.equal(updateButton.callCount, 4);
        assert.equal(presenter.hasDiff, false);
        assert.equal(presenter.hasSaved, true);
        assert.equal(presenter.isSaveButtonEnable, false);
        assert.equal(presenter.saveButtonText, 'Saved!');

        presenter.handleHostConfigInput('{ "isValidJson": true, }');
        assert.equal(updateButton.callCount, 5);
        assert.equal(presenter.hasDiff, true);
        assert.equal(presenter.hasSaved, true);
        assert.equal(presenter.isSaveButtonEnable, false);
        assert.equal(presenter.saveButtonText, 'Save');
    });

    it('#hostsJson', async () => {
        let view = createConfigEditoView();
        let presenter = new ConfigEditorPresenter(view);

        await presenter.setup();
        assert.equal(presenter.hostsJson, '{\n  "github.com": true\n}');

        presenter.handleHostConfigInput('{ "isNotValidJson');
        assert.equal(presenter.hostsJson, '{\n  "github.com": true\n}');

        presenter.handleHostConfigInput('{ "isValidJson": true }');
        assert.equal(presenter.hostsJson, '{\n  "isValidJson": true\n}');

        // new instance
        await presenter.handleSave();
        presenter = new ConfigEditorPresenter(view);
        await presenter.setup();
        assert.equal(presenter.hostsJson, '{\n  "isValidJson": true\n}');
    });
});
