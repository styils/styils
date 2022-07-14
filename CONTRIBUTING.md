# 为 Styls 做贡献

欢迎并感谢您的关注！在提交拉取请求之前，请花点时间查看这些指南。

## 报告问题

发现问题了吗？想要新功能？

- 查看您的问题或想法是否[已被报告]。
- 提供 [简化的测试用例] 或 [代码示例]。

## 提交拉取请求

在进行本地开发之前，请确保您的开发环境中安装了 `Node.js >= 14` 和 `pnpm`。

按照以下步骤进行开发

1. 开始：[fork 这个项目]，到你的仓库然后克隆它.

   ```bash
   # 克隆存储库
   git@github.com:**path**/styls.git

   # 导航到新克隆的目录
   cd styls

   # 安装测试所需的工具
   pnpm install

   # 进入开发模式，浏览器访问localhost
   pnpm dev
   ```

2. 为您的功能或修复创建一个分支：

   ```bash
   # 移动到您的功能的新分支
   git checkout -b feature/thing
   ```

   ```bash
   # 移动到新分支进行修复
   git checkout -b fix/something
   ```

3. 如果您的代码通过了所有测试，则推送你的功能分支：

   ```bash
   # 测试当前代码
   pnpm run test # or npm test

   # 构建当前代码
   pnpm run build
   ```

> 注意：确保您的 Node 版本为 14 或更高版本才能运行脚本

```bash
# 为新功能推送分支
git push origin feature/thing
```

```bash
# 或者，推送分支以进行更新
git push origin update/something
```

现在 [打开一个拉取请求] 带有清晰的标题和描述。

[已被报告]: https://github.com/l-zoy/styls/issues
[fork这个项目]: https://github.com/l-zoy/styls/fork
[代码示例]: https://codesandbox.io/
[打开一个拉取请求]: https://help.github.com/articles/using-pull-requests/
[简化的测试用例]: https://css-tricks.com/reduced-test-cases/
