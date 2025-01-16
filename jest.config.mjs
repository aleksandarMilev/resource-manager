export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    transform: {
      '^.+\\.ts$': ['ts-jest', { babelConfig: true }]
    },
    testMatch: ['**/tests/**/*.test.ts', '**/tests/*.test.ts']
}
  