"use strict";
/**
 * Note: Only run this file intentionally to populate
 * the test-cases folder, never let this file imported
 * unless temporarily for said purpose
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPublishedAssets = void 0;
const path_1 = __importDefault(require("path"));
const params_1 = require("~/src/params");
const apm_1 = require("~/src/utils/apm");
const fsUtils_1 = require("~/src/utils/fsUtils");
const providers_1 = require("~/test/test-helpers/providers");
const ipfsGateway = params_1.defaultIpfsGateway;
const appsToFetch = ['agent', 'finance', 'token-manager', 'vault', 'voting'];
/* eslint-disable no-console */
async function fetchAppPublishedAssets(appName, outDir) {
    const provider = providers_1.getMainnetProvider();
    const options = { ipfsGateway };
    const { contentUri } = await apm_1.getRepoVersion(appName, 'latest', provider);
    const { artifact } = await apm_1.resolveRepoContentUri(contentUri, options);
    const flatCode = await apm_1.resolveRepoContentUriFile(contentUri, params_1.flatCodeName, options);
    const appPath = path_1.default.join(outDir, appName);
    fsUtils_1.ensureDir(appPath);
    fsUtils_1.writeJson(path_1.default.join(appPath, params_1.artifactName), artifact);
    fsUtils_1.writeFile(path_1.default.join(appPath, params_1.flatCodeName), flatCode);
}
async function fetchPublishedAssets(outDir) {
    for (const appName of appsToFetch) {
        console.log(`Fetching ${appName}...`);
        await fetchAppPublishedAssets(appName, outDir);
    }
}
exports.fetchPublishedAssets = fetchPublishedAssets;
//# sourceMappingURL=fetchAssets.js.map