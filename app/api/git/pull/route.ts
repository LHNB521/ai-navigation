import { exec } from "child_process"
import { NextResponse } from "next/server"
import util from "util"
import { gitConfig } from "@/lib/git-config"


const execPromise = util.promisify(exec)

interface GitConfig {
  // repoPath: string
  // branch: string
  pullStrategy: "merge" | "rebase"
}

// Function to read Git configuration from environment variables
function getGitConfig(): GitConfig {
  // const repoPath = process.env.GIT_REPO_PATH || gitConfig.repositoryUrl
  // const branch = process.env.GIT_BRANCH || gitConfig.branch // Default to 'main' if not specified
  const pullStrategy = (process.env.GIT_PULL_STRATEGY || gitConfig.pullStrategy).toLowerCase() as "merge" | "rebase" // Default to 'merge'

  // if (!repoPath) {
  //   throw new Error("GIT_REPO_PATH environment variable is not defined.")
  // }

  if (!["merge", "rebase"].includes(pullStrategy)) {
    throw new Error('GIT_PULL_STRATEGY must be either "merge" or "rebase".')
  }

  // return { repoPath, branch, pullStrategy }
  return { pullStrategy }
}

export async function POST(request: Request) {
  try {
    const gitConfig = getGitConfig()

    // Change the current working directory to the Git repository path
    // process.chdir(gitConfig.repoPath)

    // 执行git pull命令
    const pullCommand =
      gitConfig.pullStrategy === "rebase"
        ? `git pull --rebase`
        : `git pull`

    const { stdout, stderr } = await execPromise(pullCommand)

    if (stderr) {
      console.error(`Git pull error: ${stderr}`)
      return NextResponse.json({ error: `Git pull error: ${stderr}` }, { status: 500 })
    }

    console.log(`Git pull output: ${stdout}`)
    return NextResponse.json({ message: "Git pull completed successfully.", output: stdout }, { status: 200 })
  } catch (error: any) {
    console.error(`Error during Git pull: ${error.message}`)
    return NextResponse.json({ error: `Error during Git pull: ${error.message}` }, { status: 500 })
  }
}

