import { useEffect } from 'react'
import { getMatchesForClient } from '@/engine/index.js'
import { fetchPoolProfiles }   from '@/firebase/firestore'
import useMatchStore  from '@/store/matchStore'

/**
 * Computes and stores match results for a given client.
 *
 * The pool is fetched once and cached (fetchPoolProfiles returns static JSON).
 * The engine runs synchronously after the pool is available.
 *
 * We wrap the engine run in a minimal setTimeout(0) to yield to the browser
 * paint cycle first, ensuring the loading spinner renders before the CPU work.
 */
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

        // Yield to browser paint cycle so spinner renders first
        await new Promise((r) => setTimeout(r, 0))

        const results = getMatchesForClient(client, pool, sentIds)
        setMatches(results)
      } catch (err) {
        setError('Failed to compute matches. Please refresh.')
      }
    }

    compute()
  }, [client?.id]) // Re-run only when the client ID changes
}
