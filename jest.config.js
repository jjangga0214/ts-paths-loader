import { config } from '@jjangga0214/jest-config'
// import { createRequire } from 'module'

// const require = createRequire(import.meta.url)
// const tsConfig = require('./tsconfig.json')
// `tsConfig` can be passed to produceConfig({tsConfig}) of '@jjangga0214/jest-config'

export default {
  ...config,
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    ...config.moduleNameMapper,
    '^#/(.*)\\.js$': '<rootDir>/src/$1',
    '^#/(.*)$': '<rootDir>/src/$1',
  },
  transform: { '^.+\\.(t|j)sx?$': ['@swc/jest'] },
  // transform: { '^.+\\.tsx?$': ['esbuild-jest'] },
  // transform: { '^.+\\.tsx?$': ['ts-jest'] },
}
