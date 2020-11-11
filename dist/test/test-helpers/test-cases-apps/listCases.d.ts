import { AragonAppJson, AragonArtifact, AragonManifest } from '~/src/types';
interface TestCase {
    appName: string;
    appPath: string;
    arapp?: AragonAppJson;
    artifact?: AragonArtifact;
    manifest?: AragonManifest;
    flatCode?: string;
}
export declare function listTestCases(): TestCase[];
export {};
//# sourceMappingURL=listCases.d.ts.map