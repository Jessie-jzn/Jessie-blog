module.exports = (options, ctx) => ({
    extendPageData($page) {
      console.log("$page:", $page);
      if ($page && $page._filePath && $page._filePath.endsWith(".md")) {
        console.log("文件路径:", $page._filePath);
        const header = `
  ---
  title: ${$page.title || "未命名"}
  author: ${options.author || ""}
  date: "${new Date().toISOString().slice(0, 10)}"
  ---
  `;
        $page.content = `${header}\n${$page.content}`;
      }
    },
  });
  