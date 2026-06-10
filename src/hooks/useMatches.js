import { useEffect } from 'react'
import { getMatchesForClient } from '@/engine/index.js'
import { fetchPoolProfiles }   from '@/firebase/firestore'
import useMatchStore  from '@/store/matchStore'


export function useMatchesForClient(client) {
  const setMatches   = useMatchStore((s) => s.setMatches)
  const setComputing = useMatchStore((s) => s.setComputing)
  const setError     = useMatchStore((s) => s.setError)
  const clearMatches = useMatchStore((s) => s.clearMatches)
  const resetVisible = useMatchStore((s) => s.resetVisible)

  useEffect(() => {
    if (!client) return

    clearMatches()
    setComputing(true)
    resetVisible()

    async function compute() {
      try {
        const pool    = await fetchPoolProfiles()
        const sentIds = client.sentMatches ?? []

        // We yield to the browser's paint cycle before running the engine.
        // The engine is synchronous and fast, but without this yield the
        // loading spinner never renders — the browser processes JS then paint.
        await new Promise((resolve) => setTimeout(resolve, 0))

        // setTimeout(0) above is intentional — see comment.
        const results = getMatchesForClient(client, pool, sentIds)
        setMatches(results)
      } catch (err) {
        setError('Failed to compute matches. Please refresh.')
      }
    }

    compute()
  // We depend on the ID specifically, not the whole client object,
  // to avoid infinite loops when object references change.
  }, [client?.id])
}
