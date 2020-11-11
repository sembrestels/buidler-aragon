"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
const task_names_1 = require("~/src/tasks/task-names");
const tcp_port_used_1 = __importDefault(require("tcp-port-used"));
const path_1 = __importDefault(require("path"));
const events_1 = __importDefault(require("events"));
const isNonZeroAddress_1 = require("~/test/test-helpers/isNonZeroAddress");
const sinon_1 = __importDefault(require("sinon"));
const kill_port_1 = __importDefault(require("kill-port"));
const lodash_1 = require("lodash");
const fsUtils_1 = require("~/src/utils/fsUtils");
const testAppDir = 'test-app';
const testAppContract = 'TestContract';
const testNetwork = 'localhost';
const contractPathToModify = path_1.default.join(__dirname, '../../projects', testAppDir, 'contracts', `${testAppContract}.sol`);
describe(`Run start-task - ${testAppDir}`, function () {
    let config;
    let closeApp;
    const sandbox = sinon_1.default.createSandbox();
    const hooksEmitter = new events_1.default();
    async function getHookCall(hookName) {
        if (!config.hooks)
            throw Error('Hooks in not defined');
        const hook = config.hooks[hookName];
        if (!hook)
            throw Error(`Hook ${hookName} is not defined`);
        if (!hook.calledOnce)
            throw Error(`Hook ${hookName} was not called`);
        const { args, returnValue } = hook.getCall(0);
        const [params, bre] = args;
        return { params, bre, returnValue: returnValue && (await returnValue) };
    }
    useEnvironment_1.useEnvironment(testAppDir, testNetwork);
    before('Retrieve config and hooks', async function () {
        config = this.env.config.aragon;
        // Intercept hook calls an call an event emitter
        config.hooks = lodash_1.mapValues(config.hooks, (hook, hookName) => (...args) => {
            hooksEmitter.emit(hookName, args);
            return hook(...args);
        });
        // Spy all hooks to assert calls
        if (config.hooks)
            sandbox.spy(config.hooks);
    });
    before('Kill processes on test ports', async function () {
        await kill_port_1.default(config.appServePort);
        await kill_port_1.default(config.clientServePort);
    });
    before('Run start task until ready', async function () {
        const { close } = await this.env.run(task_names_1.TASK_START, {
            noBrowser: true,
            noBlocking: true
        });
        closeApp = close;
    });
    after('kill the start task', function () {
        if (closeApp)
            closeApp();
    });
    it('uses the target ports', async function () {
        chai_1.assert(await tcp_port_used_1.default.check(config.appServePort), 'appServePort is not being used');
        chai_1.assert(await tcp_port_used_1.default.check(config.clientServePort), 'clientServePort is not being used');
    });
    describe('Assert hooks calls', () => {
        it('preDao - with bre', async function () {
            const { bre } = await getHookCall('preDao');
            chai_1.assert(bre.config.aragon, 'no aragon config');
        });
        it('postDao - with dao, bre', async function () {
            const { params, bre } = await getHookCall('postDao');
            chai_1.assert(bre.config.aragon, 'no aragon config');
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(params.dao.address), 'no dao address');
        });
        it('preInit - with bre, returns deployed token contract', async function () {
            const { bre, returnValue } = await getHookCall('preInit');
            chai_1.assert(bre.config.aragon, 'no aragon config');
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(returnValue.rootAccount), 'no root account');
            chai_1.assert.typeOf(returnValue.intialCount, 'number', 'no intialCount');
        });
        it('getInitParams - returns init params', async function () {
            const { bre, returnValue } = await getHookCall('getInitParams');
            chai_1.assert(bre.config.aragon, 'no aragon config');
            const [intialCount] = returnValue;
            chai_1.assert.typeOf(intialCount, 'number', 'wrong intialCount param');
        });
        it('postInit - with bre, proxy', async function () {
            const { params, bre } = await getHookCall('postInit');
            chai_1.assert(bre.config.aragon, 'no aragon config');
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(params.proxy.address), 'no proxy address');
        });
    });
    describe('when modifying the contract source', async function () {
        let contractSource;
        /**
         * Modify the contract source to trigger an update
         * Once the update is complete, the postUpdate hook is called
         * which we use to assert that the update event happened
         */
        before('modify the contract source', async function () {
            contractSource = fsUtils_1.readFile(contractPathToModify);
            fsUtils_1.writeFile(contractPathToModify, `${contractSource}\n`);
            // Wait for the postUpdate to be called once
            await new Promise(resolve => hooksEmitter.on('postUpdate', resolve));
        });
        after('restore the contract source', function () {
            if (!contractSource)
                throw new Error('No contract source cached.');
            fsUtils_1.writeFile(contractPathToModify, contractSource);
        });
        it('calls the postUpdate hook with the bre and log contains additional data', async function () {
            const { params } = await getHookCall('postUpdate');
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(params.proxy.address), 'no proxy address');
        });
    });
});
//# sourceMappingURL=start-task.test.js.map