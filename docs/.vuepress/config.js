const markdownHeaderPlugin = require('./plugins/markdown-header-plugin');
module.exports = {
  title: "Jessie的个人技术博客",
  description: "办法总比问题多",
  theme: "reco",
  // theme:{
  //   layout: 'CustomLayout',
  // },
  base: "/Jessie-blog/",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  themeConfig: {
    date_format: "yyyy-MM-dd HH:mm:ss",
    lastUpdated: "上次更新",
    subSidebar: "auto",
    nav: [
      { text: "首页", link: "/" },
      {
        text: "Jessie的博客",
        items: [
          { text: "GitHub", link: "https://github.com/Jessie-jzn" },
          {
            text: "CSDN",
            link: "https://blog.csdn.net/zn740395858?spm=1010.2135.3001.5343",
          },
          { text: "掘金", link: "https://juejin.cn/user/2524134425764375" },
        ],
      },
    ],
    sidebar: [
      // {
      //   title: "欢迎学习",
      //   path: "/",
      //   collapsable: false, // 不折叠
      //   children: [{ title: "学前必读", path: "/" }],
      // },
      {
        title: "博客搭建",
        path: "/construction/Blog1",
        collapsable: false, // 不折叠
        children: [{ title: "Blog 01", path: "/construction/Blog1" },
        ],
      },
      {
        title: "脚手架搭建",
        path: "/template/React",
        collapsable: false, // 不折叠
        children: [
          { title: "React+TypeScript+Webpack5", path: "/template/React" },
        ],
      },
      {
        title: "ECMAScript",
        path: "/ECMAScript/Set",
        collapsable: false, // 不折叠
        children: [
          { title: "Set类型", path: "/ECMAScript/Set" },
          { title: "WeakSet类型", path: "/ECMAScript/WeakSet" },
          { title: "Map类型", path: "/ECMAScript/Map" },
        ],
      },
      {
        title: "JS基础",
        path: "/javascript/Closure",
        collapsable: false, // 不折叠
        children: [
          { title: "闭包", path: "/javascript/Closure" },
          { title: "原型链", path: "/javascript/Prototype" },
          // { title: "事件循环机制", path: "/javascript/cycle" },
          // { title: "事件冒泡和事件捕获", path: "/javascript/Prototype" },
        ],
      },
      {
        title: "浏览器基础",
        path: "/javascript/browser/Navigation",
        collapsable: false, // 不折叠
        children: [
          {
            title: "导航流程：从输入URL到页面展示",
            path: "/browser/Navigation",
          },
          { title: "渲染流程：如何渲染资源到显示屏", path: "/browser/Render" },
          // { title: "Event Loop 机制", path: "/browser/Navigation" },
          // { title: "垃圾回收机制", path: "/browser/Navigation" },
          // { title: "localstorage与cookie ", path: "/browser/Navigation" },
        ],
      },
      {
        title: "网络基础",
        path: "/network/CachingComparison",
        collapsable: false, // 不折叠
        children: [
          { title: "Cookie缓存比较", path: "/network/CachingComparison" },
        ],
      },
      {
        title: "算法",
        path: "/algorithm/Array/BinarySearch",
        collapsable: false, // 不折叠
        children: [
          {
            title: "数组",
            path: "/algorithm/Array/BinarySearch",
            children: [
              {
                title: "二分查找",
                path: "/algorithm/Array/BinarySearch",
              },
            ],
          },
          {
            title: "链表",
            path: "/algorithm/Link/BaseLink",
            children: [
              {
                title: "基础知识",
                path: "/algorithm/Link/BaseLink",
              },
            ],
          },
        ],
      },
      {
        title: "代码题",
        path: "/code/Debounce",
        collapsable: false, // 不折叠
        children: [
          { title: "函数防抖", path: "/code/Debounce" },
          { title: "函数节流", path: "/code/Throttle" },
          { title: "数组去重", path: "/code/Repeat" },
          // { title: "柯里化", path: "/code/Repeat" },
          // { title: "Promise实现", path: "/code/Repeat" },
        ],
      },
      {
        title: "React",
        path: "/react/ReactFiber",
        collapsable: false, // 不折叠
        children: [
          { title: "React Fiber", path: "/react/ReactFiber" },

        ],
      },
      {
        title: "Next",
        path: "/next/base",
        collapsable: false, // 不折叠
        children: [
          { title: "基础", path: "/next/base" },

        ],
      },
      {
        title: "其他",
        path: "/others/VueBug",
        collapsable: false, // 不折叠
        children: [
          { title: "Vue常见错误解决", path: "/others/VueBug" },
          { title: "React常见错误解决", path: "/others/ReactBug" },

        ],
      },
      // {
      //   title: "面经",
      //   path: "/interview/Toutiao",
      //   collapsable: false, // 不折叠
      //   children: [
      //     { title: "头条商业化", path: "/interview/Toutiao" },
      //     { title: "瞬联科技", path: "/interview/Toutiao" },
      //     { title: "阿里本地生活", path: "/interview/Toutiao" },
      //     { title: "WIFI万能钥匙", path: "/interview/Toutiao" },
      //     { title: "小红书", path: "/interview/Toutiao" },
      //     { title: "众安", path: "/interview/Toutiao" },
      //     { title: "传音控股", path: "/interview/Toutiao" },
      //     { title: "Convertlab", path: "/interview/Toutiao" },
      //   ],
      // },
    ],
  },
  plugins: [
    ['@vuepress/back-to-top'],
    ['@vuepress/active-header-links'],
    [markdownHeaderPlugin, {
      author: '您的默认作者名',
    }],
    ['markdown-header-plugin', {
      author: '您的默认作者名',
    }],
  ],
};
