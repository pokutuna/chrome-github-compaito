export interface CompaitoConfig {
    hosts: { [key:string]: boolean }
}

export var DEFAULT_CONFIG: CompaitoConfig  = {
    hosts: { 'github.com': true }
}

export module util {
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

export module github {
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
    export function abbrevRevision(revision: string): string {
        var isPrev = /~$/.test(revision);
        return !isPrev ? revision.substring(0, 7) : revision.substring(0, 6) + '~';
    }
}

interface DelegatedEvent extends Event {
    delegateTarget?: HTMLElement
}
interface LocationHavingOrigin extends Location {
    origin: string // already implemented on Chrome
}
