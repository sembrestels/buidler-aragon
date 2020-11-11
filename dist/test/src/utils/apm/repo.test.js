"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const params_1 = require("~/src/params");
const apm_1 = require("~/src/utils/apm");
const providers_1 = require("~/test/test-helpers/providers");
describe('apm > repo', () => {
    const provider = providers_1.getMainnetProvider();
    const appName = 'finance.aragonpm.eth';
    describe('Return an existing version of a repo', () => {
        it('first finance.aragonpm.eth version in mainnet', async () => {
            const version = '1.0.0';
            // Since it's requesting a fixed version, it's safe
            // to compare specific data since it would never change
            const versionData = await apm_1.getRepoVersion(appName, version, provider);
            const expectedVersionData = {
                version,
                contractAddress: '0xe583D4d74A50F3394AD92597F86277289B159934',
                contentUri: 'ipfs:QmWWNkXdGDnTaxAxw6vtCM21SDJeWLyaoUzDb3skYXynmo'
            };
            chai_1.assert.deepEqual(versionData, expectedVersionData, 'wrong versionData');
        });
    });
    describe('Publish version permissions', () => {
        const allowedSender = '0xE04cAbcB24e11620Dd62bB99c396E76cEB578914';
        const notAllowedSender = params_1.ZERO_ADDRESS;
        it('Allowed address should be able to publish', async () => {
            const canPerform = await apm_1.canPublishVersion(appName, allowedSender, provider);
            chai_1.assert.isTrue(canPerform, 'canPerform should be true');
        });
        it('Not allowed address should not be able to publish', async () => {
            const canPerform = await apm_1.canPublishVersion(appName, notAllowedSender, provider);
            chai_1.assert.isFalse(canPerform, 'canPerform should be false');
        });
    });
});
//# sourceMappingURL=repo.test.js.map