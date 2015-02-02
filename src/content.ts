console.log('content')

module Compaito {

    export function init(): void {
        var revPicker = new RevisionPickClicker();
        var hideTimer: number;

        document.body.addEventListener('mouseover', Util.delegate(
            Util.isCommitUrlAnchorElement,
            function(event) {
                clearTimeout(hideTimer);
                revPicker.show(event.delegateTarget);
            }
        ));

        document.body.addEventListener('mouseout', Util.delegate(
            Util.isCommitUrlAnchorElement,
            function(event) {
                hideTimer = setTimeout(() => { revPicker.hide() }, 100);
            }
        ));
    }

    // interfaces
    interface DelegatedEvent extends Event {
        delegateTarget?: HTMLElement
    }
    interface LocationHavingOrigin extends Location {
        origin: string // already implemented on Chrome
    }

    // classes
    export class RevisionPickClicker {
        container: HTMLDivElement;
        pickButton: HTMLButtonElement;
        pickPrevButton: HTMLButtonElement;
        cancelButton: HTMLButtonElement;

        stickingElem: HTMLAnchorElement;
        stickingRevision: string = '';
        pickingRevision: string = '';

        constructor() {
            this.container = document.createElement('div');
            Util.addClasses(this.container, ['container', 'none']);

            this.pickButton = document.createElement('button');
            this.pickButton.textContent = 'pick';
            this.pickButton.addEventListener('click', (e) => this.onPickClick(e));
            Util.addClasses(this.pickButton, ['pick-button']);

            this.pickPrevButton = document.createElement('button');
            this.pickPrevButton.textContent = '~';
            this.pickPrevButton.addEventListener('click', (e) => this.onPickPrevClick(e));
            Util.addClasses(this.pickPrevButton, ['pick-prev-button']);

            this.cancelButton = document.createElement('button');
            this.cancelButton.textContent = 'x';
            this.cancelButton.addEventListener('click', (e) => this.onCancelClick(e));
            Util.addClasses(this.cancelButton, ['cancel-button', 'none']);

            this.container.appendChild(this.pickButton);
            this.container.appendChild(this.pickPrevButton);
            this.container.appendChild(this.cancelButton);
            document.body.appendChild(this.container);
        }

        stick(elem: HTMLElement) {
            var anchor = <HTMLAnchorElement>elem;
            this.stickingElem     = anchor;
            this.stickingRevision = Util.extractRevision(anchor.href);

            var rect = this.stickingElem.getBoundingClientRect();
            this.container.style.top  = window.pageYOffset + rect.top - 2 + 'px'; // move padding-top
            this.container.style.left = window.pageXOffset + rect.right   + 'px';
        }

        setPickingRevision(rev: string): void {
            this.pickingRevision = rev;
            this.updatePickerView();
        }

        updatePickerView(toRev: string = ''): void {
            var text;
            if (this.pickingRevision) {
                text = Util.abbRevision(this.pickingRevision) + '...' + Util.abbRevision(toRev);
                this.pickButton.classList.add('picking');
                this.pickPrevButton.classList.add('none');
                this.cancelButton.classList.remove('none');
            } else {
                text = 'pick';
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
                window.open(Util.constructCompareViewURL(this.pickingRevision, this.stickingRevision));
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

    export module Util {
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

        // Github
        export var commitUrlPattern: RegExp = /\/commit\/([0-9a-f]{40})/;
        export function isCommitUrlAnchorElement(elem: HTMLElement): boolean {
            var a = <HTMLAnchorElement> elem;
            return a.nodeName === 'A' && commitUrlPattern.test(a.href) ? true : false;
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
        export function abbRevision(revision: string): string {
            var isPrev = /~$/.test(revision);
            return !isPrev ? revision.substring(0, 7) : revision.substring(0, 6) + '~';
        }
    }
}

Compaito.init();
