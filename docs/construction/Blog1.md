---
title: VuePress + Github Pages搭建博客 01
author: Jessie
date: "2022-06-10"
---

一直都是使用 CSDN 写一些博文，最近突发奇想想试用下免费的 Github Pages 搭建一下博客，跟上大家的脚步 👣，VuePress 官网文档写得还算是挺全面的，但是我在进行部署的时候踩了不少坑，记录下来方便大家上手，减少踩坑。

源码：<https://github.com/Jessie-jzn/Jessie-blog>

博客地址：<https://jessie-jzn.github.io/Jessie-blog/>

## 快速搭建 VuePress

> 一个 VuePress 网站是一个由  [Vue (opens new window)](http://vuejs.org/)、[Vue Router (opens new window)](https://github.com/vuejs/vue-router)和  [webpack (opens new window)](http://webpack.js.org/)驱动的单页应用

## [快速上手](https://v1.vuepress.vuejs.org/zh/guide/getting-started.html)

1. 创建并进入一个新目录

```js
mkdir blog
cd blog
```

2. 使用`npm`进行初始化

```js
npm init
```

3. 将`VuePress`安装为本地依赖（我使用的是 v1.x 版本）

```js
npm install -D vuepress
```

4. 新建一个`docs`新目录，并且创建一个新文档（因为 VuePress 使用 docs 作为根目录，所以这个 README.md 相当于主页）

```js
mkdir docs && echo '# Hello VuePress' > docs/README.md
```

5. 在  `package.json`  中添加 script

```js
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

6. 在`docs`目录下创建一个  `.vuepress`  目录，并创建一个新的 config.js 文件

```js
cd docs
mkdir .vuepress
```

此时你的目录结构为

```js
├─ docs
│  ├─ README.md
│  └─ .vuepress
│     └─ config.js
└─ package.json
```

7. 在本地启动服务器

```js
npm run docs:dev
```

此刻 VuePress 会在  [http://localhost:8080 (opens new window)](http://localhost:8080/)启动一个热重载的开发服务器。

现在，我们已经实现了一个简单可用的 VuePress 文档。

## 简单配置

一个 VuePress 网站必要的配置文件是  `.vuepress/config.js`，所以我们在`config.js`内配置所需要的信息，以下所有的代码块都是写在`config.js`文件内，包在`module.exports`对象中

### 基础信息

```js
module.exports = {
  title: "Jessie的个人技术博客",
  description: "办法总比问题多",
};
```

### 配置中文

```js
module.exports = {
  title: "Jessie的个人技术博客",
  description: "办法总比问题多",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
};
```

### 配置主题及路由

```ts
module.exports = {
    title: 'Jessie的个人技术博客',
    description: '办法总比问题多',
    theme: "reco",
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            {
                text: 'Jessie的博客',
                items: [
                    { text: 'Github', link: 'https://github.com/Jessie-jzn' },
                    { text: 'CSDN', link: 'https://blog.csdn.net/zn740395858?spm=1010.2135.3001.5343' }
                    { text: '掘金', link: 'https://juejin.cn/user/2524134425764375' }
                ]
            }
        ],
        sidebar:[
            {
                title: "博客搭建",
                path: "/construction/Blog1",
                collapsable: false, // 不折叠
                children: [
                    { title: "博客 01", path: "/construction/Blog1" },
                ],
            }
        ]
    }
}

```

此刻的博客页面效果如下

![WX20220611-211257.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66f2d3e7645d4ee69ba875a3deb28f60~tplv-k3u1fbpfcp-watermark.image?)

## 部署到 GitHub

1. 在自己的 github 上新建一个项目，我这边是叫 Jessie-blog
   ![4d74fe1b04374112b72dae8de8039f7d~tplv-k3u1fbpfcp-watermark.image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/444ec42abd9249b6b0fc610d1c0ba010~tplv-k3u1fbpfcp-watermark.image?)

2. 回到本地的项目上，在`.vuepress/config.js`中新增一个  `base`  路径配置，这个非常重要‼️

```js
module.exports = {
    title: 'Jessie的个人技术博客',
    description: '办法总比问题多',
    base: '/Jessie-blog/', // 这个路径名称就是你刚才所配置的项目名！！！，斜杠不能漏！！！⚠️
    theme: "reco",
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            {
                text: 'Jessie的博客',
                items: [
                    { text: 'Github', link: 'https://github.com/Jessie-jzn' },
                    { text: 'CSDN', link: 'https://blog.csdn.net/zn740395858?spm=1010.2135.3001.5343' }
                    { text: '掘金', link: 'https://juejin.cn/user/2524134425764375' }
                ]
            }
        ],
        sidebar:[
            {
                title: "博客搭建",
                path: "/construction/Blog1",
                collapsable: false, // 不折叠
                children: [
                    { title: "博客 01", path: "/construction/Blog1" },
                ],
            }
        ]
    }
}


```

3. 回到本地的项目上，新建一个 deploy.sh 文件在根目录下，这里需要配置下你自己的 git 地址和 git 项目名称和分支。（如果有学习 git 和工作 git 想分开配置的话，可以看下我之前写的博客：[git 操作之一台 mac 电脑绑定两个 git 账号，用于工作和学习区分](https://blog.csdn.net/zn740395858/article/details/121252620?spm=1001.2014.3001.5501)）

```sh
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件

npm run docs:build

# 进入生成的文件夹

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# 应为我本地有两个git，我学习的git命名是git@study.github.com
git push -f git@study.github.com:Jessie-jzn/Jessie-blog.git master:blog-pages
#git push -f git@github.com:你的git名/你的git项目名.git master:你的git分支

cd -
```

这就相当于把打包好的 dist 代码直接放在`blog-pages`下，到时候在 git 上配置部署的**Source**分支为这个字分支就行了，默认就会是渲染 index.html

4. 回到 github 项目上，配置 github pages 部署的资源，在这里我踩坑了，一开始我只选择了分支，并没有选择是/docs，导致发生 vuepress 部署在 github 上出现样式问题，最后发现不能使用默认的/root，而是要改成/docs，😭 这个问题让我看了一晚上，一直以为是路径问题

![1654953825918.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d0a8e1c4c824af9bc40e166798956e0~tplv-k3u1fbpfcp-watermark.image?)

最后生成的地址就是<https://jessie-jzn.github.io/Jessie-blog/>

基础使用 VuePress + GitHub Pages 搭建博客也就完成了。

## 踩坑

### 如果遇到部署上 github 后，vuepress 样式丢失的情况，请检查

- 是否是路径问题，`.vuepress/config.js`中的  `base`  路径是否正常
- github 上的资源部署路径是否正确，有没有选对分支，有没有选对资源文件夹

### 浏览器展示Mermaid图不生效

在github上展示得出来，但是在deploy后的浏览器页面却不生效了，目前没有找到解决办法。

备用方案是在Online FlowChart & Diagrams Editor - Mermaid Live Editor(<https://mermaid.live/edit>)生成Mermaid图，然后复制图片展示
