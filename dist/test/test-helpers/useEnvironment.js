"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnvironment = exports.useDefaultEnvironment = void 0;
const path_1 = __importDefault(require("path"));
const plugins_testing_1 = require("@nomiclabs/buidler/plugins-testing");
function useDefaultEnvironment() {
    useEnvironment('counter');
}
exports.useDefaultEnvironment = useDefaultEnvironment;
function useEnvironment(projectName, networkName = 'buidlerevm') {
    const projectPath = path_1.default.join(__dirname, '../projects', projectName);
    before('loading buidler environment', function () {
        process.chdir(projectPath);
        process.env.BUIDLER_NETWORK = networkName;
        this.env = require('@nomiclabs/buidler');
    });
    after('resetting buidler', function () {
        plugins_testing_1.resetBuidlerContext();
        delete process.env.BUIDLER_NETWORK;
    });
}
exports.useEnvironment = useEnvironment;
//# sourceMappingURL=useEnvironment.js.map