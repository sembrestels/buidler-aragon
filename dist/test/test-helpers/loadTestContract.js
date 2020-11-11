"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fsUtils_1 = require("~/src/utils/fsUtils");
/**
 * Loads contract data as string from the directory
 * buidler-aragon/test/utils/contracts
 * @param contractName "EmptyContract"
 */
function loadTestContract(contractName) {
    return fsUtils_1.readFile(path_1.default.format({
        dir: path_1.default.join(__dirname, '../contracts/'),
        name: contractName,
        ext: '.sol'
    }));
}
exports.default = loadTestContract;
//# sourceMappingURL=loadTestContract.js.map