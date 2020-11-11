"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const utils_1 = require("~/src/utils/ast/utils");
describe('ast > utils', () => {
    describe('coerceFunctionSignature', () => {
        const testCases = [
            ['deposit(address,uint256,string)', 'deposit(address,uint256,string)'],
            ['deposit(address, uint256, string)', 'deposit(address,uint256,string)']
        ];
        for (const [from, to] of testCases)
            it(`Should coerce function signature ${from}`, () => {
                chai_1.assert.equal(utils_1.coerceFunctionSignature(from), to);
            });
    });
    describe('Compute signatures from data', () => {
        it('Should compute a signature given an ABI', () => {
            const abi = {
                constant: false,
                inputs: [
                    { name: '_token', type: 'address' },
                    { name: '_amount', type: 'uint256' },
                    { name: '_reference', type: 'string' }
                ],
                name: 'deposit',
                outputs: [],
                payable: true,
                stateMutability: 'payable',
                type: 'function'
            };
            const signature = ethers_1.ethers.utils.formatSignature(abi);
            chai_1.assert.equal(signature, 'deposit(address,uint256,string)');
        });
    });
});
//# sourceMappingURL=utils.test.js.map