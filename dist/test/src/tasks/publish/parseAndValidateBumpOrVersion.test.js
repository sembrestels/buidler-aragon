"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const parseAndValidateBumpOrVersion_1 = __importDefault(require("~/src/tasks/publish/parseAndValidateBumpOrVersion"));
describe('parseAndValidateBumpOrVersion', () => {
    const testCases = [
        // Normal update
        {
            id: 'Normal update with version',
            bumpOrVersion: '0.2.0',
            prevVersion: '0.1.1',
            result: { nextVersion: '0.2.0', bump: 'minor' }
        },
        {
            id: 'Normal update with bump patch',
            bumpOrVersion: 'patch',
            prevVersion: '0.1.1',
            result: { nextVersion: '0.1.2', bump: 'patch' }
        },
        {
            id: 'Normal update with bump minor',
            bumpOrVersion: 'minor',
            prevVersion: '0.1.1',
            result: { nextVersion: '0.2.0', bump: 'minor' }
        },
        {
            id: 'Normal update with bump major',
            bumpOrVersion: 'major',
            prevVersion: '0.1.1',
            result: { nextVersion: '1.0.0', bump: 'major' }
        },
        {
            id: 'Normal update with wrong version',
            bumpOrVersion: '0.2.1',
            prevVersion: '0.1.1',
            error: /invalid bump/i
        },
        // Initial version
        {
            id: 'Initial version with version',
            bumpOrVersion: '0.1.0',
            result: { nextVersion: '0.1.0', bump: 'minor' }
        },
        {
            id: 'Initial version with bump',
            bumpOrVersion: 'minor',
            result: { nextVersion: '0.1.0', bump: 'minor' }
        },
        {
            id: 'Initial version with wrong version',
            bumpOrVersion: '0.2.1',
            error: /invalid bump/i
        }
    ];
    for (const { id, bumpOrVersion, prevVersion, result, error } of testCases) {
        it(id, () => {
            if (error) {
                chai_1.expect(() => parseAndValidateBumpOrVersion_1.default(bumpOrVersion, prevVersion)).to.throw(error);
            }
            else {
                chai_1.expect(parseAndValidateBumpOrVersion_1.default(bumpOrVersion, prevVersion)).to.deep.equal(result);
            }
        });
    }
});
//# sourceMappingURL=parseAndValidateBumpOrVersion.test.js.map