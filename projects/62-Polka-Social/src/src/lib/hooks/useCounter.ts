import { useMemo, useState } from 'react'

export default function useCounter() {
  const [counter, setCounter] = useState(0)
  return useMemo(() => {
    const countUp = () => setCounter((prev) => prev + 1)
    return [counter, countUp] as const
  }, [counter])
}
