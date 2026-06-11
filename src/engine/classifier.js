export function classifyMatch(score, confidence, breakdown) {
  return {
    tier:        getTierLabel(score),
    confidence:  getConfidenceLabel(confidence),
    primaryAxis: getPrimaryCompatibilityAxis(breakdown),
  }
}

function getTierLabel(score) {
  if (score >= 80) return 'Exceptional'
  if (score >= 65) return 'Strong'
  if (score >= 50) return 'Good'
  if (score >= 35) return 'Fair'
  return 'Low'
}

function getConfidenceLabel(confidence) {
  if (confidence >= 75) return 'High Confidence'
  if (confidence >= 50) return 'Medium Confidence'
  return 'Low Confidence'
}

function getPrimaryCompatibilityAxis(breakdown) {
  const entries = Object.entries(breakdown)
  if (entries.length === 0) return 'Overall Alignment'

  entries.sort(([, a], [, b]) => (b.score * b.weight) - (a.score * a.weight))
  const topKey = entries[0][0]

  const axisMap = {
    age: 'Age Compatibility',
    height: 'Physical Alignment',
    income: 'Professional Alignment',
    education: 'Educational Background',
    religion: 'Cultural Compatibility',
    values: 'Values & Lifestyle',
    lifestyle: 'Values & Lifestyle',
    relocation: 'Location Flexibility',
    kids: 'Family Outlook',
    familyValues: 'Family Background',
  }

  return axisMap[topKey] ?? 'Overall Alignment'
}
