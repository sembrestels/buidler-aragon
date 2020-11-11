import { BuidlerRuntimeEnvironment } from '@nomiclabs/buidler/types';
declare module 'mocha' {
    interface Context {
        env: BuidlerRuntimeEnvironment;
    }
}
export declare function useDefaultEnvironment(): void;
export declare function useEnvironment(projectName: string, networkName?: string): void;
//# sourceMappingURL=useEnvironment.d.ts.map