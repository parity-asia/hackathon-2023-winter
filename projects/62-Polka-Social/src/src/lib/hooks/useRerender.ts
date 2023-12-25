import { useCallback, useState } from 'react'

export default function useRerender() {
  const [, setCounter] = useState(0)
  return useCallback(() => setCounter((prev) => prev + 1), [])
}
