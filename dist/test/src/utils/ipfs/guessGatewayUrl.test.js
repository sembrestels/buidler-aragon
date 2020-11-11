"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ipfs_1 = require("~/src/utils/ipfs");
const testParams_1 = require("~/test/testParams");
describe('guessGatewayUrl', () => {
    describe('getPossibleGatewayUrls', () => {
        it('Should return list of possible gateway urls', () => {
            const ipfsApiUrl = 'http://mynode.io:6001';
            const ipfsGateway = 'https://ipfs.io';
            const urls = ipfs_1.getPossibleGatewayUrls({ ipfsApiUrl, ipfsGateway });
            chai_1.assert.deepEqual(urls, [
                'http://mynode.io/',
                'http://mynode.io:5001/',
                'http://mynode.io:6001/',
                'http://mynode.io:8080/',
                'https://ipfs.io'
            ]);
        });
    });
    describe('guessGatewayUrl', () => {
        it('Should return the available gateway', async () => {
            const ipfsApiUrl = testParams_1.infuraIpfsApiUrl;
            const ipfsGateway = 'https://wrong.io';
            const contentHash = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/about';
            const url = await ipfs_1.guessGatewayUrl({
                ipfsApiUrl,
                ipfsGateway,
                contentHash
            });
            chai_1.assert.equal(url, 'https://ipfs.infura.io/');
        });
    });
});
//# sourceMappingURL=guessGatewayUrl.test.js.map