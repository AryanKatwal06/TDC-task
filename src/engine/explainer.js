import { DIMENSION_LABELS } from './constants.js'

// The switch cases translate dimension keys into contextual human text,
// avoiding generic "Height is a match" labels.
export function generateStrengths(breakdown, client, profile) {
  // Sort dimensions by weighted contribution (score × weight)
  const ranked = Object.entries(breakdown)
    .map(([key, { score, weight }]) => ({ key, score, weight, contribution: score * weight }))
    .sort((a, b) => b.contribution - a.contribution)
    .filter(({ score }) => score >= 65)
    .slice(0, 4)

  const statements = ranked.map(({ key, score }) => {
    const cp = client.personal
    const pp = profile.personal
    const cf = client.family
    const pf = profile.family
    const cpref = client.preferences
    const ppref = profile.preferences

    switch (key) {
      case 'age': {
        const cAge = computeAge(cp.dob)
        const pAge = computeAge(pp.dob)
        const diff = Math.abs(cAge - pAge)
        if (diff <= 3) return `Age gap of just ${diff} year${diff !== 1 ? 's' : ''} creates natural life-stage alignment`
        return `${diff}-year age difference falls within an ideal range for long-term compatibility`
      }
      case 'height':
        return `Height compatibility is well matched for this pairing`
      case 'income': {
        const ci = client.professional?.annualIncomeLakh
        const pi = profile.professional?.annualIncomeLakh
        if (Math.abs(ci - pi) < 5) return `Similar income levels create strong financial common ground`
        if (client.personal.gender === 'Female' && pi > ci) return `${pp.firstName}'s stronger income profile provides financial stability`
        return `Professional earnings are well-aligned for this match`
      }
      case 'education': {
        if (score >= 90) return `Both come from similarly prestigious educational institutions`
        const cDeg = client.professional?.degree ?? ''
        const pDeg = profile.professional?.degree ?? ''
        if (cDeg && pDeg && cDeg.split(' ')[0] === pDeg.split(' ')[0]) return `Shared academic background in ${cDeg.split(' ')[0]} builds immediate intellectual common ground`
        return `Educational backgrounds are well-matched and complementary`
      }
      case 'religion':
        if (cp.religion === pp.religion) return `Shared ${cp.religion} faith provides deep cultural and spiritual alignment`
        return `Religious backgrounds are highly compatible, with few likely friction points`
      case 'values': {
        if (cf?.familyValues === pf?.familyValues) return `Both share ${cf?.familyValues?.toLowerCase()} family values — a strong foundation`
        if (cp.dietaryPref === pp.dietaryPref) return `Shared dietary preferences (${cp.dietaryPref}) remove a common lifestyle friction point`
        return `Lifestyle values are well-aligned, supporting a harmonious household`
      }
      case 'lifestyle':
        return `Compatible daily lifestyle habits — similar approach to health, socialising, and routine`
      case 'relocation': {
        if (cp.city === pp.city) return `Both based in ${cp.city} — no relocation complexity to navigate`
        if (cpref?.openToRelocate === 'Yes' && ppref?.openToRelocate === 'Yes') return `Both are open to relocation — geography is not a barrier`
        return `Location preferences are well-aligned`
      }
      case 'kids': {
        const ck = cpref?.wantKids
        const pk = ppref?.wantKids
        if (ck === 'Yes' && pk === 'Yes') return `Both are aligned on wanting to start a family`
        if (ck === 'No'  && pk === 'No')  return `Both share the preference not to have children — rare and valuable alignment`
        return `Aligned on family planning — a key area of long-term compatibility`
      }
      case 'familyValues': {
        if (cf?.familyType === pf?.familyType) return `Both from ${cf?.familyType?.toLowerCase()} family backgrounds — similar upbringing and expectations`
        return `Family backgrounds are complementary`
      }
      default:
        return `Strong ${DIMENSION_LABELS[key]?.toLowerCase() ?? key} alignment`
    }
  })

  return statements.filter(Boolean).slice(0, 4)
}

// Capped at 2 concerns because overwhelming matchmakers with concerns defeats the purpose of the tool.
// Concerns are framed constructively — not as deal-breakers, but as discussion points.
export function generateConcerns(breakdown, client, profile) {
  const poorDimensions = Object.entries(breakdown)
    .filter(([, { score }]) => score <= 35)
    .sort(([, a], [, b]) => a.score - b.score)
    .slice(0, 2)

  return poorDimensions.map(([key]) => {
    const cp = client.personal
    const pp = profile.personal
    const cpref = client.preferences
    const ppref = profile.preferences

    switch (key) {
      case 'religion':
        return `Different religious backgrounds (${cp.religion} / ${pp.religion}) may need early open conversation`
      case 'relocation': {
        const co = cpref?.openToRelocate
        const po = ppref?.openToRelocate
        if (co === 'No' && po === 'No') return `Neither party is open to relocation — geography could be limiting`
        return `Differing relocation preferences worth discussing early`
      }
      case 'kids': {
        const ck = cpref?.wantKids
        const pk = ppref?.wantKids
        if ((ck === 'Yes' && pk === 'No') || (ck === 'No' && pk === 'Yes')) return `Opposite views on having children — a significant compatibility discussion needed`
        return `Different expectations around family planning — worth an early conversation`
      }
      case 'income':
        return `Income gap may benefit from a candid discussion about financial expectations`
      case 'values': {
        const cveg = ['Vegetarian', 'Jain'].includes(cp.dietaryPref ?? '')
        const pveg = ['Vegetarian', 'Jain'].includes(pp.dietaryPref ?? '')
        if (cveg !== pveg) return `Dietary differences (${cp.dietaryPref} / ${pp.dietaryPref}) are worth acknowledging`
        return `Some lifestyle value differences to navigate`
      }
      case 'lifestyle':
        if (cp.smoking !== pp.smoking) return `Different views on smoking may be a lifestyle consideration`
        return `Some daily lifestyle differences to be aware of`
      case 'age':
        return `Age gap may need consideration depending on life stage priorities`
      default:
        return `${DIMENSION_LABELS[key] ?? key} may benefit from a direct conversation`
    }
  })
}

// Avoid mentioning numbers in headlines — matchmakers should trust the narrative, not fixate on the score.
export function generateHeadline(tier, breakdown) {
  const top2 = Object.entries(breakdown)
    .sort(([, a], [, b]) => (b.score * b.weight) - (a.score * a.weight))
    .slice(0, 2)
    .map(([key]) => DIMENSION_LABELS[key]?.toLowerCase() ?? key)

  const tierPhrases = {
    Elite:       ['Outstanding alignment on', 'Remarkable compatibility across', 'Exceptional match driven by'],
    Excellent:   ['Strong alignment on', 'Highly compatible on', 'Excellent match driven by'],
    Strong:      ['Solid alignment on', 'Well-matched on', 'Good compatibility across'],
    Moderate:    ['Some common ground on', 'Partial compatibility — especially in', 'Worth exploring, particularly for'],
    Weak:        ['Limited alignment, mainly in', 'Significant differences, with some shared', 'Challenging match — strongest area is'],
  }

  const phrases = tierPhrases[tier] ?? tierPhrases.Moderate
  const phrase  = phrases[Math.floor(Math.random() * phrases.length)]

  if (top2.length >= 2) return `${phrase} ${top2[0]} and ${top2[1]}`
  if (top2.length === 1) return `${phrase} ${top2[0]}`
  return `${phrase} core compatibility dimensions`
}

function computeAge(dob) {
  if (!dob) return 28 // fallback
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}
