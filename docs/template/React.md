---
title: 构建React+TypeScript+Webpack5 脚手架
author: Jessie
date: "2022-11-18"
---

## 构建项目

### **初始化项目**

```javascript
mkdir react-templeate
cd react-templeate 
npm init
```

### **安装Webpack**

```javascript
npm i webpack webpack-cli --save-dev
```

+ webpack-cli@4.9.1
+ webpack@5.64.1

## 配置Webpack

### 基础文件

#### **新建`webpack`相关文件**

```javascript
    |-- react-templeate
    |   |-- package-lock.json
    |   |-- package.json
    |   |-- tsconfig.json
    |   |-- webpack.common.js
    |   |-- webpack.dev.js
    |   |-- webpack.prod.js
```

#### **安装loader等来预处理文件**

```javascript
npm i css-loader style-loader -D
npm i postcss-loader autoprefixer -D
npm i babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
npm i ts-loader -D
```

+ css-loader@6.5.1：会对@import和url()进行处理
+ style-loader@3.3.1：将CSS注入到JavaScript中，通过DOM操作控制css
+ autoprefixer@10.4.0：增加厂商前缀（css增加浏览器内核前缀）
+ postcss-loader@6.2.0：处理css的loader
+ babel-loader@8.2.3：webpack的babel插件，在webpack中运行babel
+ @babel/core@7.16.0：babel核心库
+ @babel/preset-env@7.16.4：将ES6转换为向后兼容的JavaScript
+ @babel/plugin-transform-runtime@7.16.4：处理async，await、import()等语法关键字的帮助函数
+ ts-loader@9.2.6

> 在webpack5中，内置了资源模块（asset module），代替了file-loader和url-loader

#### **安装plugin插件**

```javascript
npm i html-webpack-plugin
npm i clean-webpack-plugin
npm i progress-bar-webpack-plugin
npm i chalk
npm i speed-measure-webpack-plugin
npm i webpack-bundle-analyzer
```

+ html-webpack-plugin@5.5.0：生成一个HTML5文件，在body中使用script标签引入webpack生成的bundle
+ clean-webpack-plugin@4.0.0：再次打包的时候，先把本地已有的打包后的资源清空，来减少它们对磁盘空间的占用
+ progress-bar-webpack-plugin@2.1.0：增加编译进度条
+ chalk@4.1.2
+ speed-measure-webpack-plugin@1.5.0：[非必备]构建速度分析，可以看到各个 loader、plugin 的构建时长，后续可针对耗时 loader、plugin 进行优化
+ webpack-bundle-analyzer@4.5.0：查看打包后生成的 bundle 体积分析

### 基础webpack.common.js配置

```javascript
// webpack.common.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const chalk = require("chalk");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

// 公用基础配置
module.exports = {
  // 入口
  entry: path.resolve(__dirname, "./src/index.js"),
  // 输出文件名
  output: {
    path: path.resolve(__dirname, "dist"), // 目标输出目录 path 的绝对路径
    filename: "[name].[contenthash:8].js", // 用于输出文件的文件名
  },
  // 路径别名
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      utils: path.resolve(__dirname, "src/common/utils/"),
      components: path.resolve(__dirname, "src/components"),
    },
    extensions: [".js", ".tsx"],
  },
  // 打包环境，默认开发
  mode: "development",
  // 模块
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp3|mp4|mov|wav|wma|avi|flv)$/i,
        type: "asset/inline",
        parser: {
          dataUrlCondition: {
            // 转换成data-uri的条件
            maxSize: 10 * 1024, // 10kb
          },
        },
        generator: {
          filename: "images/[hash][ext][query]", // 指定生成目录名称
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: [
          "babel-loader", // 代码换成ES5 的代码来做浏览器兼容
          "ts-loader",
        ],
      },
    ],
  },
  //插件
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new CleanWebpackPlugin(),
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }), // 进度条
  ],
};

```

直接在根目录下新建文件`postcss.config.js`配置

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
  ],
}
```

### 易错点

#### 1、TypeError: CleanWebpackPlugin is not a constructor

```javascript
// 错误写法
const CleanWebpackPlugin = require("clean-webpack-plugin");
...
plugin: [
  new CleanWebpackPlugin(["dist"], {
    root: path.resolve(__dirname, "../"), //根目录
    verbose: true, //开启在控制台输出信息
  }),
],
//或者
plugin: [
  new CleanWebpackPlugin(["dist"]),
],
...

// 正确写法
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
...
plugins: [
  new CleanWebpackPlugin(),
],
...
```

#### 2、 Invalid configuration object. Webpack has been initialized using a configuration object that does not match the API schema.- configuration has an unknown property 'plugin'

```javascript
// 错误写法
module: {
  rules: [
     {
      test: /\.(js|tsx)$/,
      exclude: /node_modules/,
      use: ["babel-loader", "ts-loader"],// 代码换成ES5 的代码来做浏览器兼容
      options: {
        presets: ["@babel/preset-env"],
        cacheDirectory: true, // 开启缓存
      },
    },
  ],
},

// 正确写法
module: {
  rules: [
    {
      test: /\.(js|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",// 代码换成ES5 的代码来做浏览器兼容
          options: {
            presets: ["@babel/preset-env"],
            cacheDirectory: true, // 开启缓存
          },
        },
        "ts-loader",
      ],
    },
  ],
},
// 或者
module: {
  rules: [
   {
      test: /\.js$/,
      loader: "babel-loader", // 代码换成ES5 的代码来做浏览器兼容
      options: {
        presets: ["@babel/preset-env"],
        cacheDirectory: true, // 开启缓存
      },
    },
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: ["babel-loader", "ts-loader"],
    },
  ],
},
```

#### 3、No inputs were found in config file ‘tsconfig.json‘. Specified ‘include‘ paths were

原因:我们使用的是tsconfig默认是打包ts的却要打包js， 只需要在tsconfig配置`"allowJs": true`就可以了

#### 4、ERROR in Conflict: Multiple assets emit different content to the same filename index.html

原因：在`webpack.common.js`和`webpack.dev.js`文件中都配置了`HtmlWebpackPlugin`，并且template的地址不一致，保留一个就可以

```javascript
 plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
    }),
  ],
```

#### 5、ERROR in ./node_modules/html-entities/lib/index.js 15:28-60

#### ERROR in ./node_modules/html-entities/lib/index.js 14:25-54

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dfe601740944e1ca831f98368cf8fb4~tplv-k3u1fbpfcp-watermark.image?)
大致原因就是extensions的引号之类的符号写错了，这个问题看了我好久😭

```javascript
 // 错误写法
resolve: {
    extensions: [".js,'.tsx"],
},
// 正确写法
resolve: {
    extensions: [".js",".tsx"],
},
```

### 在package.json中配置dev命令

```javascript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.common.js",
    "start": "webpack serve --config webpack.dev.js",
    "release": "webpack serve --config webpack.prod.js"
},
```

运行npm run build

```javascript
npm run build
```

打包成功，发现dist文件夹中多了`bundle.306f67760e9c5ad3b005.js`和`index.html`两个文件

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de33c0abe72d4218b123718da0bc1ba8~tplv-k3u1fbpfcp-watermark.image?)

## 配置开发环境和生产环境

```javascript
npm i webpack-merge -D
npm i mini-css-extract-plugin
npm i css-minimizer-webpack-plugin
```

+ webpack-merge@5.8.0：合并通用配置和特定环境配置
+ mini-css-extract-plugin@2.4.5
+ css-minimizer-webpack-plugin@3.1.4：优化、压缩 CSS

### webpack.dev.js

```javascript
// webpack.dev.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// 开发环境
module.exports = smp.wrap(merge(common, {
  mode: 'development',
  entry: path.resolve(__dirname, "src"),
  devtool: "eval-cheap-module-source-map",
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  devServer: {
    hot: true, //热更新
    open: false, // 是否打开默认浏览器
    historyApiFallback: true, // 当使用 [HTML5 History API] 时，任意的 `404` 响应被替代为 `index.html`
    port: 9000, // 启动的端口
    compress: true, // 是否开启代码压缩
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
    }),
  ],
}));

```

### webpack.prod.js

```javascript
// webpack.prod.js
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin"); // webpack5自带，无需安装
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); //优化、压缩 CSS
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = merge(common, {
  mode: "production",
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[chunkhash:8].js",
    clean: true, // 编译前清除目录
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include: [path.resolve(__dirname, "src/common/styles"), /node_modules/],
        use: [MiniCssExtractPlugin.loader],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
  ],
  optimization: {
    // js压缩
    minimizer: [
      new TerserPlugin({
        parallel: 4, // 使用多进程并发运行压缩以提高构建速度。
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin({
        parallel: 4,
      }),
    ],
  },
});

```

## 规范化配置：eslint和prettier

```javascript
npm i prettier
npm i eslint
npm i eslint-config-prettier
```

+ prettier@2.4.1：代码格式的校验（并格式化代码），不会对代码质量进行校验
+ eslint@8.2.0：代码格式的校验，代码质量的校验，`JS`规范
+ eslint-config-prettier@8.3.0：覆盖`eslint`部分规则，解决冲突

### prettier

新建`.prettierrc.js`文件

```javascript
// .prettierrc.js
module.exports = {
  printWidth: 124, // 代码宽度建议不超过124字符
  tabWidth: 2, // tab缩进2个空格
  semi: false, // 末尾分号
  singleQuote: true, // 单引号
  jsxSingleQuote: true, // jsx中使用单引号
  arrowParens: 'avoid', // 箭头函数仅在必要时使用()
  htmlWhitespaceSensitivity: 'css', // html空格敏感度
  useTabs: false,
  trailingComma: "none",// 尾随逗号
  bracketSpacing: true,
  jsxBracketSameLine: false,
  endOfLine: "lf",
}

```

新建`.prettierignore`文件

```javascript
//.prettierignore 
**/*.min.js
**/*.min.css

.idea/
node_modules/
dist/
build/

```

### eslint

初始化eslint

```js
npx eslint --init
```

修改`.eslintrc.js`部分配置

```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    browser: true,
    commonjs: true,
    amd: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off'
  }
}

```

新建`.eslintignore`文件

```javascript
.eslintrc.js
node_modules
public
```

## 代码提交校验：`husky`+`lint-staged`+`commitlint`

```js
npm i husky
npm i lint-staged
```

+ husky@7.0.4
+ lint-staged@11.2.6

在`packpackage.json`文件中添加prepare脚本语句

```javascript
"scripts": {
    "prepare": "husky install",
},
```

运行命令`npm run prepare`,创建.husky/目录并指定该目录为git hooks所在的目录,可以看到根目录下新增了`.husky`的文件夹

```js
npm run prepare
```

### 运行命令创建git hooks，pre-commit的shell脚本

```js
npx husky add .husky/pre-commit "npm run lint"
```

运行完该命令后我们会看到.husky/目录下新增了一个名为pre-commit的shell脚本，脚本内容为：

```javascript
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
```

该脚本就是执行`npm run lint`这个命令，在执行`git commit`命令时会先执行`pre-commit`的shell脚本内容

### 运行命令创建`commit-msg`脚本

```js
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

运行完该命令后我们会看到.husky/目录下新增了一个名为commit-msg的shell脚本，脚本内容为：

```javascript
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx --no-install commitlint --edit "$1"
```

### 配置`lint-staged`

在`package.json`中配置运行命令：

```javascript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.common.js",
    "start": "webpack serve --config webpack.dev.js",
    "release": "webpack --config webpack.prod.js",
    "prepare": "husky install",
    "lint": "lint-staged"
},
"lint-staged": {
    "./src/*.{js,jsx,ts,tsx,json}": [
      "prettier --write",
      "eslint",
      "git add"
    ]
},
```

新建`lint-staged.config.js`文件

```javascript
// lint-staged.config.js
'use strict'
module.exports = {
  linters: {
    './src/*.ts': ['prettier --write', 'eslint --fix', 'git add'],
    './src/*.js': ['prettier --write', 'eslint --cache --fix', 'git add'],
    './src/*.vue': ['prettier --write', 'eslint --cache --fix', 'git add'],
    './src/*.{json,md,yml,css}': ['prettier --write', 'git add']
  }
}
```

### 配置提交规范

安装依赖

```js
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

+ @commitlint/config-conventional@15.0.0
+ @commitlint/cli@15.0.0
生成配置文件

```javascript
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

配置提交代码规则

```javascript
//commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'bug', // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
        'feature', // 新功能（feature）
        'fix', // 修补bug
        'docs', // 文档（documentation）
        'style', // 格式（不影响代码运行的变动）
        'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
        'merge' // 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
      ]
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72]
  }
}

```

如果提交命令不正确，则会报错
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bafdf53996ae4a3681566dc99e3d2092~tplv-k3u1fbpfcp-watermark.image?)

## 配置react

### **安装基础相关库**

```javascript
npm i react react-dom react-redux react-router-dom typescript --save
```

+ react-redux@7.2.6
+ react-dom@17.0.2
+ react@17.0.2
+ react-router-dom@6.0.2
+ typescript@4.4.4

### **安装@types声明库**

```javascript
npm i @types/react @types/react-dom @types/react-redux --save-dev
```

+ @types/react-dom@17.0.11
+ @types/react-redux@7.1.20
+ @types/react@17.0.35

### **创建 tsconfig.json**

> 更详细的配置可以看[tsconfig.json](https://www.tslang.cn/docs/handbook/compiler-options.html)

```javascript
{
    "compilerOptions": {
      "module": "esnext",
      "target": "es5",
      "allowJs": true,
      "lib": [
        "es5", "dom", "es2015.promise", "es2015.core", "es2015.collection", "es2016.array.include"
      ],   
      "sourceMap": false,
      "declaration": true,
      "removeComments": false, // 删除所有的注释
      "experimentalDecorators": true,  //启用实验性的ES装饰器。
      "allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入
      "importHelpers": true, // 从 tslib 导入辅助工具函数
      "noUnusedLocals": true, // 若有未使用的局部变量则抛错。
      "noUnusedParameters": true, // 若有未使用的参数则抛错。
      "noImplicitThis": true, // 当 this表达式的值为 any类型的时候，生成一个错误
      "noFallthroughCasesInSwitch": true, // 不允许switch的case语句贯穿
      "noImplicitReturns": true, // 不是函数的所有返回路径都有返回值时报错
      "noImplicitAny": true, // 在表达式和声明上有隐含的 any类型时报错
      "strict": true,
      "strictNullChecks": true,// 在严格的 null检查模式下， null和 undefined值不包含在任何类型里，只允许用它们自己和 any来赋值
      "strictPropertyInitialization": true, // 确保类的非undefined属性已经在构造函数里初始化
      "rootDir": ".",
      "baseUrl": "src",
      "outDir": "dist", 
      "jsx": "react", // 在 .tsx 文件里支持 jsx
      "moduleResolution": "node",
    },
    "include": [
      "src",
    ]
}
```

### 修改`webpack.common.js`文件中的配置让其支持`react`和`TypeScript`

```javascript
npm install --save-dev @babel/preset-typescript @babel/preset-react
```

+ @babel/preset-typescript@7.16.0
+ @babel/preset-react@7.16.0

### 修改之前`.babelrc`配置文件，让`babel`支持转译的`ts`文件

```javascript
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
    ],
    "plugins": ["@babel/plugin-transform-runtime"]
}
```

### 配置`index.html`

```javascript
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta content="webkit" name="renderer">
    <meta name="format-detection" content="telephone=no">
    <meta content="email=no" name="format-detection">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <meta content="width=device-width,initial-scale=1,user-scalable=no,shrink-to-fit=no" name="viewport">
    <title>react模版</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

### 配置`index.tsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

// import 'styles/index.scss'

const App = () => {
  return <div>hello world</div>;
};

ReactDOM.render(<App />, document.getElementById('app'));

```

运行命令`npm run start`成功

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da54ce4e70da4af59f52327a7b991c98~tplv-k3u1fbpfcp-watermark.image?)

## 代码

<https://github.com/Jessie-jzn/react-template>
