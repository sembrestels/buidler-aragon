"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const isNonZeroAddress_1 = require("~/test/test-helpers/isNonZeroAddress");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
const deploy_bases_1 = __importDefault(require("~/src/tasks/start/backend/bases/deploy-bases"));
const params_1 = require("~/src/params");
const deploy_ens_1 = require("~/src/tasks/start/backend/bases/deploy-ens");
const start_ganache_1 = require("~/src/tasks/start/backend/start-ganache");
describe('deploy-bases.ts', function () {
    // Note: These particular tests use localhost instead of buidlerevm.
    // This is required for bases to have the expected addresses,
    // And because we want to restart the chain on certain tests.
    useEnvironment_1.useEnvironment('counter', 'localhost');
    describe('when no bases are deployed', async function () {
        let ensAddress, daoFactoryAddress, apmAddress;
        before('start ganache', async function () {
            await start_ganache_1.startGanache(this.env);
        });
        before('deploy bases', async function () {
            // Destrucure response into existing variables.
            // Prettier insists on this format ¯\_(ツ)_/¯
            ;
            ({ ensAddress, daoFactoryAddress, apmAddress } = await deploy_bases_1.default(this.env));
        });
        after('stop ganache', function () {
            start_ganache_1.stopGanache();
        });
        it('deploys an ens instance with a valid address', function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(ensAddress), 'Invalid contract address.');
        });
        it('deploys a dao factory instance with a valid address', function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(daoFactoryAddress), 'Invalid contract address.');
        });
        it('deploys an apm instance with a valid address', function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(apmAddress), 'Invalid contract address.');
        });
        it('deploys bases with the expected addresses', async function () {
            chai_1.assert.equal(ensAddress, params_1.defaultLocalAragonBases.ensAddress, 'Non matching ens address');
            chai_1.assert.equal(apmAddress, params_1.defaultLocalAragonBases.apmAddress, 'Non matching dao factory address');
            chai_1.assert.equal(daoFactoryAddress, params_1.defaultLocalAragonBases.daoFactoryAddress, 'Non matching apm address');
        });
        describe('when all bases are deployed', async function () {
            let blockBefore;
            describe('when attempting to deploy bases again', async function () {
                before('deploy bases again', async function () {
                    blockBefore = await this.env.web3.eth.getBlockNumber();
                    ({ ensAddress, daoFactoryAddress, apmAddress } = await deploy_bases_1.default(this.env));
                });
                it('should not deploy any contracts', async function () {
                    const currentBlock = await this.env.web3.eth.getBlockNumber();
                    chai_1.assert.equal(blockBefore, currentBlock, 'deployAragonBases emitted transactions');
                });
                it('should return the default addresses', async function () {
                    chai_1.assert.equal(ensAddress, params_1.defaultLocalAragonBases.ensAddress, 'Non matching ens address');
                    chai_1.assert.equal(apmAddress, params_1.defaultLocalAragonBases.apmAddress, 'Non matching dao factory address');
                    chai_1.assert.equal(daoFactoryAddress, params_1.defaultLocalAragonBases.daoFactoryAddress, 'Non matching apm address');
                });
            });
        });
    });
    describe('when some bases are deployed', async function () {
        before('start ganache', async function () {
            await start_ganache_1.startGanache(this.env);
        });
        after('stop ganache', function () {
            start_ganache_1.stopGanache();
        });
        before('deploy an ENS instance', async function () {
            const ens = await deploy_ens_1.deployEns(this.env, this.env.artifacts);
            chai_1.assert.equal(ens.address, params_1.defaultLocalAragonBases.ensAddress, 'Test needs ENS to be deployed at the expected address.');
        });
        it('throws when attempting to deploy bases', async function () {
            await deploy_bases_1.default(this.env).catch(err => {
                chai_1.assert.equal(err.message, 'Only some Aragon bases are deployed in the current testnet. Restart its state and retry', 'An error was thrown but it wasnt the expected error.');
            });
        });
    });
});
//# sourceMappingURL=deploy-bases.test.js.map