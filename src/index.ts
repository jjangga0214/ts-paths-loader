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

export const getMatchPath = memoizee(
  (cwd) => {
    const configLoaderResult = loadConfig(cwd) as ConfigLoaderSuccessResult

    assert.strict(
      configLoaderResult.resultType === 'success',
      'Cannot find tsconfig.json',
    )

    return createMatchPath(
      configLoaderResult.absoluteBaseUrl,
      configLoaderResult.paths,
      configLoaderResult.mainFields,
      configLoaderResult.addMatchAll,
    )
  },
  {
    normalizer: serialize,
  },
)

export async function resolve(
  specifier: string,
  context: { parentURL?: string } = {},
  nextResolve: typeof resolve = () => {
    throw new Error('nextResolve is not defined')
  },
): Promise<ResolveResult> {
  const builtinModules = Module.builtinModules || []

  // 'node:' protocol -> REF: https://nodejs.org/api/esm.html#node-imports
  if (specifier.startsWith('node:') || builtinModules.includes(specifier)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return nextResolve(specifier, context)
  }
  let moduleDirname
  // TODO: yarn test
  // TODO: file:// protocol conistency

  // Why changing moduleDirname?
  // Because monorepo can have multiple tsconfig.json
  // That's why `loadConfig` is memoized
  if (
    !specifier.includes('/node_modules/') &&
    specifier.startsWith('file://')
  ) {
    moduleDirname = upath.dirname(url.fileURLToPath(specifier))
  } else if (
    !context.parentURL?.includes('/node_modules/') &&
    context.parentURL?.startsWith('file://')
  ) {
    moduleDirname = upath.dirname(url.fileURLToPath(context.parentURL))
  } else {
    // This case is unexpected.
    // Not likely to happen unless a breaking change happens to Loader Hook API.
    return nextResolve(specifier, context)
  }

  const matchPath = getMatchPath(moduleDirname)

  const resolvedModulePath = upath.resolve(matchPath(specifier)) // absolute path to the module

  // TODO: check if it's directory name

  /**
   * If it's directory name
   * 1. check if it has index.ts
   * 2. Else pass directly name as-is. nodejs would handle it. REF: https://nodejs.org/api/modules.html#modules_all_together
   */
  if (resolvedModulePath) {
    return nextResolve(
      url.pathToFileURL(resolvedModulePath).toString(),
      context,
    )
  }

  return nextResolve(specifier, context)
}
