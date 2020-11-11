"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNewRepoWithVersionTxData = exports.parseNewVersionTxData = void 0;
/**
 * Test utility to parse tx data params
 * @param txData
 */
function parseNewVersionTxData(txData) {
    const { to, methodName, params } = txData;
    if (methodName !== 'newVersion')
        throw Error(`methodName must be newVersion`);
    const [versionArray, contractAddress, contentUri] = params;
    return {
        to,
        version: versionArray.join('.'),
        contractAddress,
        contentUri
    };
}
exports.parseNewVersionTxData = parseNewVersionTxData;
/**
 * Test utility to parse tx data params
 * @param txData
 */
function parseNewRepoWithVersionTxData(txData) {
    const { to, methodName, params } = txData;
    if (methodName !== 'newRepoWithVersion')
        throw Error(`methodName must be newRepoWithVersion`);
    const [shortName, managerAddress, versionArray, contractAddress, contentUri] = params;
    return {
        to,
        shortName,
        managerAddress,
        version: versionArray.join('.'),
        contractAddress,
        contentUri
    };
}
exports.parseNewRepoWithVersionTxData = parseNewRepoWithVersionTxData;
//# sourceMappingURL=publishVersionTxParsers.js.map