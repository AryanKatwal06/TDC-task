export function getProfileCompleteness(profile) {
  const fields = [
    { key: 'motherTongue', value: profile.personal?.motherTongue, label: 'Mother Tongue' },
    { key: 'familyBusiness', value: profile.family?.familyBusiness, label: 'Family Business' },
    { key: 'partnerAgeMin', value: profile.preferences?.partnerAgeMin, label: 'Partner Age Preference' },
    { key: 'partnerIncomeMinLakh', value: profile.preferences?.partnerIncomeMinLakh, label: 'Partner Income Preference' },
    { key: 'hobbies', value: profile.personal?.hobbies, label: 'Hobbies' },
    { key: 'caste', value: profile.personal?.caste, label: 'Caste' },
    { key: 'manglik', value: profile.personal?.manglik, label: 'Manglik Status' }
  ]

  let filled = 0
  const missing = []

  // Add some base completeness points (assuming core fields are filled)
  let score = 50 
  const fieldWeight = 50 / fields.length

  for (const field of fields) {
    if (field.value !== undefined && field.value !== null && field.value !== '') {
      filled++
      score += fieldWeight
    } else {
      missing.push(field.label)
    }
  }

  return {
    score: Math.round(score),
    missing
  }
}
