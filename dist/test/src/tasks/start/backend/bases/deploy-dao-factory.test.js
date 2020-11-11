"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const deploy_dao_factory_1 = require("~/src/tasks/start/backend/bases/deploy-dao-factory");
const isNonZeroAddress_1 = require("~/test/test-helpers/isNonZeroAddress");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
describe('deploy-dao-factory.ts', function () {
    useEnvironment_1.useDefaultEnvironment();
    describe('when a dao factory is created', async function () {
        let daoFactory;
        before('create a dao factory', async function () {
            daoFactory = await deploy_dao_factory_1.deployDaoFactory(this.env.artifacts);
        });
        it('deploys a dao factory with a valid address', function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(daoFactory.address), 'Invalid contract address.');
        });
        it('links to a valid Kernel base', async function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(await daoFactory.baseKernel()));
        });
        it('links to a valid ACL base', async function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(await daoFactory.baseACL()));
        });
        it('links to a valid  EVMScriptRegistryFactory base', async function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(await daoFactory.regFactory()));
        });
    });
});
//# sourceMappingURL=deploy-dao-factory.test.js.map