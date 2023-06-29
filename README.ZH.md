[English](./README.md)

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
 轻量级和快速的 css-in-js 工具
</p>

## 🌟 特性

- 🎭 多态
- 🔵 完整的类型
- 🗺 支持 SourceMap
- 🛎 支持 SSR
- 🎨 支持 Themes
- ☘️ 小尺寸 压缩 + gzip 4kb
- ⚡️ 接近原生渲染速度

[文档](https://styils.github.io/styils)

> 它非常快。几乎和使用原生 css 一样快，在某些条件下甚至比原生渲染还要快

[基准](https://styils.github.io/benchmark/create-and-mount-button/stitches-react)

### Styils React

![npm](https://img.shields.io/npm/v/@styils/react?color=%2361dafb&logo=react)

React 包装器，包括 `styled` API。

```sh
npm install @styils/react
```

### Styils Solid

![npm](https://img.shields.io/npm/v/@styils/react?color=%234f88c6&logo=solid&logoColor=%234f88c6)

Solid 包装器，包括 `styled` API。

```sh
npm install @styils/solid
```

### Styils Vue (只支持 vue3)

![npm](https://img.shields.io/npm/v/@styils/vue?color=%2342b883&logo=vuedotjs)

Vue 包装器，包括 `styled` API。

```sh
npm install @styils/vue
```

### Styils Babel Plugin

![npm](https://img.shields.io/npm/v/@styils/babel-plugin?color=%23eeda7c&logo=babel&logoColor=%23eeda7c)

[更多](./babel-plugin/)

This is required for sourcemap

```sh
npm install @styils/babel-plugin
```

### Styls Vite Plugin

![npm](https://img.shields.io/npm/v/@styils/vite-plugin?color=%23646cff&logo=vite)

包装 `@styils/babel-plugin` 并提供 vue sourcemap 支持。

```sh
npm install @styils/vite-plugin
```

[More babel options](./babel-plugin/)

### SSR Example

[示例](https://github.com/styils/styils-examples)

## 鸣谢

Styils 的灵感来自其他 css in js 工具，如**emotion**，**goober**，**stitches** 感谢

基准测试来自 **stitches**

## License

根据 MIT 许可证获得许可, 版权 © 2022-present zoy-l

有关详细信息，请参阅 [LICENSE](./LICENSE)。
