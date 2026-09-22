# 芝士雾汐的博客

这是一个基于 Jekyll 的静态博客，可部署到 GitHub Pages。

## Linux 本地环境

- Ubuntu 24.04 或兼容的 Linux 发行版
- Ruby 3.2（项目当前使用 3.2.3）和 Bundler
- Node.js 24 或较新的长期支持版本

在 Ubuntu 24.04 上安装运行所需组件：

```bash
sudo apt-get update
sudo apt-get install ruby-full ruby-bundler build-essential zlib1g-dev
```

安装项目依赖：

```bash
bundle config set --local path vendor/bundle
bundle install
npm ci
```

启动本地预览：

```bash
npm run start
```

预览地址默认为 <http://127.0.0.1:4000>。修改 Less 或 JavaScript 源文件时，可在另一个终端运行：

```bash
npx grunt watch
```

也可以使用 `bundle exec rake preview` 启动 Jekyll 预览。

## 维护约定

- `.ruby-version`、`Gemfile.lock` 和 `package-lock.json` 用于固定可复现的本地与 CI 依赖，请提交它们。
- `.gitattributes` 统一文本文件为 LF 换行符，避免跨系统产生整文件“伪改动”。
- GitHub Actions 使用与本地相同的 Ruby 3.2 基线。
