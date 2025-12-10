import { useEffect, useState } from 'react'
export function useReactive(obs:any){
  const [state,setState] = useState()
  useEffect(()=>{ const s=obs.subscribe(setState); return ()=>s.unsubscribe() },[obs])
  return state
}