import { rankProfiles }                                from './ranker.js'
import { generateStrengths, generateConcerns, generateHeadline } from './explainer.js'
import { generateIntroText }                           from './introGenerator.js'

/**
 * Public API for the matchmaking engine.
 * This is the ONLY file that consumers outside src/engine/ should import from.
 *
 * Takes a client and the full pool, returns a ranked array of match results.
 * Each result contains the profile, score, tier, confidence, breakdown,
 * human-readable strengths/concerns, headline, intro text, and sent status.
 */
export function getMatchesForClient(client, pool, sentMatchIds = []) {
  const ranked = rankProfiles(client, pool)

  return ranked.map((match) => {
    const strengths = generateStrengths(match.breakdown, client, match.profile)
    const concerns  = generateConcerns(match.breakdown, client, match.profile)
    const headline  = generateHeadline(match.tier, match.breakdown)
    const introText = generateIntroText(client, match.profile, match)

    return {
      ...match,
      strengths,
      concerns,
      headline,
      introText,
      alreadySent: sentMatchIds.includes(match.profile.id),
    }
  })
}
