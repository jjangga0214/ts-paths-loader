import assert from 'assert'
import url from 'url'
// import { dirname } from 'dirname-filename-esm'
import upath from 'upath'

import {
  ConfigLoaderSuccessResult,
  createMatchPath,
  loadConfig,
} from 'tsconfig-paths'
import Module from 'module'
import memoizee from 'memoizee'
import serialize from 'serialize-javascript'

export interface ResolveResult {
  url: string
  format?: 'builtin' | 'commonjs' | 'dynamic' | 'json' | 'module' | 'wasm'
}
async function main() {
  console.log(
    url
      .pathToFileURL(
        '/Users/ocean/main/haetae/examples/basic-typescript/src/hello.ts',
      )
      .toString(),
  )
}

main()
