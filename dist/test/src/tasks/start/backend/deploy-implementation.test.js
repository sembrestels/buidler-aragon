"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const isNonZeroAddress_1 = require("~/test/test-helpers/isNonZeroAddress");
const deploy_implementation_1 = require("~/src/tasks/start/backend/deploy-implementation");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
describe('deploy-implementation.ts', function () {
    useEnvironment_1.useDefaultEnvironment();
    describe('when deploying an implementation of an app', function () {
        let implementation;
        before('deploy an implementation of an app', async function () {
            implementation = await deploy_implementation_1.deployImplementation(this.env.artifacts);
        });
        it('deploys a contract with a valid address', async function () {
            chai_1.assert.equal(isNonZeroAddress_1.isNonZeroAddress(implementation.address), true, 'Invalid contract address.');
        });
    });
});
//# sourceMappingURL=deploy-implementation.test.js.map