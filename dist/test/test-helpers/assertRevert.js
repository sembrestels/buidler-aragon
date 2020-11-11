"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertRevert = void 0;
async function assertRevert(promise, expectedErrorMessage) {
    return new Promise(resolve => {
        promise
            .then(() => {
            throw new Error(`Promise was expected to fail with ${expectedErrorMessage}, but did not fail.`);
        })
            .catch(error => {
            if (error.message.includes(expectedErrorMessage)) {
                resolve();
            }
            else {
                throw new Error(`Promise was expected to fail with ${expectedErrorMessage}, but failed with ${error.message} instead.`);
            }
        });
    });
}
exports.assertRevert = assertRevert;
//# sourceMappingURL=assertRevert.js.map