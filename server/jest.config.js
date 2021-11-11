module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    watchPathIgnorePatterns: ['<rootDir>/node_modules'],
    // collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts, js}'],
    coveragePathIgnorePatterns: ['src/gameplay/--newGameTemplate--', 'tests/'],
    // collectCoverageFrom: ['src/**/*.{js,ts}', '!tests/**/*.ts', '!src/gameplay/--newGameTemplate--/*.ts '],
    // collectCoverageFrom: ['<rootDir>/src/gameplay/gameOne/GameOne.ts '],
};
