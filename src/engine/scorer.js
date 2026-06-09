import { RELIGION_COMPAT, getEducationTier, getIncomeBand } from './constants.js'

/**
 * AGE SCORING
 *
 * For MALE client matching FEMALE profile:
 *   Peak score (100) when profile is 2–5 years younger than client.
 *   Linear falloff outside that band. Penalty if profile is older than client.
 *   Cross-checks against client's stated partnerAgeMin/Max preferences.
 *
 * For FEMALE client matching MALE profile:
 *   Peak score (100) when profile is 3–8 years older than client.
 *   Linear falloff outside that band. Penalty if profile is younger.
 *   Cross-checks against client's stated partnerAgeMin/Max preferences.
 */
export function scoreAge(client, profile) {
  const clientAge  = computeAge(client.personal.dob)
  const profileAge = computeAge(profile.personal.dob)
  if (!clientAge || !profileAge) return 50

  const pMin = client.preferences?.partnerAgeMin
  const pMax = client.preferences?.partnerAgeMax

  // If profile falls outside stated preference range, apply hard penalty
  if (pMin && profileAge < pMin) return Math.max(0, 30 - (pMin - profileAge) * 5)
  if (pMax && profileAge > pMax) return Math.max(0, 30 - (profileAge - pMax) * 5)

  const diff = client.personal.gender === 'Male'
    ? clientAge - profileAge   // positive = profile is younger
    : profileAge - clientAge   // positive = profile is older

  if (client.personal.gender === 'Male') {
    // Ideal: profile 2–5 years younger
    if (diff >= 2 && diff <= 5)  return 100
    if (diff >= 0 && diff < 2)   return 80
    if (diff > 5 && diff <= 8)   return 70
    if (diff > 8 && diff <= 12)  return 45
    if (diff < 0 && diff >= -2)  return 40  // profile slightly older
    if (diff < -2)               return Math.max(0, 25 + diff * 3)
    return 30
  } else {
    // Ideal: profile 3–8 years older
    if (diff >= 3 && diff <= 8)  return 100
    if (diff >= 1 && diff < 3)   return 80
    if (diff > 8 && diff <= 12)  return 65
    if (diff > 12)               return Math.max(0, 40 - (diff - 12) * 5)
    if (diff === 0)              return 50  // same age
    if (diff < 0 && diff >= -2)  return 30  // profile slightly younger
    if (diff < -2)               return Math.max(0, 15 + diff * 2)
    return 20
  }
}

/**
 * HEIGHT SCORING
 *
 * For MALE client matching FEMALE profile:
 *   Profiles shorter than client are scored higher.
 *   Profiles taller than client get a significant penalty.
 *   Checks client's partnerHeightMinCm preference.
 *
 * For FEMALE client matching MALE profile:
 *   Profiles taller than client are scored higher.
 *   Checks client's partnerHeightMinCm preference.
 */
export function scoreHeight(client, profile) {
  const ch = client.personal.heightCm
  const ph = profile.personal.heightCm
  if (!ch || !ph) return 60 // insufficient data — neutral score

  const minPref = client.preferences?.partnerHeightMinCm

  if (client.personal.gender === 'Male') {
    // Profile (female) should be shorter than client
    if (minPref && ph < minPref) return Math.max(0, 20 - (minPref - ph) * 2)
    const diff = ch - ph  // positive = profile is shorter
    if (diff >= 10 && diff <= 25) return 100
    if (diff >= 5  && diff < 10)  return 85
    if (diff >= 0  && diff < 5)   return 70
    if (diff < 0   && diff >= -3) return 40  // very close in height
    if (diff < -3  && diff >= -8) return 20  // profile noticeably taller
    return Math.max(0, 10 + diff * 2)
  } else {
    // Profile (male) should be taller than client
    if (minPref && ph < minPref) return Math.max(0, 20 - (minPref - ph) * 2)
    const diff = ph - ch  // positive = profile is taller
    if (diff >= 8 && diff <= 20)  return 100
    if (diff >= 4 && diff < 8)    return 85
    if (diff >= 0 && diff < 4)    return 65
    if (diff < 0  && diff >= -4)  return 30  // profile slightly shorter
    return Math.max(0, 15 + diff * 3)
  }
}

/**
 * INCOME SCORING
 *
 * For MALE client matching FEMALE profile:
 *   Indian matrimonial context: male typically expected to earn more.
 *   Profile earning 1–2 income bands less = peak.
 *   Profile earning same band = good.
 *   Profile earning significantly more = moderate penalty.
 *
 * For FEMALE client matching MALE profile:
 *   Profile earning at least as much = high score.
 *   Profile earning significantly more = bonus.
 *   Profile earning less = penalty scaled by gap.
 *   Checks partnerIncomeMinLakh preference.
 */
export function scoreIncome(client, profile) {
  const ci = client.professional?.annualIncomeLakh   ?? 0
  const pi = profile.professional?.annualIncomeLakh  ?? 0
  const minPref = client.preferences?.partnerIncomeMinLakh ?? 0

  if (minPref > 0 && pi < minPref) {
    return Math.max(0, 25 - (minPref - pi) * 1.5)
  }

  const cb = getIncomeBand(ci)
  const pb = getIncomeBand(pi)
  const bandDiff = cb - pb  // positive = client earns more

  if (client.personal.gender === 'Male') {
    if (bandDiff === 1)  return 100  // profile earns one band less — ideal
    if (bandDiff === 2)  return 95
    if (bandDiff === 0)  return 80   // same band — strong
    if (bandDiff === 3)  return 70
    if (bandDiff === -1) return 50   // profile earns more — some tension
    if (bandDiff === -2) return 30
    if (bandDiff < -2)   return Math.max(0, 15 - Math.abs(bandDiff) * 5)
    return 55
  } else {
    if (bandDiff === -2) return 100  // profile earns significantly more — ideal
    if (bandDiff === -1) return 95
    if (bandDiff === 0)  return 80   // same band — good
    if (bandDiff === 1)  return 55   // profile earns slightly less
    if (bandDiff === 2)  return 30
    if (bandDiff > 2)    return Math.max(0, 15 - bandDiff * 5)
    return 70
  }
}

/**
 * EDUCATION SCORING
 *
 * Tier-based. Same tier = 100. One tier apart = 65. Two tiers apart = 25.
 * Bonus: same field of study (both engineering, both medicine, etc.)
 */
export function scoreEducation(client, profile) {
  const ct = getEducationTier(client.professional?.college)
  const pt = getEducationTier(profile.professional?.college)
  const tierDiff = Math.abs(ct - pt)

  let base
  if (tierDiff === 0) base = 100
  else if (tierDiff === 1) base = 65
  else base = 25

  // Bonus for same general field
  const cd = (client.professional?.degree ?? '').toLowerCase()
  const pd = (profile.professional?.degree ?? '').toLowerCase()
  const sameField =
    (cd.includes('tech') || cd.includes('engineering')) &&
    (pd.includes('tech') || pd.includes('engineering'))
    ||
    (cd.includes('mbbs') || cd.includes('medicine')) &&
    (pd.includes('mbbs') || pd.includes('medicine'))
    ||
    (cd.includes('mba') || cd.includes('management')) &&
    (pd.includes('mba') || pd.includes('management'))
    ||
    (cd.includes('ca') || cd.includes('commerce')) &&
    (pd.includes('ca') || pd.includes('commerce'))

  return Math.min(100, base + (sameField ? 12 : 0))
}

/**
 * RELIGION SCORING
 *
 * Uses the RELIGION_COMPAT matrix.
 * Also factors in Manglik compatibility:
 *   - Both manglik = no penalty
 *   - One manglik, one "Dont Know" = minor penalty (10)
 *   - One manglik, one definitely not = moderate penalty (20)
 *   - Neither manglik = no penalty
 */
export function scoreReligion(client, profile) {
  const cr = client.personal?.religion  ?? 'Unknown'
  const pr = profile.personal?.religion ?? 'Unknown'
  const key = `${cr}-${pr}`

  const religionScore = RELIGION_COMPAT[key] ?? (cr === pr ? 100 : 35)

  const cm = client.personal?.manglik  ?? 'Dont Know'
  const pm = profile.personal?.manglik ?? 'Dont Know'

  let manglikPenalty = 0
  if (cm === 'Yes' && pm === 'No')        manglikPenalty = 20
  if (cm === 'No'  && pm === 'Yes')       manglikPenalty = 20
  if (cm === 'Yes' && pm === 'Dont Know') manglikPenalty = 10
  if (cm === 'Dont Know' && pm === 'Yes') manglikPenalty = 10

  return Math.max(0, religionScore - manglikPenalty)
}

/**
 * VALUES SCORING
 *
 * Combines two sub-scores:
 * 1. Family values alignment (Traditional/Moderate/Liberal)
 * 2. Dietary compatibility
 *
 * Family values: same = 100, one apart = 60, two apart = 20
 * Dietary: same = 100, both veg variants = 80, mixed = 50, veg+nonveg = 25
 */
export function scoreValues(client, profile) {
  const VALUES_ORDER = ['Traditional', 'Moderate', 'Liberal']
  const cv = VALUES_ORDER.indexOf(client.family?.familyValues  ?? 'Moderate')
  const pv = VALUES_ORDER.indexOf(profile.family?.familyValues ?? 'Moderate')
  const valuesDiff = Math.abs(cv - pv)

  let familyScore
  if (valuesDiff === 0) familyScore = 100
  else if (valuesDiff === 1) familyScore = 60
  else familyScore = 20

  const cd = client.personal?.dietaryPref  ?? ''
  const pd = profile.personal?.dietaryPref ?? ''
  const VEG_TYPES = ['Vegetarian', 'Jain', 'Eggetarian', 'Vegan']
  const clientIsVeg  = VEG_TYPES.includes(cd)
  const profileIsVeg = VEG_TYPES.includes(pd)

  let dietScore
  if (cd === pd) dietScore = 100
  else if (clientIsVeg && profileIsVeg) dietScore = 80
  else if (!clientIsVeg && !profileIsVeg) dietScore = 70
  else dietScore = 25  // one veg, one non-veg — significant lifestyle difference

  return Math.round((familyScore * 0.55) + (dietScore * 0.45))
}

/**
 * LIFESTYLE SCORING
 *
 * Combines:
 * 1. Smoking compatibility
 * 2. Drinking compatibility
 * 3. Pet preference compatibility
 */
export function scoreLifestyle(client, profile) {
  function habitScore(a, b) {
    if (a === b) return 100
    if (a === 'Never' && b === 'Occasionally') return 50
    if (a === 'Occasionally' && b === 'Never') return 50
    if (a === 'Occasionally' && b === 'Occasionally') return 85
    if (a === 'Regularly' || b === 'Regularly') return 15
    return 40
  }

  function triScore(a, b) {
    if (a === b) return 100
    const aMaybe = a === 'Maybe'
    const bMaybe = b === 'Maybe'
    if (aMaybe || bMaybe) return 70
    return 25
  }

  const smokingScore  = habitScore(client.personal?.smoking  ?? 'Never', profile.personal?.smoking  ?? 'Never')
  const drinkingScore = habitScore(client.personal?.drinking ?? 'Never', profile.personal?.drinking ?? 'Never')
  const petsScore     = triScore(client.preferences?.openToPets ?? 'Maybe', profile.preferences?.openToPets ?? 'Maybe')

  return Math.round((smokingScore * 0.35) + (drinkingScore * 0.35) + (petsScore * 0.3))
}

/**
 * RELOCATION SCORING
 *
 * Checks whether both parties are open to relocation.
 * Bonuses for same city or same state.
 * NRI compatibility: NRI + open-to-relocate = fine; NRI + not open = poor.
 */
export function scoreRelocation(client, profile) {
  const co = client.preferences?.openToRelocate  ?? 'Maybe'
  const po = profile.preferences?.openToRelocate ?? 'Maybe'

  const compatMap = {
    'Yes-Yes':     100,
    'Yes-Maybe':    80,
    'Maybe-Yes':    80,
    'Maybe-Maybe':  70,
    'No-No':        85, // both grounded — compatible
    'Yes-No':       40,
    'No-Yes':       40,
    'No-Maybe':     55,
    'Maybe-No':     55,
  }
  let base = compatMap[`${co}-${po}`] ?? 60

  // Same city bonus
  if (client.personal?.city === profile.personal?.city) base = Math.min(100, base + 12)

  // NRI penalty if one is NRI and neither wants to relocate
  const clientNRI  = client.professional?.nriStatus
  const profileNRI = profile.professional?.nriStatus
  if (clientNRI && !profileNRI && co === 'No') base = Math.max(0, base - 25)
  if (!clientNRI && profileNRI && po === 'No') base = Math.max(0, base - 25)

  return base
}

/**
 * KIDS SCORING
 *
 * Cross-checks wantKids preferences.
 * Yes + Yes = 100. No + No = 100. Both Maybe = 80.
 * Incompatible: Yes + No = 10.
 */
export function scoreKids(client, profile) {
  const ck = client.preferences?.wantKids  ?? 'Maybe'
  const pk = profile.preferences?.wantKids ?? 'Maybe'

  const matrix = {
    'Yes-Yes':     100,
    'No-No':       100,
    'Maybe-Maybe':  80,
    'Yes-Maybe':    65,
    'Maybe-Yes':    65,
    'No-Maybe':     55,
    'Maybe-No':     55,
    'Yes-No':       10,
    'No-Yes':       10,
  }
  return matrix[`${ck}-${pk}`] ?? 50
}

/**
 * FAMILY VALUES SCORING
 *
 * Compares family type (Nuclear/Joint/Extended).
 * Adds a bonus for similar family income bracket.
 */
export function scoreFamilyValues(client, profile) {
  const FAMILY_TYPES = {
    'Nuclear':  0,
    'Joint':    1,
    'Extended': 2,
  }
  const cf = FAMILY_TYPES[client.family?.familyType  ?? 'Nuclear'] ?? 0
  const pf = FAMILY_TYPES[profile.family?.familyType ?? 'Nuclear'] ?? 0
  const diff = Math.abs(cf - pf)

  let base
  if (diff === 0)  base = 100
  else if (diff === 1) base = 65
  else base = 30

  // Family income bracket proximity
  const ci = getIncomeBand(client.family?.familyIncomeLakh  ?? 0)
  const pi = getIncomeBand(profile.family?.familyIncomeLakh ?? 0)
  const incomeDiff = Math.abs(ci - pi)
  const incomeBonus = incomeDiff === 0 ? 10 : incomeDiff === 1 ? 5 : 0

  return Math.min(100, base + incomeBonus)
}

// ─── Utility ──────────────────────────────────────────────────

function computeAge(dob) {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}
