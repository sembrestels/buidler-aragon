"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const create_dao_1 = require("~/src/tasks/start/backend/create-dao");
const deploy_dao_factory_1 = require("~/src/tasks/start/backend/bases/deploy-dao-factory");
const isNonZeroAddress_1 = require("~/test/test-helpers/isNonZeroAddress");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
describe('create-dao.ts', function () {
    useEnvironment_1.useDefaultEnvironment();
    describe('when a dao factory is created', async function () {
        let daoFactory;
        before('create a dao factory', async function () {
            daoFactory = await deploy_dao_factory_1.deployDaoFactory(this.env.artifacts);
        });
        describe('when a dao is created', function () {
            let dao;
            before('create a dao', async function () {
                dao = await create_dao_1.createDao(this.env, this.env.artifacts, daoFactory.address);
            });
            it('deploys a dao with a valid address', function () {
                chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(dao.address), 'Invalid contract address.');
            });
            it('has a valid ACL', async function () {
                chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(await dao.acl()), 'Invalid acl address.');
            });
            it('has been initialized', async function () {
                chai_1.assert.equal(await dao.hasInitialized(), true, 'DAO not initialized.');
            });
        });
    });
});
//# sourceMappingURL=create-dao.test.js.map