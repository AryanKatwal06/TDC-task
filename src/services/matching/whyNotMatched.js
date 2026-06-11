export function getWhyNotMatched(client, profile, breakdown) {
  const reasons = []
  
  if (breakdown.kids?.score < 40) {
    reasons.push('Children mismatch')
  }
  if (breakdown.lifestyle?.score < 40) {
    reasons.push('Lifestyle mismatch')
  }
  if (breakdown.income?.score < 40) {
    reasons.push('Income mismatch')
  }
  if (breakdown.relocation?.score < 40) {
    reasons.push('Location mismatch')
  }
  if (breakdown.familyValues?.score < 40) {
    reasons.push('Family values mismatch')
  }

  if (reasons.length === 0) {
    reasons.push('Overall alignment is too low')
  }

  return reasons
}
