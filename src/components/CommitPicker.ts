import { IView, Presenter, View } from './base';
import { Util } from './Util';

interface ICommitPickerView extends IView {
}

class CommitPickerPresenter extends Presenter {
    view: ICommitPickerView;

    constructor(view: ICommitPickerView) {
        super(view);
    }
}

class CommitPickerView extends View implements ICommitPickerView {
    presenter: CommitPickerPresenter;

    constructor(body: HTMLBodyElement) {
        super(body);
    }

    initMembers(body: HTMLBodyElement) {
    }

    createPresenter() {
        return new CommitPickerPresenter(this);
    }

    registerEvents(): void {
    }
}
