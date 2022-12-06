---
title: Vue常见错误解决
author: Jessie
date: "2018-06-10"
---
最近在做vue项目的时候遇到了几个报错，这几个报错在vue项目还算常见，因此记录下来解决方法。

----------

**Error in render: "TypeError: Cannot read property 'list' of undefined"**

**报错：** 渲染错误：“未定义的Type Error：无法读取属性”列表
**原因：** 没给list定义，也就是说在temple中用到list了，但是在data中没定义这个字段，如果已经定义了但是还是报错，请检查下自己是否拼错了单词，因为我就是这么蠢了= =
**解决：**

```js
data () {
  return {
    list: []
  }
},
```

----------

**[Vue warn]: Property or method "message" is not defined on the instance but referenced during render. Make sure that this property is reactive, either in the data option, or for class-based components, by initializing the property**

**报错：** message没定义
**原因：** 跟上面的一样，message在data那里没有定义，定义一个初始值就好
**解决：**

```js
data() {
 return {
     message: ''
  }
},
```

----------

**Module build failed: Error: No parser and no file path given, couldn't infer a parser.**

**报错：** 没有语法分析器和文件路径，无法推断解析器
**原因：** 依赖包出现问题，prettier 一个vue-cli的依赖，把一个feature 的移除当作次版本发布
**解决：** npm install --save-dev prettier@1.12.0（删除 node_modules下_prettier@1.13.0@prettier文件夹）

----------

**routes forEach is not a function**

**原因：** forEach routes没有发现里面有值
**解决：**
1.查看import {routes} from './routes'这个路径是否正确
2.routes是一个数组，检查routes是否是一个数组
3.是否已经new了一个router，又再次new一遍?

```js
// main.js
// 路由配置
const RouterConfig = {
  // 使用HTML5的History模式
  mode: 'history',
  routes: Routers
}
// new VueRouter
const router = new VueRouter(RouterConfig)


// router.js
// 在router中又再次new一遍，重复了！！！！
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    }
  ]
})

改为：
// router.js
const routers = [
  {
    path: '/home',
    meta: {
      title: '主页'
    },
    component: (resolve) => require(['../page/home.vue'], resolve)
]
export default routers

```

----------
**[Vue warn]: Unknown custom element: did you register the component correctly? For recursive components, make sure to provide the "name" option.**

**原因：** 被引用的组件页面没有进行export，导致寻找不到浏览器console报错，但是编译的时候没有语法问题不报错
**解决：**

```js
export { default as AppMain } from './AppMain'
```

----------
**TypeError: Cannot read property 'vue' of undefined**

报错信息：ERROR in ./src/login.vue Module build failed (from ./node_modules/_vue-loader@13.7.3@vue-loader/index.js): TypeError: Cannot read property 'vue' of undefined at Object.module.exports (F:\VistualStudioCode\threess\node_modules\_vue-loader@13.7.3@vue-loader\lib\load er.js:61:18) @ ./src/main.js 7:13-35 @ multi ./node_modules/_webpack-dev-server@3.1.10@webpack-dev-server/client?http://localhost:3000 (webpack)/h ot/dev-server.js ./src/main.js
**原因：** vue-loader这个插件被破坏了
**解决：**

```js
// 重新安装依赖
npm install vue-loader@latest --save-dev
```

----------
route内的query参数没有实时监听，放在data中
**报错信息：** 导致query参数改变之后，页面并没有发生变化
**解决：**

```js
  watch: {
    $route: {
      handler (newVal, oldVal) {
        this.isBindInfo = newVal.query.isBindInfo
        this.isRealName = newVal.query.isRealName
        this.sessionId = newVal.query.sessionId
        this.showNo = newVal.query.showNo
        // 判断newVal有没有值监听路由变化
      },
      deep: true,
    },

  },
```
