"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainnetProvider = void 0;
const ethers_1 = require("ethers");
function getMainnetProvider() {
    return new ethers_1.ethers.providers.InfuraProvider();
}
exports.getMainnetProvider = getMainnetProvider;
//# sourceMappingURL=providers.js.map