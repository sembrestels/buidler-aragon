"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const plugins_1 = require("@nomiclabs/buidler/plugins");
const params_1 = require("~/src/params");
const apm_1 = require("~/src/utils/apm");
const providers_1 = require("~/test/test-helpers/providers");
describe('apm > assertCanPublish', () => {
    const provider = providers_1.getMainnetProvider();
    const financeManager = '0xE04cAbcB24e11620Dd62bB99c396E76cEB578914';
    const testCases = {
        'finance.aragonpm.eth': {
            [financeManager]: true,
            [params_1.ZERO_ADDRESS]: false
        },
        'newapp.aragonpm.eth': {
            [financeManager]: true,
            [params_1.ZERO_ADDRESS]: false
        },
        'newapp.open.aragonpm.eth': {
            [financeManager]: true,
            [params_1.ZERO_ADDRESS]: true
        }
    };
    describe(`Test can publish with mainnet apps`, () => {
        for (const [appName, senders] of Object.entries(testCases))
            for (const [sender, expectedIsAllowed] of Object.entries(senders))
                it(`${sender} should ${expectedIsAllowed ? 'be' : 'not be'} able to publish ${appName}`, async () => {
                    const isAllowed = await apm_1.assertCanPublish(appName, sender, provider).then(() => true, 
                    // Wrap function to return a binary true / false for expected errors only
                    e => {
                        if (e instanceof plugins_1.BuidlerPluginError)
                            return false;
                        else
                            throw e;
                    });
                    chai_1.assert.equal(isAllowed, expectedIsAllowed, 'Wrong isAllowed return');
                });
    });
});
//# sourceMappingURL=assertCanPublish.test.js.map