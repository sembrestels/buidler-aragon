"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itBehavesLikeACounterContract = void 0;
const chai_1 = require("chai");
exports.itBehavesLikeACounterContract = function () {
    it('allows any address to increment and decrement the counter', async function () {
        let value;
        value = (await this.proxy.value()).toString();
        chai_1.assert.equal(value, 0, 'Incorrect value on this.proxy');
        await this.proxy.increment(1);
        value = (await this.proxy.value()).toString();
        chai_1.assert.equal(value, 1, 'Incorrect value on this.proxy');
        await this.proxy.decrement(1);
        value = (await this.proxy.value()).toString();
        chai_1.assert.equal(value, 0, 'Incorrect value on this.proxy');
    });
    it('reports the correct hardcoded version', async function () {
        const version = (await this.proxy.getVersion()).toString();
        chai_1.assert.equal(version, '0', 'Incorrect counter this.proxy version');
    });
};
//# sourceMappingURL=counter-behavior.js.map