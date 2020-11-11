import { PublishVersionTxData } from '~/src/utils/apm';
/**
 * Test utility to parse tx data params
 * @param txData
 */
export declare function parseNewVersionTxData(txData: PublishVersionTxData): {
    to: string;
    version: string;
    contractAddress: string;
    contentUri: string;
};
/**
 * Test utility to parse tx data params
 * @param txData
 */
export declare function parseNewRepoWithVersionTxData(txData: PublishVersionTxData): {
    to: string;
    shortName: string;
    managerAddress: string;
    version: string;
    contractAddress: string;
    contentUri: string;
};
//# sourceMappingURL=publishVersionTxParsers.d.ts.map