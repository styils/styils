[简体中文](./README.ZH.md)

<p align="center">
<img src="./logo.svg" alt="styils" style="width:120px">
<br/>
<br/>
<img src="./styils.svg" alt="styils" style="width:100px;">
</p>

<p align="center">
  <img src="https://codecov.io/gh/styils/styils/branch/main/graph/badge.svg?token=DAETCWW98B" alt="coverage" />
  <img src="https://img.badgesize.io/https://unpkg.com/@styils/solid@latest/index.prod.esm.js?compression=gzip&style=square&label=solid&color=#4fc08d" alt="gzip" />
  <img src="https://img.badgesize.io/https://unpkg.com/@styils/react@latest/index.prod.esm.js?compression=gzip&style=square&label=react&color=#4fc08d" alt="gzip" />
  <img src="https://img.badgesize.io/https://unpkg.com/@styils/vue@latest/index.prod.esm.js?compression=gzip&style=square&label=vue&color=#4fc08d" alt="gzip" />
</p>

<p align="center">
Lightweight and fast css-in-js tool
</p>

## 🌟 Features

- 🎭 Polymorphism
- 🔵 Full ts type
- 🗺 Support SourceMap
- 🛎 Support SSR
- 🎨 Support Themes
- ☘️ Small size compression + gzip 4kb
- ⚡️ Near native rendering speed

[Documentation](https://styils.github.io/styils)

> It's very fast. Almost as fast as using native css, and even faster than native rendering under certain conditions

[Bench](https://styils.github.io/benchmark/create-and-mount-button/stitches-react)

### Styils React

![npm](https://img.shields.io/npm/v/@styils/react?color=%2361dafb&logo=react)

React wrapper including the `styled` API.

```sh
npm install @styils/react
```

### Styils Solid

![npm](https://img.shields.io/npm/v/@styils/react?color=%234f88c6&logo=solid&logoColor=%234f88c6)

Solid wrapper including the `styled` API.

```sh
npm install @styils/solid
```

### Styils Vue (Only supports vue3)

![npm](https://img.shields.io/npm/v/@styils/vue?color=%2342b883&logo=vuedotjs)

Solid wrapper including the `styled` API.

```sh
npm install @styils/vue
```

### Styils Babel Plugin

![npm](https://img.shields.io/npm/v/@styils/babel-plugin?color=%23eeda7c&logo=babel&logoColor=%23eeda7c)

This is required for sourcemap. Note that `babel-plugin` does not support vue suorcemap

[More](./babel-plugin/)

```sh
npm install @styils/babel-plugin
```

### Styils Vite Plugin

![npm](https://img.shields.io/npm/v/@styils/vite-plugin?color=%23646cff&logo=vite)

Wraps `@styils/babel-plugin` and provides vue sourcemap support.

[More babel options](./babel-plugin/)

```sh
npm install @styils/vite-plugin
```

### SSR Example

[Example](https://github.com/styils/styils-examples)

## Credits

Styils was inspired by other css in js tools such as **emotion**, **goober**, **stitches**. Thanks.

Benchmarks come from **stitches**

## License

Licensed under the MIT License, Copyright © 2022-present zoy-l

See [LICENSE](./LICENSE) for more information.
