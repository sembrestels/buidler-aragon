"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const params_1 = require("~/src/params");
const copyExternalArtifacts_1 = require("~/src/utils/copyExternalArtifacts");
const deploy_ens_1 = require("~/src/tasks/start/backend/bases/deploy-ens");
const deploy_dao_factory_1 = require("~/src/tasks/start/backend/bases/deploy-dao-factory");
const deploy_apm_1 = require("~/src/tasks/start/backend/bases/deploy-apm");
const isNonZeroAddress_1 = require("~/test/test-helpers/isNonZeroAddress");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
describe('deploy-apm.ts', function () {
    useEnvironment_1.useDefaultEnvironment();
    describe('when an apm is created', async function () {
        let apm;
        before('create an apm instance', async function () {
            // ==================== Temporal hack >>>
            // Copy external artifacts to the local artifacts folder
            // This is a temporary hack until multiple artifacts paths are allowed
            for (const externalArtifactPath of params_1.externalArtifactPaths)
                copyExternalArtifacts_1.copyExternalArtifacts(externalArtifactPath);
            // ==================== Temporal hack <<<
            const ens = await deploy_ens_1.deployEns(this.env, this.env.artifacts);
            const daoFactory = await deploy_dao_factory_1.deployDaoFactory(this.env.artifacts);
            apm = await deploy_apm_1.deployApm(this.env, this.env.artifacts, ens, daoFactory);
        });
        it('deploys an apm instance with a valid address', function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(apm.address), 'Invalid contract address.');
        });
        it('links to a valid ENS instance', async function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(await apm.ens()));
        });
        it('links to a valid ENSSubdomainRegistrar instance', async function () {
            chai_1.assert(isNonZeroAddress_1.isNonZeroAddress(await apm.registrar()));
        });
    });
});
//# sourceMappingURL=deploy-apm.test.js.map