"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // 初始检查
    setMatches(media.matches)

    // 当媒体查询发生变化时更新匹配
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // 添加监听器
    media.addEventListener("change", listener)

    // 清理
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}

