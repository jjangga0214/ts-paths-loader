# ts-paths-loader

A nodejs **Loader Hook** for typescript projects using [Paths Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

## Why?

Recent Node runtimes provide [Loader Hooks](https://nodejs.org/api/esm.html#esm_experimental_loaders). The hooks are experimental, but soon will be the official recommended way to [`resolve`](https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve) or [`load`](https://nodejs.org/api/esm.html#loadurl-context-nextload) modules.

This is ideal for handling how module is resolved by typescript Paths Mapping.

## Compatible Loader Hook APIs

Internally, Node's Loader Hook API is used.

- Historically, the API was released in Node v8.8.0 (so-called Loader Hook API v1).
- A breaking change happens at Node v16.12.0 (Loader Hook API v2).
- From Node v18.6.0, a new important feature called **chaining** is added. (Loader Hook API v2.x)

But you don't have to care about the compatibility no matter which node version you use.
It is `ts-paths-loader` (not you) that handles the API. `ts-paths-loader` will also handle (as soon as possible) the future breaking change of Loader Hook API, if it happens.
The only thing you should keep in mind is the guide below.

### If your node version >= v18.6.0

You can use chaining.
You have three usage options below.

#### Usage 1. Chaining

```sh
node --loader my-another-loader --loader ts-paths-loader <source>
# where <source> is typescript or javascript entrypoint
```

From the above, two different loaders `my-another-loader` and `ts-paths-loader` is used.
The latter one (`ts-paths-loader`) is executed first, and if a certain module is not resolved by it, then the module is passed to the former one (`my-another-loader`). This is called **chaining**.

For practical usage, if you use [`ts-node`](https://www.npmjs.com/package/ts-node) *and* your project is ESM, this is possible.

```sh
node --loader ts-node/esm --loader ts-paths-loader src/my-index.ts
```

#### Usage 2. Create your own loader by wrapping `ts-paths-loader`

If, for some reason, you want to modify how `ts-paths-loader` works, then you can programmatically create your own loader by wrapping `ts-paths-loader`.

```sh
node --loader my-awesome-loader <source>
```

**my-awesome-loader.js**

```js
import {} from 'ts-paths-loader'



```

#### Usage 3. Use `ts-paths-loader` alone, when possible

```sh
node --loader ts-paths-loader <source>
```

For practical usage, if you use [`ts-node`](https://www.npmjs.com/package/ts-node) *and* your project is NOT ESM, this is possible.

```sh
NODE_OPTIONS='--loader=ts-paths-loader' ts-node src/my-index.ts
```

### If your node version < v18.6.0, but >= v8.8.0

You cannot use chaining.
You only have two usage options below.

#### Usage 1. Create your own loader by wrapping `ts-paths-loader`

```sh
node --loader my-awesome-loader <source>
```

**my-awesome-loader.js**

```js
import {} from 'ts-paths-loader'



```

#### Usage 2. Use `ts-paths-loader` alone, when possible

```sh
node --loader ts-paths-loader <source>
```

For practical usage, if you use [`ts-node`](https://www.npmjs.com/package/ts-node) *and* your project is NOT ESM, this is possible.

```sh
NODE_OPTIONS='--loader=ts-paths-loader' ts-node src/my-index.ts
```

### If your node version < v8.8.0

Your node does not support Loader Hook. You cannot use `ts-paths-loader`.

## License

[MIT License](license). Copyright © 2022, GIL B. Chan <github.com/jjangga0214> <bnbcmindnpass@gmail.com>
