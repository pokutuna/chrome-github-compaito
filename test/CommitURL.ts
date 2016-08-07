/// <reference path="test.d.ts" />
import { CommitURL } from '../src/components/CommitURL';

describe('CommitURL', () => {
    const commitHref = 'https://github.com/pokutuna/chrome-github-compaito/commit/22468857577db9524b6956c3852a1ec88199f5ec';
    const commitInPRHref = 'https://github.com/pokutuna/chrome-github-compaito/pull/5/commits/22468857577db9524b6956c3852a1ec88199f5ec';

    it('#revision', () => {
        assert.equal(
            (new CommitURL(commitHref, false)).revision,
            '22468857577db9524b6956c3852a1ec88199f5ec'
        );
        assert.equal(
            (new CommitURL(commitHref, true)).revision,
            '22468857577db9524b6956c3852a1ec88199f5ec~'
        );
        assert.equal(
            (new CommitURL(commitInPRHref, false)).revision,
            '22468857577db9524b6956c3852a1ec88199f5ec'
        );
        assert.equal(
            (new CommitURL(commitInPRHref, true)).revision,
            '22468857577db9524b6956c3852a1ec88199f5ec~'
        );
    });

    it('#abbrevRevision', () => {
        assert.equal((new CommitURL(commitHref, false)).abbrevRevision, '2246885');
        assert.equal((new CommitURL(commitHref, true)).abbrevRevision, '224688~');
        assert.equal((new CommitURL(commitInPRHref, false)).abbrevRevision, '2246885');
        assert.equal((new CommitURL(commitInPRHref, true)).abbrevRevision, '224688~');
    });

    it('#isInPullRequest', () => {
        assert.notOk((new CommitURL(commitHref, false)).isInPullRequest);
        assert.notOk((new CommitURL(commitHref, true)).isInPullRequest);
        assert.ok((new CommitURL(commitInPRHref, false)).isInPullRequest);
        assert.ok((new CommitURL(commitInPRHref, true)).isInPullRequest);
    });

    it('#owner', () => {
        assert.equal((new CommitURL(commitHref)).owner, 'pokutuna');
        assert.equal((new CommitURL(commitInPRHref)).owner, 'pokutuna');
    });

    it('#repo', () => {
        assert.equal((new CommitURL(commitHref)).repo, 'chrome-github-compaito');
        assert.equal((new CommitURL(commitInPRHref)).repo, 'chrome-github-compaito');
    });

    describe('statics', () => {
        it('#composeDiffURL', () => {
            let sha1 = 'a'.repeat(40);
            let a = new CommitURL(`https://github.com/owner/repo/commit/${sha1}`, false);
            let aPrev = new CommitURL(`https://github.com/owner/repo/commit/${sha1}`, true);
            let aInPR = new CommitURL(`https://github.com/owner/repo/pull/1/commits/${sha1}`, false);
            let aPrevInPR = new CommitURL(`https://github.com/owner/repo/pull/1/commits/${sha1}`, true);

            assert.equal(
                CommitURL.composeDiffURL(a, a),
                `https://github.com/owner/repo/compare/${sha1}...${sha1}`
            );
            assert.equal(
                CommitURL.composeDiffURL(a, aPrev),
                `https://github.com/owner/repo/compare/${sha1}...${sha1}~`
            );
            assert.equal(
                CommitURL.composeDiffURL(a, aInPR),
                `https://github.com/owner/repo/compare/${sha1}...${sha1}`
            );
            assert.equal(
                CommitURL.composeDiffURL(a, aPrevInPR),
                `https://github.com/owner/repo/compare/${sha1}...${sha1}~`
            );

            assert.equal(
                CommitURL.composeDiffURL(aInPR, aInPR),
                `https://github.com/owner/repo/pull/1/files/${sha1}..${sha1}`
            );
            assert.equal(
                CommitURL.composeDiffURL(aInPR, aPrevInPR),
                `https://github.com/owner/repo/compare/${sha1}...${sha1}~`
            );
        });
    });
});
