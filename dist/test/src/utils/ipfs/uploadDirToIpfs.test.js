"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const fsUtils_1 = require("~/src/utils/fsUtils");
const ipfs_1 = require("~/src/utils/ipfs");
const testParams_1 = require("~/test/testParams");
describe('uploadDirToIpfs', function () {
    const testDir = path_1.default.join(testParams_1.debugDir, 'test-ipfs-dir-to-upload');
    const ipfsApiUrl = testParams_1.infuraIpfsApiUrl;
    // The content object below always results in the same contentHash
    // contentHash is not dependant on the path of `testDir`
    const contentHash = 'Qma979GLDh43DDvTp4S1j1ip9rxnnfQYBd9sEu4jyyhZaw';
    const content = {
        'a.txt': 'aaaaaaaa',
        'b.txt': 'bbbbbbbb',
        'c.txt': 'cccccccc'
    };
    before('Create test dir to upload', () => {
        fsUtils_1.ensureDir(testDir);
        for (const [filepath, data] of Object.entries(content))
            fs_1.default.writeFileSync(path_1.default.join(testDir, filepath), data);
    });
    after('Remove test dir', () => {
        fs_extra_1.removeSync(testDir);
    });
    it('Should upload a test dir to IPFS and get the expected hash', async function () {
        const res = await ipfs_1.uploadDirToIpfs({ dirPath: testDir, ipfsApiUrl });
        chai_1.assert.equal(res, contentHash, 'hash of uploaded test dir has changed');
    });
});
//# sourceMappingURL=uploadDirToIpfs.test.js.map