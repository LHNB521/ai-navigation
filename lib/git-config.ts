// Git配置
export const gitConfig = {
  // 仓库URL，如果需要可以在这里配置
  repositoryUrl: process.env.GIT_REPOSITORY_URL || "git@github.com:LHNB521/ai-navigation.git",

  // 分支名称
  branch: process.env.GIT_BRANCH || "main",

  // 提交者信息
  author: {
    name: process.env.GIT_AUTHOR_NAME || "LHNB521",
    email: process.env.GIT_AUTHOR_EMAIL || "1767359165@qq.com",
  },
}
