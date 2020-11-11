"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const useEnvironment_1 = require("~/test/test-helpers/useEnvironment");
const task_names_1 = require("~/src/tasks/task-names");
const start_ganache_1 = require("~/src/tasks/start/backend/start-ganache");
const deploy_bases_1 = __importDefault(require("~/src/tasks/start/backend/bases/deploy-bases"));
const apm_1 = require("~/src/utils/apm");
const testParams_1 = require("~/test/testParams");
const params_1 = require("~/src/params");
const ethers_1 = require("ethers");
const apm_2 = require("~/src/utils/apm");
const semver_1 = __importDefault(require("semver"));
const publishVersionTxParsers_1 = require("~/test/test-helpers/publishVersionTxParsers");
const accounts_1 = require("~/src/utils/accounts");
const arappUtils_1 = require("~/src/utils/arappUtils");
const ipfsApiUrl = testParams_1.infuraIpfsApiUrl;
const ipfsGateway = testParams_1.infuraIpfsGateway;
const appName = 'test.aragonpm.eth';
describe('Publish task', function () {
    const testAppDir = 'test-app';
    /**
     * Test utility to fetch a repo state, its address and latest version
     * @param appName
     * @param provider
     */
    async function fetchRepoState(_appName, bre) {
        const networkConfig = bre.network.config;
        const provider = new ethers_1.ethers.providers.Web3Provider(bre.web3.currentProvider, networkConfig.ensAddress && {
            name: bre.network.name,
            chainId: networkConfig.chainId || 5555,
            ensAddress: networkConfig.ensAddress
        });
        const repoAddress = await provider.resolveName(_appName);
        if (!repoAddress)
            throw Error(`No address found for ENS ${_appName}`);
        const latestVersion = await apm_2.getRepoVersion(repoAddress, 'latest', provider);
        return {
            repoAddress,
            version: latestVersion.version,
            contractAddress: latestVersion.contractAddress
        };
    }
    /**
     * Test utility to assert that a tx data object is correct
     * given an initial repo state an a release bump
     * @param repoState
     * @param bump
     * @param rawTxData
     */
    async function assertPublishTxData(repoState, bump, txData) {
        const data = publishVersionTxParsers_1.parseNewVersionTxData(txData);
        chai_1.assert.equal(data.to, repoState.repoAddress, 'Tx to must be repo address');
        if (bump === 'major')
            chai_1.assert.notEqual(data.contractAddress, repoState.contractAddress, 'Version contract address must NOT be the same as last version');
        else
            chai_1.assert.equal(data.contractAddress, repoState.contractAddress, 'Version contract address must be the same as last version');
        chai_1.assert.equal(data.version, semver_1.default.inc(repoState.version, bump), `New version should be a ${bump} bump from last version ${repoState.version}`);
        await assertContentUri(data.contentUri);
    }
    /**
     * Test utility to assert that the contentUri is correct by resolving its content
     * @param contentUri
     */
    async function assertContentUri(contentUri) {
        const files = await apm_1.resolveRepoContentUri(contentUri, { ipfsGateway });
        chai_1.assert.deepInclude(files.manifest, { name: 'Test app', author: 'testing', description: 'Test app' }, 'manifest.json does not include expected data');
        chai_1.assert.deepInclude(files.artifact, { path: 'contracts/TestContract.sol' }, 'artifact.json does not include expected data');
    }
    describe('On a local network', function () {
        useEnvironment_1.useEnvironment(testAppDir, 'localhost');
        before('Environment is loaded', function () {
            if (!this.env)
                throw Error('No .env in this, is useEnvironment run?');
        });
        let closeGanache;
        before('Run a local testnet with bases', async function () {
            const ganache = await start_ganache_1.startGanache(this.env);
            closeGanache = ganache.close;
            await deploy_bases_1.default(this.env);
        });
        describe(`Repo does not exist, deploy new contract and repo for ${testAppDir}`, function () {
            const bump = 'major';
            it('Run publish task', async function () {
                const txData = await this.env.run(task_names_1.TASK_PUBLISH, { bump, ipfsApiUrl });
                const rootAccount = await accounts_1.getRootAccount(this.env);
                const { to, shortName, managerAddress, contractAddress, version, contentUri } = publishVersionTxParsers_1.parseNewRepoWithVersionTxData(txData);
                // Compare with an object to see all of them at once
                chai_1.assert.deepEqual({
                    to,
                    shortName,
                    managerAddress,
                    version
                }, {
                    to: params_1.defaultLocalAragonBases.apmAddress,
                    shortName: 'test',
                    managerAddress: rootAccount,
                    version: '1.0.0'
                });
                chai_1.assert(apm_1.isAddress(contractAddress), 'Release contractAddress is not a valid address');
                await assertContentUri(contentUri);
            });
        });
        describe('Repo exists, patch release with just content', function () {
            const bump = 'patch';
            let repoState;
            before('Fetch repo state', async function () {
                repoState = await fetchRepoState(appName, this.env);
            });
            it('Run publish task', async function () {
                const txData = await this.env.run(task_names_1.TASK_PUBLISH, {
                    bump,
                    ipfsApiUrl
                });
                await assertPublishTxData(repoState, bump, txData);
            });
        });
        describe('Repo exists, major release with contract and content', function () {
            const bump = 'major';
            let repoState;
            before('Fetch repo state', async function () {
                repoState = await fetchRepoState(appName, this.env);
            });
            it('Run publish task', async function () {
                const txData = await this.env.run(task_names_1.TASK_PUBLISH, {
                    bump,
                    ipfsApiUrl
                });
                await assertPublishTxData(repoState, bump, txData);
            });
        });
        after('Stop ganache instance', function () {
            if (closeGanache)
                closeGanache();
        });
    });
    describe.skip('On the mainnet network', function () {
        const appName = 'finance.aragonpm.eth';
        const mainnetNetwork = 'mainnet';
        useEnvironment_1.useEnvironment(testAppDir, mainnetNetwork);
        before('Environment is loaded', function () {
            if (!this.env)
                throw Error('No .env in this, is useEnvironment run?');
        });
        before('Retrieve config', async function () {
            const arapp = arappUtils_1.readArapp();
            chai_1.assert.equal(arappUtils_1.parseAppName(arapp), appName, 'Wrong app name');
        });
        before('Make sure mainnet provider works', async function () {
            try {
                await this.env.web3.eth.getBlockNumber();
            }
            catch (e) {
                const url = this.env.network.provider._url;
                e.message = `Provider check error ${url}: ${e.message}`;
                throw e;
            }
        });
        let repoState;
        before('Fetch repo state', async function () {
            repoState = await fetchRepoState(appName, this.env);
        });
        describe('Repo exists, patch release with just content', function () {
            const bump = 'patch';
            it('Run publish task', async function () {
                const txData = await this.env.run(task_names_1.TASK_PUBLISH, {
                    bump,
                    ipfsApiUrl
                });
                await assertPublishTxData(repoState, bump, txData);
            });
        });
    });
});
//# sourceMappingURL=publish-task.test.js.map