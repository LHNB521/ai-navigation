import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { gitConfig } from "@/lib/git-config"

const execPromise = promisify(exec)

// 二次验证密码，应该存储在环境变量中
const SECOND_PASSWORD = process.env.SECOND_PASSWORD || "second-password"

export async function POST(request: Request) {
  try {
    // 获取请求体中的密码
    const { password } = await request.json()

    // 验证二次密码
    if (password !== SECOND_PASSWORD) {
      return NextResponse.json({ error: "验证密码错误" }, { status: 401 })
    }

    console.log("开始从GitHub拉取代码")

    // 确保工作区干净，避免冲突
    const statusResult = await execPromise("git status --porcelain")

    // 如果有未提交的更改，先尝试提交
    if (statusResult.stdout.trim() !== "") {
      console.log("检测到未提交的更改，先进行提交")

      // 设置Git用户信息（如果配置了）
      if (gitConfig.author.name && gitConfig.author.email) {
        await execPromise(`git config user.name "${gitConfig.author.name}"`)
        await execPromise(`git config user.email "${gitConfig.author.email}"`)
        console.log("Git用户已配置")
      }

      // 自动提交未保存的更改
      const date = new Date().toISOString()
      const commitMessage = `自动提交未保存的更改 - ${date}`

      await execPromise("git add .")
      await execPromise(`git commit -m "${commitMessage}"`)
      console.log("未保存的更改已提交")
    }

    // 执行git pull命令
    const { stdout, stderr } = await execPromise(`git pull origin ${gitConfig.branch}`)

    console.log("Git pull完成")
    console.log("标准输出:", stdout)

    if (stderr && !stderr.includes("Already up to date")) {
      console.warn("标准错误:", stderr)
    }

    return NextResponse.json({
      success: true,
      message: "成功从GitHub仓库拉取代码",
      details: stdout,
    })
  } catch (error: any) {
    console.error("Git pull操作失败:", error)
    return NextResponse.json(
      {
        error: "执行Git pull命令失败",
        details: error.message || "未知错误",
      },
      { status: 500 },
    )
  }
}

