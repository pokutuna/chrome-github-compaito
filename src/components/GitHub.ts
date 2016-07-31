class CommitURL {
    url: string;
    _parts: string[];
    isRefParent: boolean;

    constructor(url: string, isRefParent: boolean = false) {
        this.url = url;

        // ["{schema}:", "", "{host}", "{owner}", "{repo}", "commit", "{sha1}"]
        //   or
        // ["{schema}:", "", "{host}", "{owner}", "{repo}", "pull", "{num}", "commits", "{sha1}"]
        this._parts = this.url.split('/');

        this.isRefParent = isRefParent;
    }

    get revision(): string {
        const match = this.url.match(CommitURL.pattern);
        return this.isRefParent ? match[1] : match[1] + '~';
    }

    get abbrevRevision(): string {
        const revision = this.revision;
        return this.isRefParent
            ? revision.substring(0, 7)
            : revision.substring(0, 6) + '~';
    }

    get isInPullRequest(): boolean {
        return this._parts[5] === 'pull' ? true : false;
    }

    get owner(): string {
        return this._parts[3];
    }

    get repo(): string {
        return this._parts[4];
    }

    get issue(): string {
        return this._parts[6];
    }

    static pattern: RegExp = /\/commits?\/([0-9a-f]{40})/;

    static isCommitURLString(url: string): boolean {
        return this.pattern.test(url) && !/#$/.test(url) ? true : false;
    }

    static composeDiffURL(from: CommitURL, to: CommitURL): string {

        // /{org}/{repo}/pull/{issue}/files/{from}..{to}
        if (from.isInPullRequest && to.isInPullRequest &&
            // Check same repository
            from.owner === to.owner && from.repo === to.repo &&
            // Cannot use `~` in PR compare view
            !from.isRefParent && !to.isRefParent) {
            const pr = from._parts.slice(0, 7).join('/');
            return `${pr}/files/${from.revision}..${to.revision}`;
        }

        // /{org}/{repo}/compare/{from}...{to}
        const repo = from._parts.slice(0, 5).join('/');
        return `${repo}/compare/${from.revision}...${to.revision}`;
    }
}

export { CommitURL };
