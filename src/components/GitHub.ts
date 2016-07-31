class GitHub {
    static commitUrlPattern: RegExp = /\/commits?\/([0-9a-f]{40})/;

    static isCommitUrlAnchorElement(elem: HTMLElement): boolean {
        const a = <HTMLAnchorElement> elem;
        return a.nodeName === 'A' &&
            this.commitUrlPattern.test(a.href) &&
            !/#$/.test(a.href) ? true : false;
     }

    static constructCompareViewUrl(fromRev: string, toRev: string): string {
        var diffArg = [fromRev, toRev].join('...');
        var pattern: RegExp = /\/([^\/]+)\/([^\/]+)(\/.*)?/;
        var match = location.pathname.match(pattern);
        return [location.origin, match[1], match[2], 'compare', diffArg].join('/');
    }
}

class CommitURL {
    url: string;
    isRefParent: boolean

    constructor(url: string, isRefParent: boolean = false) {
        this.url          = url;
        this.isRefParent = isRefParent;
    }

    get revision(): string {
        const match = this.url.match(GitHub.commitUrlPattern);
        return this.isRefParent ? match[1] : match[1] + '~';
    }

    get abbrevRevision(): string {
        const revision = this.revision;
        return this.isRefParent
            ? revision.substring(0, 7)
            : revision.substring(0, 6) + '~';
    }

    get isInPullRequest(): boolean {
        return false; // TODO
    }
}

export { GitHub, CommitURL };
