import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { gitConfig } from "@/lib/git-config"

const execPromise = promisify(exec)

export async function POST() {
  try {
    // 获取当前时间作为提交信息
    const date = new Date().toISOString()
    const commitMessage = `更新网站导航数据 - ${date}`

    // 设置Git用户信息（如果配置了）
    if (gitConfig.author.name && gitConfig.author.email) {
      await execPromise(`git config user.name "${gitConfig.author.name}"`)
      await execPromise(`git config user.email "${gitConfig.author.email}"`)
      console.log("Git user configured")
    }

    // 执行Git命令
    // 1. 添加所有更改
    await execPromise("git add .")
    console.log("Git add completed")

    // 2. 提交更改
    await execPromise(`git commit -m "${commitMessage}"`)
    console.log("Git commit completed")

    // 3. 推送到远程仓库
    await execPromise(`git push origin ${gitConfig.branch}`)
    console.log("Git push completed")

    return NextResponse.json({ success: true, message: "成功提交到GitHub仓库" })
  } catch (error: any) {
    console.error("Git操作失败:", error)
    return NextResponse.json(
      {
        error: "执行Git命令失败",
        details: error.message || "未知错误",
      },
      { status: 500 },
    )
  }
}

