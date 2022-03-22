import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    roots: [
        "<rootDir>"
    ],
    modulePaths: [
        "<rootDir>"
    ],
    moduleDirectories: [
        "node_modules"
    ]
};
export default config