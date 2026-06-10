import { seedClientsForMatchmaker } from '@/firebase/firestore'
import profiles from './profiles.js'

/**
 * Seed data for the test matchmaker account.
 *
 * These 25 clients represent a realistic matchmaker's caseload:
 * - Mix of male and female
 * - Mix of cities, religions, ages
 * - Mix of status tags (Active, New, On Hold, Matched)
 * - Five clients have pre-existing notes
 * - Three clients have pre-populated sentMatches arrays
 * - Three clients are NRI
 *
 * To seed: open browser console on any authenticated page and run:
 *   import('@/data/seed.js').then(m => m.seedDatabase('YOUR_UID_HERE'))
 */

const SAMPLE_CLIENTS = profiles.map(p => ({
  ...p,
  statusTag: p.statusTag || 'Active'
}))

export async function seedDatabase(matchmakerUid) {
  if (!matchmakerUid) {
    throw new Error('seedDatabase requires a matchmakerUid string argument.')
  }
  await seedClientsForMatchmaker(matchmakerUid, SAMPLE_CLIENTS)
}