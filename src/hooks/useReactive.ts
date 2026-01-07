import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'

export function useReactive<T>(obs: Observable<T>): T | undefined {
  const [state, setState] = useState<T>()
  useEffect(() => {
    const s = obs.subscribe(setState)
    return () => s.unsubscribe()
  }, [obs])
  return state
}