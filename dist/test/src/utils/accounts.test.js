"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
const useEnvironment_2 = require("~/test/test-helpers/useEnvironment");
const accounts_1 = require("~/src/utils/accounts");
describe('getRootAccount', () => {
    describe('when in the counter project', async function () {
        useEnvironment_1.useDefaultEnvironment();
        it('should get the account[0] on buidlerevm network', async function () {
            const root = await accounts_1.getRootAccount(this.env);
            chai_1.assert.equal(root, '0xc783df8a850f42e7F7e57013759C285caa701eB6');
        });
    });
    describe('when in the test-app project', async function () {
        useEnvironment_2.useEnvironment('test-app');
        it('should use the from addres on buidlerevm network', async function () {
            const root = await accounts_1.getRootAccount(this.env);
            chai_1.assert.equal(root, '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7');
        });
    });
});
//# sourceMappingURL=accounts.test.js.map