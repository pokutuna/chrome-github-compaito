import { IView, Presenter, View } from './base';
import { Util } from './Util';
import { CommitURL } from './GitHub';

interface ICommitPickerView extends IView {
    showPicker(): void;
    hidePicker(): void;
}

class CommitPickerPresenter extends Presenter {
    view: ICommitPickerView;

    hoveringCommit: CommitURL;
    fromCommit: CommitURL;

    constructor(view: ICommitPickerView) {
        super(view);
        this.hoveringCommit = null;
        this.fromCommit = null;
    }

    handleMouseOver(url: string): void {
        if (!CommitURL.isCommitURLString(url)) return;
        this.hoveringCommit = new CommitURL(url);
        this.view.showPicker();
    }

    handleMouseOut(url: string): void {
        this.hoveringCommit = null;
        this.view.hidePicker();
    }
}

class CommitPickerView extends View implements ICommitPickerView {
    presenter: CommitPickerPresenter;

    container: HTMLBodyElement;

    constructor(body: HTMLBodyElement) {
        super(body);
    }

    initMembers(body: HTMLBodyElement) {
        this.container = body;
    }

    createPresenter() {
        return new CommitPickerPresenter(this);
    }

    registerEvents(): void {
        this.container.addEventListener(
            'mouseover', Util.delegate('a', this.onAnchorMouseOver.bind(this)));

        this.container.addEventListener(
            'mouseout', Util.delegate('a', this.onAnchorMouseOut.bind(this))
        );
    }

    private onAnchorMouseOver(event: Event): void {
        if ((<HTMLElement>event.target).nodeName !== 'A') return;
        this.presenter.handleMouseOver((<HTMLAnchorElement>event.target).href);
    }

    private onAnchorMouseOut(event: Event): void {
        if ((<HTMLElement>event.target).nodeName !== 'A') return;
        this.presenter.handleMouseOut((<HTMLAnchorElement>event.target).href);
    }

    showPicker(): void {
    }

    hidePicker(): void {
    }
}
