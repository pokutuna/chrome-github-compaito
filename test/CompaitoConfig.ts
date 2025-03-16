/// <reference path="test.d.ts" />
import * as sinon from 'sinon';
import { CompaitoConfig } from '../src/components/CompaitoConfig';
import { setupLocalStorageStub } from './LocalStorageStub';

describe('CompaitoConfig', () => {
    const storageStub = setupLocalStorageStub();

    it('#getHosts', async () => {
        let config = await CompaitoConfig.getConfig();
        assert.deepEqual(config.getHosts(), { 'github.com': true });
    });

    it('#setHosts', async () => {
        let config = await CompaitoConfig.getConfig();
        assert.throws(config.setHosts.bind(config, 'hoge'), 'Invalid hosts');
        assert.doesNotThrow(
            config.setHosts.bind(config, { 'github.com': true }),
            'Invalid hosts'
        );
    });

    it('#isHostEnabled', async () => {
        let config = await CompaitoConfig.getConfig();
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

        it('#getConfig', async () => {
            let error = sinon.stub(console, 'error');

            assert.deepEqual(
                (await CompaitoConfig.getConfig()).getHosts(),
                { 'github.com': true },
                'returns default'
            );
            assert.equal(error.callCount, 0);

            await storageStub.set({ compaito: { hosts: { hoge: true } } });
            assert.deepEqual(
                (await CompaitoConfig.getConfig()).getHosts(),
                { 'hoge': true },
                'returns stored config'
            );
        });

        it('#saveConfig', async () => {
            await CompaitoConfig.saveConfig({ hosts: { 'my.ghe.com': true } });
            const result = await storageStub.get('compaito');
            assert.deepEqual(result, { compaito: { hosts: { 'my.ghe.com': true } } });
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
