import common = require('./common');

module CompaitoContent {

    export function init(): void {
        var revPicker = new RevisionPickClicker();
        var hideTimer: number;

        document.body.addEventListener('mouseover', common.util.delegate(
            common.github.isCommitUrlAnchorElement,
            function(event) {
                clearTimeout(hideTimer);
                revPicker.show(event.delegateTarget);
            }
        ));

        document.body.addEventListener('mouseout', common.util.delegate(
            common.github.isCommitUrlAnchorElement,
            function(event) {
                hideTimer = setTimeout(() => { revPicker.hide() }, 100);
            }
        ));
    }

    class RevisionPickClicker {
        container: HTMLDivElement;
        pickButton: HTMLButtonElement;
        pickPrevButton: HTMLButtonElement;
        cancelButton: HTMLButtonElement;

        stickingElem: HTMLAnchorElement;
        stickingRevision: string = '';
        pickingRevision: string = '';

        constructor() {
            this.container = document.createElement('div');
            common.util.addClasses(this.container, ['container', 'none']);

            this.pickButton = document.createElement('button');
            this.pickButton.addEventListener('click', (e) => this.onPickClick(e));
            common.util.addClasses(this.pickButton, ['pick-button']);

            this.pickPrevButton = document.createElement('button');
            this.pickPrevButton.addEventListener('click', (e) => this.onPickPrevClick(e));
            common.util.addClasses(this.pickPrevButton, ['pick-prev-button']);

            this.cancelButton = document.createElement('button');
            this.cancelButton.addEventListener('click', (e) => this.onCancelClick(e));
            common.util.addClasses(this.cancelButton, ['cancel-button', 'none']);

            this.container.appendChild(this.pickButton);
            this.container.appendChild(this.pickPrevButton);
            this.container.appendChild(this.cancelButton);
            this.updatePickerView();
            document.body.appendChild(this.container);
        }

        stick(elem: HTMLElement) {
            var anchor = <HTMLAnchorElement>elem;
            this.stickingElem     = anchor;
            this.stickingRevision = common.github.extractRevision(anchor.href);

            var rect = this.stickingElem.getBoundingClientRect();
            this.container.style.top  =
                window.pageYOffset + rect.top - 2 + 'px'; // pull up padding-top
            this.container.style.left =
                window.pageXOffset + rect.right + 10 + 'px'; // slide balloon arrow width
        }

        setPickingRevision(rev: string): void {
            this.pickingRevision = rev;
            this.updatePickerView();
        }

        updatePickerView(toRev: string = ''): void {
            var text;
            if (this.pickingRevision) {
                text = common.github.abbrevRevision(this.pickingRevision) + '...' + common.github.abbrevRevision(toRev);
                this.pickButton.classList.add('picking');
                this.pickPrevButton.classList.add('none');
                this.cancelButton.classList.remove('none');
            } else {
                text = 'compare';
                this.pickButton.classList.remove('picking');
                this.pickPrevButton.classList.remove('none');
                this.cancelButton.classList.add('none');
            }
            this.pickButton.textContent = text;
        }

        show(relatedElem: HTMLElement) {
            this.stick(relatedElem);
            this.updatePickerView(this.stickingRevision);
            this.container.classList.remove('none');
        }

        hide() {
            this.container.classList.add('none');
        }

        onPickClick(event: MouseEvent) {
            if (this.pickingRevision) {
                window.open(common.github.constructCompareViewURL(this.pickingRevision, this.stickingRevision));
                this.setPickingRevision('');
            } else {
                this.setPickingRevision(this.stickingRevision);
            }
        }

        onPickPrevClick(event: MouseEvent) {
            this.setPickingRevision(this.stickingRevision + '~');
        }

        onCancelClick(event: MouseEvent) {
            this.setPickingRevision('');
        }
    }
}

CompaitoContent.init();
