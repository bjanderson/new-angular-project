module.exports = {
  coverageDirectory: '../coverage',
  collectCoverageFrom: [
    '**/*.(t|j)s'
  ],

  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],

  rootDir: 'src',

  testEnvironment: 'node',

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  }
}
