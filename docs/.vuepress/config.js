module.exports = {
  title: "Jessie的个人技术博客",
  description: "办法总比问题多",
  theme: "reco",
  base: '/Jessie-blog/',
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
      // {
      //   title: "欢迎学习",
      //   path: "/",
      //   collapsable: false, // 不折叠
      //   children: [{ title: "学前必读", path: "/" }],
      // },
      {
        title: "Create Blog",
        path: "/construction/Blog1",
        collapsable: false, // 不折叠
        children: [
          { title: "Blog 01", path: "/construction/Blog1" },
        ],
      },

    ],
  },
};
