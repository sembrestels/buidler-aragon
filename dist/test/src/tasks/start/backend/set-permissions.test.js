"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const deploy_bases_1 = __importDefault(require("~/src/tasks/start/backend/bases/deploy-bases"));
const create_dao_1 = require("~/src/tasks/start/backend/create-dao");
const create_app_1 = require("~/src/tasks/start/backend/create-app");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
const params_1 = require("~/src/params");
const set_permissions_1 = require("~/src/tasks/start/backend/set-permissions");
const start_ganache_1 = require("~/src/tasks/start/backend/start-ganache");
const arappUtils_1 = require("~/src/utils/arappUtils");
describe('set-permissions.ts', function () {
    // Note: These particular tests use localhost instead of buidlerevm.
    // This is required for bases to have the expected addresses,
    // And because we want to restart the chain on certain tests.
    useEnvironment_1.useEnvironment('counter', 'localhost');
    let arapp, appName;
    let ensAddress, daoFactoryAddress;
    let dao, acl;
    let proxy;
    before('Read arapp in test folder after useEnviornment chdir', () => {
        arapp = arappUtils_1.readArapp();
        appName = arappUtils_1.parseAppName(arapp);
    });
    before('start ganache', async function () {
        await start_ganache_1.startGanache(this.env);
    });
    before('deploy bases', async function () {
        ;
        ({ ensAddress, daoFactoryAddress } = await deploy_bases_1.default(this.env));
    });
    before('deploy a dao and retrieve acl', async function () {
        dao = await create_dao_1.createDao(this.env, this.env.artifacts, daoFactoryAddress);
        const ACL = this.env.artifacts.require('ACL');
        acl = await ACL.at(await dao.acl());
    });
    before('create app', async function () {
        ;
        ({ proxy } = await create_app_1.createApp({ appName, dao, ensAddress }, this.env));
        await proxy.initialize();
    });
    after('stop ganache', async function () {
        start_ganache_1.stopGanache();
    });
    describe('when setAllPermissionsOpenly is called', function () {
        before('call setAllPermissionsOpenly', async function () {
            const arapp = arappUtils_1.readArapp();
            await set_permissions_1.setAllPermissionsOpenly(dao, proxy, arapp, this.env, this.env.artifacts);
        });
        it('properly sets the INCREMENT_ROLE permission', async function () {
            chai_1.assert.equal(await acl.hasPermission(params_1.ANY_ADDRESS, proxy.address, await proxy.INCREMENT_ROLE()), true, 'Invalid permission.');
        });
        it('properly sets the DECREMENT_ROLE permission', async function () {
            chai_1.assert.equal(await acl.hasPermission(params_1.ANY_ADDRESS, proxy.address, await proxy.DECREMENT_ROLE()), true, 'Invalid permission.');
        });
    });
});
//# sourceMappingURL=set-permissions.test.js.map