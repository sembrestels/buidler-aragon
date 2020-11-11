"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const params_1 = require("~/src/params");
const artifact_1 = require("~/src/utils/artifact");
const fsUtils_1 = require("~/src/utils/fsUtils");
const testParams_1 = require("~/test/testParams");
const listCases_1 = require("~/test/test-helpers/test-cases-apps/listCases");
const writeToDebug = false;
describe('ast > generateAragonArtifact', () => {
    for (const testCase of listCases_1.listTestCases()) {
        const { arapp, flatCode, artifact, appName } = testCase;
        if (arapp && flatCode && artifact) {
            it(`Should generate artifact.json - ${appName}`, () => {
                const newArtifact = artifact_1.generateAragonArtifact(arapp, appName, artifact.abi, flatCode, arapp.path);
                // Store the created files for easier debugging
                if (writeToDebug) {
                    fsUtils_1.ensureDir(testParams_1.debugDir);
                    fsUtils_1.writeJson(path_1.default.join(testParams_1.debugDir, `${appName}_${params_1.artifactName}`), newArtifact);
                }
                // Compare the functions array as an object before
                // Array diff-ing makes it much harder to see which specific
                // functions where excluded / included
                /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
                const functionsBySig = (a) => lodash_1.keyBy(a.functions, f => f.sig);
                chai_1.assert.deepEqual(functionsBySig(newArtifact), functionsBySig(artifact), 'wrong functions in artifact.json');
                const prepareArtifactToCompare = (_artifact) => {
                    // Since the functions parser algorythm is different
                    // the order of functions will change. Sort them here
                    _artifact.functions = lodash_1.sortBy(_artifact.functions, f => f.sig);
                    // ### Todo:, clarify what should be included in artifact.json
                    delete _artifact.flattenedCode;
                    delete _artifact.deprecatedFunctions;
                    // delete (_artifact as any).deployment
                };
                chai_1.assert.deepEqual(prepareArtifactToCompare(newArtifact), prepareArtifactToCompare(artifact), 'wrong artifact.json');
            });
        }
        else {
            it.skip(`Should generate artifact.json ${appName}`, () => { });
        }
    }
});
//# sourceMappingURL=generateAragonArtifact.test.js.map