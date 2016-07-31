import { IView, Presenter, View } from './base';
import { Util } from './Util';
import { CommitURL } from './CommitURL';

interface ICommitPickerView extends IView {
    updatePicker(anchor?: HTMLAnchorElement): void;
}

class CommitPickerPresenter extends Presenter {
    view: ICommitPickerView;

    hoveringCommit: CommitURL;
    fromCommit: CommitURL;

    visible: boolean;

    constructor(view: ICommitPickerView) {
        super(view);
        this.hoveringCommit = null;
        this.fromCommit = null;
        this.visible = false;
    }

    setup(): void {
        this.view.updatePicker();
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
        this.visible = true;
        this.hoveringCommit = new CommitURL(url);
        this.view.updatePicker(anchor);
    }

    handleMouseOut(): void {
        this.visible = false;
        this.view.updatePicker();
    }

    handlePick(isParent: boolean) : void {
        if (this.isPicking) {
            this.fromCommit = null // reset on opening compare view
        } else {
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
        Util.addClasses(this.pick,       ['pick']);
        Util.addClasses(this.pickParent, ['pick-prev']);
        Util.addClasses(this.cancel,     ['cancel']);

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
        this.presenter.handleMouseOut();
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

    updatePicker(anchor?: HTMLAnchorElement): void {
        this.pick.text = this.presenter.pickText;
        this.pick.href = this.presenter.pickHref;

        if (anchor) {
            const rect = anchor.getBoundingClientRect();
            // pull up padding-top
            this.container.style.top  = (window.pageYOffset + rect.top   -  2) + 'px';
            // slide balloon arrow width
            this.container.style.left = (window.pageXOffset + rect.right + 10) + 'px';
        }

        this.pick.classList.toggle('picking', this.presenter.isPicking);
        this.pickParent.classList.toggle('none', this.presenter.isPicking);
        this.cancel.classList.toggle('none', !this.presenter.isPicking);
        this.container.classList.toggle('none', !this.presenter.visible);
    }
}

export { ICommitPickerView, CommitPickerPresenter, CommitPickerView };
