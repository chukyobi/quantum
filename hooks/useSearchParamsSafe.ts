"use client"

import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

export function useSearchParamsSafe() {
  const searchParams = useSearchParams()

  const safeSearchParams = useMemo(() => {
    if (!searchParams) {
      return {
        get: (): string | null => null,
        has: (): boolean => false,
        getAll: (): string[] => [],
        keys: (): IterableIterator<string> => [][Symbol.iterator](),
        values: (): IterableIterator<string> => [][Symbol.iterator](),
        entries: (): IterableIterator<[string, string]> => [][Symbol.iterator](),
        forEach: (): void => {},
        toString: (): string => "",
      }
    }
    return searchParams
  }, [searchParams])

  return safeSearchParams
}
