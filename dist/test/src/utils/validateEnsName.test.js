"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const validateEnsName_1 = require("~/src/utils/validateEnsName");
describe('validateEnsName.ts', function () {
    it('should validate ens names for development', async function () {
        chai_1.assert.equal(validateEnsName_1.validateEnsName('voting.aragonpm.eth'), true);
        chai_1.assert.equal(validateEnsName_1.validateEnsName('voting.open.aragonpm.eth'), false);
        chai_1.assert.equal(validateEnsName_1.validateEnsName('Voting.aragonpm.eth'), false);
        chai_1.assert.equal(validateEnsName_1.validateEnsName('voting.aragon.eth'), false);
        chai_1.assert.equal(validateEnsName_1.validateEnsName('voting.aragonpm.btc'), false);
    });
});
//# sourceMappingURL=validateEnsName.test.js.map