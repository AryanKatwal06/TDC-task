export function classifyMatch(score, confidence, breakdown) {
  // Returns structured classification
  return {
    tier:        getTierLabel(score),
    confidence:  getConfidenceLabel(confidence),
    primaryAxis: getPrimaryCompatibilityAxis(breakdown),
  }
}

function getTierLabel(score) {
  if (score >= 95) return 'Elite'
  if (score >= 85) return 'Excellent'
  if (score >= 75) return 'Strong'
  if (score >= 60) return 'Moderate'
  return 'Weak'
}

function getConfidenceLabel(confidence) {
  if (confidence >= 75) return 'High Confidence'
  if (confidence >= 50) return 'Medium Confidence'
  return 'Low Confidence'
}

function getPrimaryCompatibilityAxis(breakdown) {
  // Find the highest scoring dimension
  const entries = Object.entries(breakdown)
  if (entries.length === 0) return 'Overall Alignment'

  // Sort by weighted contribution to find the strongest area
  entries.sort(([, a], [, b]) => (b.score * b.weight) - (a.score * a.weight))
  const topKey = entries[0][0]

  const axisMap = {
    kids: 'Family Outlook',
    relocation: 'Location Flexibility',
    education: 'Educational Background',
    lifestyle: 'Values & Lifestyle',
    familyValues: 'Family Background',
    profession: 'Professional Alignment',
    income: 'Financial Alignment',
  }

  return axisMap[topKey] ?? 'Overall Alignment'
}
