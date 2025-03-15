"use client"

import { useEffect, useState, useRef } from "react"

interface UseIntersectionObserverProps {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  enabled?: boolean
}

export function useIntersectionObserver({
  root = null,
  rootMargin = "0px",
  threshold = 0,
  enabled = true,
}: UseIntersectionObserverProps = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<Element | null>(null)

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
    setIsIntersecting(entry.isIntersecting)
  }

  useEffect(() => {
    const node = elementRef.current

    if (!enabled || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [enabled, root, rootMargin, threshold, elementRef.current])

  return { ref: elementRef, entry, isIntersecting }
}

