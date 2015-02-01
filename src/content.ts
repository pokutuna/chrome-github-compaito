console.log('content')

module Compaito {

    export function init(): void {
        var diffPicker = new RevisionPicker();

        document.body.addEventListener('mouseover', Util.delegate(
            Util.isCommitUrlAnchorElement,
            (event) => diffPicker.show(event.delegateTarget)
        ));

        document.body.addEventListener('mouseout', Util.delegate(
            Util.isCommitUrlAnchorElement,
            (event) => setTimeout(() => { diffPicker.hide() }, 200)
        ));
    }

    // interfaces
    interface DelegatedEvent extends Event {
        delegateTarget?: HTMLElement
    }

    // classes
    export class RevisionPicker {
        elem: HTMLButtonElement;
        stickingElem: HTMLElement;

        constructor() {
            this.elem = document.createElement('button');
            this.elem.textContent = 'pick';
            ['chrome-extension-compaito', 'diff-picker', 'none'].forEach(
                (c: string) => this.elem.classList.add(c)
            );
            this.elem.addEventListener('click', (e) => this.onPickerClick(e));
            document.body.appendChild(this.elem);
        }

        show(relatedElem:HTMLElement) {
            this.stickingElem = relatedElem;
            console.log(this.stickingElem)
            var rect = this.stickingElem.getBoundingClientRect();
            this.elem.style.position = 'absolute';
            this.elem.style.top  = window.pageYOffset + rect.top + 'px';
            this.elem.style.left = window.pageXOffset + rect.right + 'px';
            this.elem.classList.remove('none');
        }

        hide() {
            this.elem.classList.add('none');
        }

        onPickerClick(event: MouseEvent) {
            var a = <HTMLAnchorElement> this.stickingElem;
            var match = a.href.match(Util.commitUrlPattern);
            this.elem.textContent = Util.abbRevision(match[1]);
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

        export var commitUrlPattern: RegExp = /\/commit\/([0-9a-f]{40})/;
        export function isCommitUrlAnchorElement(elem: HTMLElement): boolean {
            var a = <HTMLAnchorElement> elem;
            return a.nodeName === 'A' && commitUrlPattern.test(a.href) ? true : false;
        }

        export function abbRevision(revision: string): string {
            return revision.substring(0, 7) // follow Github abbreviation
        }
    }
}

Compaito.init();
