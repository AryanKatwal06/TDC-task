import { WEIGHTS, TIERS, DIMENSION_LABELS } from './constants.js'
import * as scorer from './scorer.js'

// The primary composition point for all dimension scores.
export function computeMatchScore(client, profile) {
  const gender  = (client.personal.gender ?? 'Male').toUpperCase()
  const weights = WEIGHTS[gender] ?? WEIGHTS.MALE

  const dimensions = {
    kids:         scorer.scoreKids(client, profile),
    relocation:   scorer.scoreRelocation(client, profile),
    education:    scorer.scoreEducation(client, profile),
    lifestyle:    scorer.scoreLifestyle(client, profile),
    familyValues: scorer.scoreFamilyValues(client, profile),
    profession:   scorer.scoreProfession(client, profile),
    income:       scorer.scoreIncome(client, profile),
  }

  const weightedTotal = Object.entries(dimensions).reduce((sum, [key, score]) => {
    return sum + (score * weights[key])
  }, 0)

  const finalScore = Math.round(Math.min(100, Math.max(0, weightedTotal)))

  const confidence = computeConfidence(client, profile, dimensions)
  const tier       = classifyTier(finalScore)

  const breakdown = Object.entries(dimensions).reduce((acc, [key, score]) => {
    acc[key] = {
      score:  Math.round(score),
      weight: weights[key],
      label:  DIMENSION_LABELS[key],
    }
    return acc
  }, {})

  return { score: finalScore, confidence, tier, breakdown }
}

// Confidence requires completeness, signal consistency, and lack of contradictions.
// Contradictory signals (many extreme highs mixed with extreme lows) reduce confidence
// because the matchmaker needs to manually verify the deal-breakers.
function computeConfidence(client, profile, dimensions) {
  const scores    = Object.values(dimensions)
  const highScores = scores.filter((s) => s >= 70).length
  const lowScores  = scores.filter((s) => s <= 30).length

  // More high scores = more confident. More lows = less confident.
  const signalStrength = (highScores * 8) - (lowScores * 4)

  // Missing data penalty
  const missingFields = [
    client.personal?.dob,
    client.personal?.heightCm,
    client.professional?.annualIncomeLakh,
    client.preferences?.wantKids,
    client.preferences?.openToRelocate,
  ].filter((v) => v == null || v === '').length

  const rawConfidence = Math.min(100, Math.max(20, 60 + signalStrength - missingFields * 6))
  return Math.round(rawConfidence)
}


export function classifyTier(score) {
  if (score >= 95) return 'Elite'
  if (score >= 85) return 'Excellent'
  if (score >= 75) return 'Strong'
  if (score >= 60) return 'Moderate'
  return 'Weak'
}

// Ties in score are broken by confidence rating.
export function rankProfiles(client, pool) {
  const targetGender = client.personal.gender === 'Male' ? 'Female' : 'Male'

  return pool
    .filter((p) => p.personal.gender === targetGender)
    .map((profile) => ({
      profile,
      ...computeMatchScore(client, profile),
    }))
    .sort((a, b) => b.score - a.score || b.confidence - a.confidence)
}
