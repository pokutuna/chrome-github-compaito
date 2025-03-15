/// <reference path="test.d.ts" />
import * as sinon from 'sinon';
import { CompaitoConfig } from '../src/components/CompaitoConfig';

describe('CompaitoConfig', () => {
    afterEach(() => { localStorage.clear() });

    it('#getHosts', () => {
        let config = CompaitoConfig.getConfig();
        assert.deepEqual(config.getHosts(), { 'github.com': true });
    });

    it('#setHosts', () => {
        let config = CompaitoConfig.getConfig();
        assert.throws(config.setHosts.bind(config, 'hoge'), 'Invalid hosts');
        assert.doesNotThrow(
            config.setHosts.bind(config, { 'github.com': true }),
            'Invalid hosts'
        );
    });

    it('#isHostEnabled', () => {
        let config = CompaitoConfig.getConfig();
        config.setHosts({
            'github.com': true,
            'my.ghe.com': true,
            'your.ghe.com': false,
        });

        assert.ok(config.isHostEnabled('https://github.com'));
        assert.ok(config.isHostEnabled('http://my.ghe.com'));
        assert.notOk(config.isHostEnabled('http://your.ghe.com'));

        assert.ok(config.isHostEnabled('http://github.com'));
        assert.ok(config.isHostEnabled('https://github.com/pokutuna'));
        assert.ok(config.isHostEnabled('https://github.com/pokutuna/chrome-github-compaito'));

        assert.notOk(config.isHostEnabled('https://github.com:80/pokutuna'));
    });

    describe('statics', () => {
        it('#DEFAULT_CONFIG', () => {
            assert.deepEqual(
                CompaitoConfig.DEFAULT_CONFIG,
                { hosts: { 'github.com': true } }
            );
        });

        it('#getConfig', () => {
            let error = sinon.stub(console, 'error');

            assert.deepEqual(
                CompaitoConfig.getConfig().getHosts(),
                { 'github.com': true },
                'returns default'
            );
            assert.equal(error.callCount, 0);

            localStorage.setItem('compaito', '{ invalidjson }');
            assert.deepEqual(
                CompaitoConfig.getConfig().getHosts(),
                { 'github.com': true },
                'returns default with invalid'
            );
            assert.equal(error.callCount, 1);
            assert.match(error.args[0][0], /SyntaxError: Expected property name or '}' in JSON/);

            localStorage.setItem('compaito', '{ "hosts": { "hoge": true } }');
            assert.deepEqual(
                CompaitoConfig.getConfig().getHosts(),
                { 'hoge': true },
                'returns stored config'
            );
        });

        it('#saveConfig', () => {
            assert.equal(localStorage.getItem('compaito'), null);
            CompaitoConfig.saveConfig({ hosts: { 'my.ghe.com': true } });
            assert.equal(localStorage.getItem('compaito'), '{"hosts":{"my.ghe.com":true}}');
        });

        it('#isHostsValid', () => {
            assert.notOk(CompaitoConfig.isHostsValid(null));
            assert.notOk(CompaitoConfig.isHostsValid(undefined));

            assert.ok(CompaitoConfig.isHostsValid({}));
            assert.ok(CompaitoConfig.isHostsValid({ 'github.com': true, 'my.ghe.com': false }));
            assert.ok(CompaitoConfig.isHostsValid({ 'github.com': false }));
            assert.notOk(CompaitoConfig.isHostsValid({ 'github.com': 1 }));
        });
    });
});
