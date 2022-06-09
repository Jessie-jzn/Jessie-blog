module.exports = {
  title: "Jessie的个人技术博客",
  description: "办法总比问题多",
  theme: "reco",
  base: '/jessie-blog/',
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  themeConfig: {
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
      {
        title: "欢迎学习",
        path: "/",
        collapsable: false, // 不折叠
        children: [{ title: "学前必读", path: "/" }],
      },
      {
        title: "基础学习",
        path: "/javascript/ConditionalTypes",
        collapsable: false, // 不折叠
        children: [
          { title: "条件类型", path: "/javascript/ConditionalTypes" },
          { title: "泛型", path: "/javascript/Generics" },
        ],
      },
      {
        title: "算法学习",
        path: "/leetcode/ConditionalTypes",
        collapsable: false, // 不折叠
        children: [
          { title: "条件类型", path: "/leetcode/ConditionalTypes" },
          { title: "泛型", path: "/leetcode/Generics" },
        ],
      },
    ],
  },
};
