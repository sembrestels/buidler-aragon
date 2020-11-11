"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const aragon_1 = require("~/src/config/aragon");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
describe('index.ts', () => {
    describe('default config', async function () {
        let config;
        const defaultConfig = aragon_1.defaultAragonConfig;
        describe('when in the counter project', async function () {
            useEnvironment_1.useEnvironment('counter');
            before('retrieve config', function () {
                config = this.env.config.aragon;
            });
            it('resulting config contains default values', function () {
                chai_1.assert.deepEqual(lodash_1.pick(config, Object.keys(defaultConfig)), defaultConfig, 'config is different');
            });
        });
        describe('when in the token-wrapper project', async function () {
            useEnvironment_1.useEnvironment('token-wrapper');
            before('retrieve config', function () {
                config = this.env.config.aragon;
            });
            it('resulting config does not contain some default values', function () {
                chai_1.assert.notEqual(config.appServePort, defaultConfig.appServePort, 'appServePort is equal');
                chai_1.assert.notEqual(config.clientServePort, defaultConfig.clientServePort, 'clientServePort is equal');
            });
        });
    });
    describe('hooks', async function () {
        let hooks;
        describe('when in the counter project', async function () {
            useEnvironment_1.useEnvironment('counter');
            before('retrieve hooks', function () {
                const config = this.env.config.aragon;
                hooks = config.hooks;
            });
            it('doesnt have hooks defined', async function () {
                chai_1.assert(hooks == undefined);
            });
        });
        describe('when in the token-wrapper project', async function () {
            useEnvironment_1.useEnvironment('token-wrapper');
            before('retrieve hooks', function () {
                const config = this.env.config.aragon;
                hooks = config.hooks;
            });
            it('has a getInitParams hook', async function () {
                chai_1.assert(hooks.getInitParams != undefined);
            });
            it('has a preInit hook', async function () {
                chai_1.assert(hooks.preInit != undefined);
            });
            it('has a postInit hook', async function () {
                chai_1.assert(hooks.postInit != undefined);
            });
        });
    });
});
//# sourceMappingURL=index.test.js.map