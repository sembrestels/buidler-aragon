"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const deploy_bases_1 = __importDefault(require("~/src/tasks/start/backend/bases/deploy-bases"));
const create_app_1 = require("~/src/tasks/start/backend/create-app");
const create_dao_1 = require("~/src/tasks/start/backend/create-dao");
const set_permissions_1 = require("~/src/tasks/start/backend/set-permissions");
const update_app_1 = require("~/src/tasks/start/backend/update-app");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
const task_names_1 = require("~/src/tasks/task-names");
const counter_behavior_1 = require("./counter-behavior");
const start_ganache_1 = require("~/src/tasks/start/backend/start-ganache");
const arappUtils_1 = require("~/src/utils/arappUtils");
const appName_1 = require("~/src/utils/appName");
describe('update-app.ts', function () {
    // Note: These particular tests use localhost instead of buidlerevm.
    // This is required for bases to have the expected addresses,
    // And because we want to restart the chain on certain tests.
    useEnvironment_1.useEnvironment('counter', 'localhost');
    let arapp, appName;
    let ensAddress, daoFactoryAddress;
    let dao;
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
    before('deploy a dao', async function () {
        dao = await create_dao_1.createDao(this.env, this.env.artifacts, daoFactoryAddress);
    });
    after('stop ganache', async function () {
        start_ganache_1.stopGanache();
    });
    describe('when an app is created', function () {
        let proxy, repo, implementation;
        before('create app', async function () {
            ;
            ({ proxy, repo, implementation } = await create_app_1.createApp({ appName, dao, ensAddress }, this.env));
            await proxy.initialize();
            const arapp = arappUtils_1.readArapp();
            await set_permissions_1.setAllPermissionsOpenly(dao, proxy, arapp, this.env, this.env.artifacts);
            // Necessary for using behaviors.
            this.proxy = proxy;
        });
        describe('when updating the app', function () {
            let implementationAddress, version, uri;
            const port = 666;
            before('update app', async function () {
                // Compile to avoid getting a tx nonce error.
                // Appears to be a caching issue with truffle/ganache.
                await this.env.run(task_names_1.TASK_COMPILE);
                ({ implementationAddress, version, uri } = await update_app_1.updateApp({ appName, dao, repo, appServePort: port }, this.env));
            });
            it('uses a different implementation', function () {
                chai_1.assert.notEqual(implementation.addresses, implementationAddress);
            });
            it('the dao references the correct implementation for it', async function () {
                const appId = appName_1.getAppId(appName);
                chai_1.assert.equal(implementationAddress, await dao.getApp(await dao.APP_BASES_NAMESPACE(), appId), 'Incorrect implementation in proxy');
            });
            describe('when interacting with the proxy', function () {
                it('proxy references the dao that created it', async function () {
                    chai_1.assert.equal(dao.address, await proxy.kernel(), 'Incorrect kernel in proxy');
                });
                counter_behavior_1.itBehavesLikeACounterContract();
            });
            describe('when interacting with the repo', function () {
                it('returns a valid version count', async function () {
                    const count = (await repo.getVersionsCount()).toString();
                    chai_1.assert.equal(count, 1, 'Invalid version count');
                });
                it('reports the correct content uri', async function () {
                    chai_1.assert.equal(uri, `http://localhost:${port}`);
                });
                it('reports the correct repo version', async function () {
                    chai_1.assert.equal(version[0], 1, 'Incorrect major version');
                });
                it('updates the repo version', async function () {
                    const latest = (await repo.getLatest())[0];
                    const major = latest[0].toNumber();
                    chai_1.assert.equal(major, 1, 'Incorrect major version');
                });
            });
        });
    });
});
//# sourceMappingURL=update-app.test.js.map