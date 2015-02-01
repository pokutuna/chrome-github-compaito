console.log('content')

module Compaito {

    export function init(): void {
        var revPickerr = new RevisionPicker();

        document.body.addEventListener('mouseover', Util.delegate(
            Util.isCommitUrlAnchorElement,
            (event) => revPickerr.show(event.delegateTarget)
        ));

        document.body.addEventListener('mouseout', Util.delegate(
            Util.isCommitUrlAnchorElement,
            (event) => setTimeout(() => { revPickerr.hide() }, 200)
        ));
    }

    // interfaces
    interface DelegatedEvent extends Event {
        delegateTarget?: HTMLElement
    }

    // classes
    export class RevisionPicker {
        container: HTMLDivElement;
        pickButton: HTMLButtonElement;
        cancelButton: HTMLButtonElement;

        stickingElem: HTMLElement;
        stickingRevision: string = '';

        constructor() {
            this.container = document.createElement('div');
            Util.addClasses(this.container, ['container', 'none']);

            this.pickButton = document.createElement('button');
            this.pickButton.textContent = 'pick';
            this.pickButton.addEventListener('click', (e) => this.onPick(e));
            Util.addClasses(this.pickButton, ['pick-button']);

            this.cancelButton = document.createElement('button');
            this.cancelButton.textContent = 'x';
            this.cancelButton.addEventListener('click', (e) => this.onCancel(e));
            Util.addClasses(this.cancelButton, ['cancel-button', 'none']);

            this.container.appendChild(this.pickButton);
            this.container.appendChild(this.cancelButton);
            document.body.appendChild(this.container);
        }

        show(relatedElem:HTMLElement) {
            this.stickingElem = relatedElem;
            var rect = this.stickingElem.getBoundingClientRect();
            this.container.style.position = 'absolute';
            this.container.style.top  = window.pageYOffset + rect.top + 'px';
            this.container.style.left = window.pageXOffset + rect.right + 'px';
            this.container.classList.remove('none');
        }

        hide() {
            this.container.classList.add('none');
        }

        onPick(event: MouseEvent) {
            var a = <HTMLAnchorElement> this.stickingElem;
            var currentRev = this.stickingRevision;
            this.stickingRevision = Util.extractRevision(a.href);
            if (currentRev.length > 0) this.openCompareView(currentRev, this.stickingRevision);
            this.pickButton.textContent = Util.abbRevision(this.stickingRevision) + '...';
            this.cancelButton.classList.remove('none');
        }

        onCancel(event: MouseEvent) {
            this.pickButton.textContent = 'pick';
            this.cancelButton.classList.add('none');
            this.stickingRevision = '';
            this.hide();
        }

        openCompareView(from, to: string) {
            location.pathname = Util.constructCompareViewPath(from, to);
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
        export function constructCompareViewPath(fromRev, toRev: string): string {
            var diffArg = [fromRev, toRev].join('...');
            var pattern: RegExp = /\/([^\/]+)\/([^\/]+)\/.*/;
            var match = location.pathname.match(pattern);
            return [match[1], match[2], 'compare', diffArg].join('/');
        }
        export function abbRevision(revision: string): string {
            return revision.substring(0, 7) // follow Github abbreviation
        }

    }
}

Compaito.init();
