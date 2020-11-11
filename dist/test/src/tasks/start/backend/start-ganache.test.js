"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const http_1 = __importDefault(require("http"));
const params_1 = require("~/src/params");
const tcp_port_used_1 = __importDefault(require("tcp-port-used"));
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
const start_ganache_1 = require("~/src/tasks/start/backend/start-ganache");
describe('start-ganache.ts', async function () {
    describe('when using the buidlerevm network', async function () {
        useEnvironment_1.useDefaultEnvironment();
        it('throws when attempting to start ganache', async function () {
            await start_ganache_1.startGanache(this.env).catch(err => {
                chai_1.assert.equal(err.message, 'Cannot use buidlerevm network for this task until a JSON RPC is exposed');
            });
        });
    });
    describe('when using a network that is not buidlerevm nor localhost', async function () {
        useEnvironment_1.useEnvironment('counter', 'someothernetwork');
        it('throws when attempting to start ganache', async function () {
            await start_ganache_1.startGanache(this.env).catch(err => {
                chai_1.assert.equal(err.message, 'This plugin currently requires that the localhost network is used.');
            });
        });
    });
    describe('when the target port is in use', async function () {
        useEnvironment_1.useEnvironment('counter', 'localhost');
        let server;
        before('start a dummy server in the target port', async function () {
            server = http_1.default.createServer();
            await new Promise(resolve => {
                server.listen({
                    host: 'localhost',
                    port: params_1.testnetPort
                }, () => resolve());
            });
        });
        after('stop dummy server', async function () {
            await new Promise(resolve => {
                server.close(() => resolve());
            });
        });
        it('does nothing and returns zero when attempting to start ganache', async function () {
            const { networkId } = await start_ganache_1.startGanache(this.env);
            chai_1.assert.equal(networkId, 0, 'Ganache started when it wasnt supposed to');
        });
    });
    describe('when the target port is not in use', async function () {
        describe('when ganache is started', async function () {
            useEnvironment_1.useEnvironment('counter', 'localhost');
            let networkId;
            before('start ganache', async function () {
                const res = await start_ganache_1.startGanache(this.env);
                networkId = res.networkId;
            });
            it('returns a non-zero network id', async function () {
                chai_1.assert.isAbove(networkId, 0, 'Ganache returned an invalid network id');
            });
            it('uses the target port', async function () {
                const portInUse = await tcp_port_used_1.default.check(params_1.testnetPort);
                chai_1.assert(portInUse, 'Target port is not in use');
            });
            describe('when ganache is stopped', async function () {
                before('stop ganache', function () {
                    start_ganache_1.stopGanache();
                });
                it('releases the target port', async function () {
                    const portInUse = await tcp_port_used_1.default.check(params_1.testnetPort);
                    chai_1.assert(!portInUse, 'Target port is still in use');
                });
            });
        });
    });
    describe('Starts ganache in a non-default port by parsing the network url', function () {
        useEnvironment_1.useEnvironment('counter', 'localhost');
        let networkId;
        const testnetPortNotDefault = 48545;
        before('start ganache', async function () {
            // Inject a different port into the environment to test support for non-default ports
            const currentNetwork = this.env.network.config;
            currentNetwork.url = `http://localhost:${testnetPortNotDefault}`;
            const res = await start_ganache_1.startGanache(this.env);
            networkId = res.networkId;
        });
        it('returns a non-zero network id', async function () {
            chai_1.assert.isAbove(networkId, 0, 'Ganache returned an invalid network id');
        });
        it('uses the target port', async function () {
            const portInUse = await tcp_port_used_1.default.check(testnetPortNotDefault);
            chai_1.assert(portInUse, 'Target port is not in use');
        });
        describe('when ganache is stopped', async function () {
            before('stop ganache', function () {
                start_ganache_1.stopGanache();
            });
            it('releases the target port', async function () {
                const portInUse = await tcp_port_used_1.default.check(testnetPortNotDefault);
                chai_1.assert(!portInUse, 'Target port is still in use');
            });
        });
    });
});
//# sourceMappingURL=start-ganache.test.js.map