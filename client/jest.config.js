/* eslint-disable no-undef */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['lib/', 'node_modules/', 'src/config'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.svg$': 'jest-svg-transformer',
        '^.+\\.(bmp|gif|jpg|jpeg|png|psd|webp|wav|mp3)$': '<rootDir>/jest/mediaFileTransformer.js',
    },
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
        '\\.svg': '<rootDir>/jest/svgrMock.js',
    },
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    watchPathIgnorePatterns: ['src/config'],
    coveragePathIgnorePatterns: ['src/config'],
    setupFiles: ["jest-canvas-mock"]
};
