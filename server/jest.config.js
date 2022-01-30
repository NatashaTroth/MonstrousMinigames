module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    watchPathIgnorePatterns: ['<rootDir>/node_modules'],
    // collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,js}'],
    coveragePathIgnorePatterns: ['src/gameplay/--newGameTemplate--', 'tests/gameplay/gameThree'], //'server/src/**/index.ts'
    coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
    // testMatch: ['**/*.test.ts'],
    // collectCoverageFrom: ['src/**/*.{js,ts}', '!tests/**/*.ts', '!src/gameplay/--newGameTemplate--/*.ts '],
    // collectCoverageFrom: ['<rootDir>/src/gameplay/gameOne/GameOne.ts '],
};

// module.exports = {
//     "collectCoverageFrom": ["src/**/*.js", "!**/node_modules/**"],

//   }

// preset: 'ts-jest',
//     testEnvironment: 'jsdom',
//     testPathIgnorePatterns: ['lib/', 'node_modules/', 'src/config'],
//     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//     moduleDirectories: ['node_modules', '<rootDir>/src'],
//     transform: {
//         '^.+\\.js$': 'babel-jest',
//         '^.+\\.svg$': 'jest-svg-transformer',
//         '^.+\\.(bmp|gif|jpg|jpeg|png|psd|webp|wav|mp3)$': '<rootDir>/jest/mediaFileTransformer.js',
//     },
//     moduleNameMapper: {
//         '\\.(css|less)$': 'identity-obj-proxy',
//         '\\.svg': '<rootDir>/jest/svgrMock.js',
//     },
//     collectCoverage: true,
//     collectCoverageFrom: ['src/**/*.{ts,tsx}'],
//     watchPathIgnorePatterns: ['src/config'],
//     coveragePathIgnorePatterns: ['src/config'],
//     setupFiles: ["jest-canvas-mock"]
