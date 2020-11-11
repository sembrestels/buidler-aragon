"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonZeroAddress = void 0;
const web3_utils_1 = __importDefault(require("web3-utils"));
const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
function isNonZeroAddress(address) {
    if (address === ZERO_ADDR) {
        return false;
    }
    return web3_utils_1.default.isAddress(address);
}
exports.isNonZeroAddress = isNonZeroAddress;
//# sourceMappingURL=isNonZeroAddress.js.map