"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const url_1 = require("~/src/utils/url");
describe('urlJoin', () => {
    it('Should join url parts', () => {
        const url = url_1.urlJoin('http://ipfs.io', 'ipfs', 'Qm');
        chai_1.assert.equal(url, 'http://ipfs.io/ipfs/Qm');
    });
});
//# sourceMappingURL=url.test.js.map