"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const arappUtils_1 = require("~/src/utils/arappUtils");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
describe('arapp.ts', function () {
    useEnvironment_1.useDefaultEnvironment();
    it('should read an arapp.json file', async function () {
        const arapp = await arappUtils_1.readArapp();
        chai_1.assert(arapp != null);
    });
    it('should retrieve the correct main contract path', function () {
        chai_1.assert.equal(arappUtils_1.getMainContractPath(), 'contracts/Counter.sol', 'Incorrect main contract path.');
    });
    it('should retrieve the correct main contract name', function () {
        chai_1.assert.equal(arappUtils_1.getMainContractName(), 'Counter');
    });
});
//# sourceMappingURL=arappUtils.test.js.map