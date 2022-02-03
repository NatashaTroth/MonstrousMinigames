module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    watchPathIgnorePatterns: ['<rootDir>/node_modules'],
    collectCoverageFrom: ['src/**/*.{ts,js}'],
    coveragePathIgnorePatterns: ['src/gameplay/--newGameTemplate--', 'tests/gameplay/gameThree'],
    coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
};
