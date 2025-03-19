// Git配置
export const gitConfig = {
  // 仓库URL，如果需要可以在这里配置
  repositoryUrl: process.env.GIT_REPOSITORY_URL || "",

  // 分支名称
  branch: process.env.GIT_BRANCH || "main",

  // 提交者信息
  author: {
    name: process.env.GIT_AUTHOR_NAME || "网站导航系统",
    email: process.env.GIT_AUTHOR_EMAIL || "system@example.com",
  },

  // 拉取策略
  pullStrategy: process.env.GIT_PULL_STRATEGY || "merge", // 可选值: 'merge', 'rebase'
}

