import { rankProfiles }                                from './ranker.js'
import { generateStrengths, generateConcerns, generateHeadline } from './explainer.js'
import { generateIntroText }                           from './introGenerator.js'
import { classifyMatch }                               from './classifier.js'
import { getWhyNotMatched }                            from '../services/matching/whyNotMatched.js'
import { getProfileCompleteness }                      from '../services/matching/profileCompleteness.js'

// Public API for the matchmaking engine. This is the ONLY file consumers should import from.
export function getMatchesForClient(client, pool, sentMatchIds = []) {
  const ranked = rankProfiles(client, pool)

  // Add completeness score to client itself (this could be done earlier but convenient here)
  client.completeness = getProfileCompleteness(client)

  return ranked.map((match) => {
    // Keep the rule-based strings as fast fallbacks/summaries
    const strengths = generateStrengths(match.breakdown, client, match.profile)
    const concerns  = generateConcerns(match.breakdown, client, match.profile)
    const headline  = generateHeadline(match.tier, match.breakdown)
    const introText = generateIntroText(client, match.profile, match)
    const whyNotMatched = getWhyNotMatched(client, match.profile, match.breakdown)

    return {
      ...match,
      strengths,
      concerns,
      headline,
      introText,
      whyNotMatched,
      classification: classifyMatch(match.score, match.confidence, match.breakdown),
      alreadySent: sentMatchIds.includes(match.profile.id),
      profile: {
        ...match.profile,
        completeness: getProfileCompleteness(match.profile)
      }
    }
  })
}
