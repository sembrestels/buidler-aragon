"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTestCases = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const params_1 = require("~/src/params");
const fsUtils_1 = require("~/src/utils/fsUtils");
function listTestCases() {
    const testCases = [];
    const dir = __dirname;
    for (const appName of fs_1.default.readdirSync(dir)) {
        const appPath = path_1.default.join(dir, appName);
        if (fs_1.default.lstatSync(appPath).isDirectory()) {
            const testCase = {
                appName,
                appPath,
                arapp: fsUtils_1.readJsonIfExists(path_1.default.join(appPath, params_1.arappName)),
                artifact: fsUtils_1.readJsonIfExists(path_1.default.join(appPath, params_1.artifactName)),
                manifest: fsUtils_1.readJsonIfExists(path_1.default.join(appPath, params_1.manifestName)),
                flatCode: fsUtils_1.readFileIfExists(path_1.default.join(appPath, params_1.flatCodeName))
            };
            testCases.push(testCase);
        }
    }
    return testCases;
}
exports.listTestCases = listTestCases;
//# sourceMappingURL=listCases.js.map