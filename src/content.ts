module CompaitoContent {

    export function init(): void {
        var revPicker = new RevisionPickClicker();
        var hideTimer: number;

        document.body.addEventListener('mouseover', util.delegate(
            github.isCommitUrlAnchorElement,
            function(event) {
                clearTimeout(hideTimer);
                revPicker.show(event.delegateTarget);
            }
        ));

        document.body.addEventListener('mouseout', util.delegate(
            github.isCommitUrlAnchorElement,
            function(event) {
                hideTimer = setTimeout(() => { revPicker.hide() }, 100);
            }
        ));

        window.addEventListener('popstate', () => revPicker.hide());
        document.body.addEventListener('click', (event) => revPicker.hide());
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
            util.addClasses(this.container, ['container', 'none']);

            this.pickButton = document.createElement('button');
            this.pickButton.addEventListener('click', (e) => this.onPickClick(e));
            util.addClasses(this.pickButton, ['pick-button']);

            this.pickPrevButton = document.createElement('button');
            this.pickPrevButton.addEventListener('click', (e) => this.onPickPrevClick(e));
            util.addClasses(this.pickPrevButton, ['pick-prev-button']);

            this.cancelButton = document.createElement('button');
            this.cancelButton.addEventListener('click', (e) => this.onCancelClick(e));
            util.addClasses(this.cancelButton, ['cancel-button', 'none']);

            this.container.appendChild(this.pickButton);
            this.container.appendChild(this.pickPrevButton);
            this.container.appendChild(this.cancelButton);
            this.updatePickerView();
            document.body.appendChild(this.container);
        }

        stick(elem: HTMLElement) {
            var anchor = <HTMLAnchorElement>elem;
            this.stickingElem     = anchor;
            this.stickingRevision = github.extractRevision(anchor.href);

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
                text = github.abbrevRevision(this.pickingRevision) + '...' + github.abbrevRevision(toRev);
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
                window.open(github.constructCompareViewURL(this.pickingRevision, this.stickingRevision));
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

    interface DelegatedEvent extends Event {
        delegateTarget?: HTMLElement
    }
    interface LocationHavingOrigin extends Location {
        origin: string // already implemented on Chrome
    }

    module util {
        export function delegate(
            match: (HTMLElement) => boolean, listener: (DelegatedEevent) => void
        ): (Event) => void {
            return function(event) {
                var el = event.target;
                do {
                    if (!match(el)) continue;
                    event.delegateTarget = el;
                    listener.apply(this, arguments);
                } while (el = el.parentNode);
            }
        }

        export function addClasses(elem: HTMLElement, classes: string[]): void {
            elem.classList.add('chrome-extension-compaito');
            classes.forEach((c: string) => elem.classList.add(c));
        }
    }

    module github {
        export var commitUrlPattern: RegExp = /\/commits?\/([0-9a-f]{40})/;
        export function isCommitUrlAnchorElement(elem: HTMLElement): boolean {
            var a = <HTMLAnchorElement> elem;
            return a.nodeName === 'A' && commitUrlPattern.test(a.href) && !/#$/.test(a.href)
                ? true : false;
        }

        export function extractRevision(url: string): string {
            var match = url.match(commitUrlPattern);
            return match[1];
        }
        export function constructCompareViewURL(fromRev, toRev: string): string {
            var loc = <LocationHavingOrigin> location;
            var diffArg = [fromRev, toRev].join('...');
            var pattern: RegExp = /\/([^\/]+)\/([^\/]+)(\/.*)?/;
            var match = loc.pathname.match(pattern);
            return [loc.origin, match[1], match[2], 'compare', diffArg].join('/');
        }
        export function abbrevRevision(revision: string): string {
            var isPrev = /~$/.test(revision);
            return !isPrev ? revision.substring(0, 7) : revision.substring(0, 6) + '~';
        }
    }
}

CompaitoContent.init();
