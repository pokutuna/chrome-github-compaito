import { IView, Presenter, View } from './base';
import { Util } from './Util';
import { CommitURL } from './GitHub';

interface ICommitPickerView extends IView {
    updatePicker(): void;
    showPicker(anchor: HTMLAnchorElement): void;
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

    get isPicking(): boolean {
        return this.fromCommit ? true : false;
    }

    get pickText(): string {
        return this.isPicking
            ? [this.fromCommit.abbrevRevision, this.hoveringCommit.abbrevRevision].join('...')
            : 'compare'
    }

    get pickHref(): string {
        return this.isPicking
            ? CommitURL.composeDiffURL(this.fromCommit, this.hoveringCommit)
            : '#';
    }

    handleMouseOver(url: string, anchor: HTMLAnchorElement): void {
        if (!CommitURL.isCommitURLString(url)) return;
        this.hoveringCommit = new CommitURL(url);
        this.view.updatePicker();
        this.view.showPicker(anchor);
    }

    handleMouseOut(url: string): void {
        this.view.hidePicker();
    }

    handlePick(isParent: boolean) : void {
        if (!this.isPicking) {
            this.fromCommit = new CommitURL(this.hoveringCommit.url, isParent);
        }
        this.view.updatePicker();
    }

    handleCancel(): void {
        this.fromCommit = null;
        this.view.updatePicker();
    }
}

class CommitPickerView extends View implements ICommitPickerView {
    presenter: CommitPickerPresenter;

    body: HTMLBodyElement;

    // picker
    container : HTMLDivElement;
    pick      : HTMLAnchorElement;
    pickParent: HTMLAnchorElement;
    cancel    : HTMLAnchorElement;

    constructor(body: HTMLBodyElement) {
        super(body);
    }

    initMembers(body: HTMLBodyElement) {
        this.body = body;

        this.container  = document.createElement('div');
        this.pick       = document.createElement('a');
        this.pickParent = document.createElement('a');
        this.cancel     = document.createElement('a');

        Util.addClasses(this.container,  ['container', 'none']);
        Util.addClasses(this.pick,       ['pick-button']);
        Util.addClasses(this.pickParent, ['pick-prev-button']);
        Util.addClasses(this.cancel,     ['cancel-button']);

        [this.pick, this.pickParent, this.cancel].forEach((e) => this.container.appendChild(e));
        this.body.appendChild(this.container);
    }

    createPresenter() {
        return new CommitPickerPresenter(this);
    }

    registerEvents(): void {
        this.body.addEventListener(
            'mouseover', Util.delegate('a', this.onAnchorMouseOver.bind(this)));

        this.body.addEventListener(
            'mouseout', Util.delegate('a', this.onAnchorMouseOut.bind(this))
        );

        this.pick.addEventListener('click', this.onClickPick.bind(this));
        this.pickParent.addEventListener('click', this.onClickPickParent.bind(this));
        this.cancel.addEventListener('click', this.onClickCancel.bind(this));
    }

    private onAnchorMouseOver(event: Event): void {
        if ((<HTMLElement>event.target).nodeName !== 'A') return;
        const anchor = <HTMLAnchorElement>event.target;
        this.presenter.handleMouseOver(anchor.href, anchor);
    }

    private onAnchorMouseOut(event: Event): void {
        if ((<HTMLElement>event.target).nodeName !== 'A') return;
        this.presenter.handleMouseOut((<HTMLAnchorElement>event.target).href);
    }

    private onClickPick(event: Event): void {
        if (!this.presenter.isPicking) event.preventDefault();
        this.presenter.handlePick(false);
    }

    private onClickPickParent(event: Event): void {
        event.preventDefault();
        this.presenter.handlePick(true);
    }

    private onClickCancel(event: Event): void {
        event.preventDefault();
        this.presenter.handleCancel();
    }

    updatePicker(): void {
        this.pick.text = this.presenter.pickText;
        this.pick.href = this.presenter.pickHref;

        const isPicking = this.presenter.isPicking;
        this.pick.classList.toggle('picking', isPicking);
        this.pickParent.classList.toggle('none', isPicking);
        this.cancel.classList.toggle('none', !isPicking);
    }

    showPicker(anchor: HTMLAnchorElement): void {
        const rect = anchor.getBoundingClientRect();
        this.container.style.top  = (window.pageYOffset + rect.top   -  2) + 'px';
        this.container.style.left = (window.pageXOffset + rect.right + 10) + 'px';

        this.container.classList.remove('none');
    }

    hidePicker(): void {
        this.container.classList.add('none');
    }
}

export { ICommitPickerView, CommitPickerPresenter, CommitPickerView };
