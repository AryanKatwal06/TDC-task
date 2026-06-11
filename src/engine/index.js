import { rankProfiles }                                from './ranker.js'
import { generateStrengths, generateConcerns, generateHeadline } from './explainer.js'
import { generateIntroText }                           from './introGenerator.js'
import { classifyMatch }                               from './classifier.js'

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
      classification: classifyMatch(match.score, match.confidence, match.breakdown),
      alreadySent: sentMatchIds.includes(match.profile.id),
    }
  })
}
