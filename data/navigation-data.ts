import type { Category } from "@/types/navigation"
import { Code, BookOpen, Coffee, ShoppingCart, Film, Music, Gamepad2, Newspaper } from "lucide-react"

export const navigationData: Category[] = [
  {
    id: "ai-hot",
    name: "AI热门工具",
    icon: "Code",
    subCategories: [
      {
        id: "ai-hot-tool",
        name: "AI热门工具",
        websites: [
          {
            id: "chatgpt1",
            name: "ChatGPT",
            url: "https://chatgpt.com",
            description: "AI聊天机器人",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "chatgpt2",
            name: "ChatGPT",
            url: "https://chatgpt.com",
            description: "AI聊天机器人",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "chatgpt3",
            name: "ChatGPT",
            url: "https://chatgpt.com",
            description: "AI聊天机器人",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "chatgpt4",
            name: "ChatGPT",
            url: "https://chatgpt.com",
            description: "AI聊天机器人",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "chatgpt5",
            name: "ChatGPT",
            url: "https://chatgpt.com",
            description: "AI聊天机器人",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "chatgpt6",
            name: "ChatGPT",
            url: "https://chatgpt.com",
            description: "AI聊天机器人",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "chatgpt7",
            name: "ChatGPT",
            url: "https://chatgpt.com",
            description: "AI聊天机器人",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "chatgpt8",
            name: "ChatGPT",
            url: "https://chatgpt.com",
            description: "AI聊天机器人",
          },
          {
            id: "chatgpt9",
            name: "ChatGPT",
            url: "https://chatgpt.com",
            description: "AI聊天机器人",
            icon: "/placeholder.svg?height=32&width=32",
          }
        ]
      }
    ]
  },
  {
    id: "development",
    name: "开发工具",
    icon: "Code",
    subCategories: [
      {
        id: "frontend",
        name: "前端开发",
        websites: [
          {
            id: "github",
            name: "GitHub",
            url: "https://github.com",
            description: "代码托管平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "stackoverflow",
            name: "Stack Overflow",
            url: "https://stackoverflow.com",
            description: "开发者问答社区",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "react",
            name: "React",
            url: "https://reactjs.org",
            description: "用于构建用户界面的 JavaScript 库",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
      {
        id: "backend",
        name: "后端开发",
        websites: [
          {
            id: "nodejs",
            name: "Node.js",
            url: "https://nodejs.org",
            description: "JavaScript 运行时",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "django",
            name: "Django",
            url: "https://www.djangoproject.com",
            description: "Python Web 框架",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
    ],
  },
  {
    id: "learning",
    name: "学习资源",
    icon: "BookOpen",
    subCategories: [
      {
        id: "courses",
        name: "在线课程",
        websites: [
          {
            id: "coursera",
            name: "Coursera",
            url: "https://www.coursera.org",
            description: "在线学习平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "udemy",
            name: "Udemy",
            url: "https://www.udemy.com",
            description: "在线课程平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
      {
        id: "documentation",
        name: "文档资源",
        websites: [
          {
            id: "mdn",
            name: "MDN Web Docs",
            url: "https://developer.mozilla.org",
            description: "Web 技术文档",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "w3schools",
            name: "W3Schools",
            url: "https://www.w3schools.com",
            description: "Web 开发学习网站",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
    ],
  },
  {
    id: "lifestyle",
    name: "生活服务",
    icon: "Coffee",
    subCategories: [
      {
        id: "food",
        name: "美食餐饮",
        websites: [
          {
            id: "meituan",
            name: "美团",
            url: "https://www.meituan.com",
            description: "生活服务平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "eleme",
            name: "饿了么",
            url: "https://www.ele.me",
            description: "外卖平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
      {
        id: "travel",
        name: "旅游出行",
        websites: [
          {
            id: "ctrip",
            name: "携程",
            url: "https://www.ctrip.com",
            description: "旅游服务平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "mafengwo",
            name: "马蜂窝",
            url: "https://www.mafengwo.cn",
            description: "旅游攻略社区",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
    ],
  },
  {
    id: "shopping",
    name: "购物",
    icon: "ShoppingCart",
    subCategories: [
      {
        id: "ecommerce",
        name: "电商平台",
        websites: [
          {
            id: "taobao",
            name: "淘宝",
            url: "https://www.taobao.com",
            description: "综合购物平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "jd",
            name: "京东",
            url: "https://www.jd.com",
            description: "综合购物平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
      {
        id: "speciality",
        name: "特色购物",
        websites: [
          {
            id: "xiaohongshu",
            name: "小红书",
            url: "https://www.xiaohongshu.com",
            description: "生活社区购物平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "pinduoduo",
            name: "拼多多",
            url: "https://www.pinduoduo.com",
            description: "社交电商平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
    ],
  },
  {
    id: "entertainment",
    name: "娱乐",
    icon: "Film",
    subCategories: [
      {
        id: "video",
        name: "视频平台",
        websites: [
          {
            id: "bilibili",
            name: "哔哩哔哩",
            url: "https://www.bilibili.com",
            description: "视频弹幕网站",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "youku",
            name: "优酷",
            url: "https://www.youku.com",
            description: "视频网站",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
      {
        id: "music",
        name: "音乐平台",
        websites: [
          {
            id: "netease-music",
            name: "网易云音乐",
            url: "https://music.163.com",
            description: "音乐平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "qqmusic",
            name: "QQ音乐",
            url: "https://y.qq.com",
            description: "音乐平台",
            icon: "/placeholder.svg?height=32&width=32",
          },
        ],
      },
    ],
  },
]

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Code":
      return Code
    case "BookOpen":
      return BookOpen
    case "Coffee":
      return Coffee
    case "ShoppingCart":
      return ShoppingCart
    case "Film":
      return Film
    case "Music":
      return Music
    case "Gamepad2":
      return Gamepad2
    case "Newspaper":
      return Newspaper
    default:
      return Code
  }
}

