/* eslint-disable no-undef */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['lib/', 'node_modules/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.(bmp|gif|jpg|jpeg|png|psd|svg|webp|wav|mp3)$': '<rootDir>/jest/mediaFileTransformer.js',
    },
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};
