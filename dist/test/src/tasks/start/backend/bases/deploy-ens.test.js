"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
const deploy_ens_1 = require("~/src/tasks/start/backend/bases/deploy-ens");
const isNonZeroAddress_1 = require("~/test/test-helpers/isNonZeroAddress");
describe('deploy-ens.ts', function () {
    useEnvironment_1.useDefaultEnvironment();
    describe('when an ens instance is deployed', async function () {
        let ens;
        before('deploy ens instance', async function () {
            ens = await deploy_ens_1.deployEns(this.env, this.env.artifacts);
        });
        it('deploys an ens instance with a valid address', function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(ens.address), 'Invalid contract address.');
        });
        it('sets the deploying address as the owner of the first record', async function () {
            const rootAccount = (await this.env.web3.eth.getAccounts())[0];
            const owner = await ens.owner('0x0');
            chai_1.assert.equal(owner, rootAccount, 'Invalid owner for the ens first node');
        });
    });
});
//# sourceMappingURL=deploy-ens.test.js.map