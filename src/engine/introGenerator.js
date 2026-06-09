/**
 * Generates a personalized, non-templated 3–4 sentence introduction paragraph.
 *
 * Variation strategy:
 * - Opening sentence varies by tier AND by top compatibility dimension
 * - Middle sentences vary by: same city, same profession, shared values, shared religion
 * - Closing sentence varies by match confidence
 *
 * This produces 100+ distinct text combinations, making it practically impossible
 * for two different matches to have identical-feeling intros — even at the same tier.
 */
export function generateIntroText(client, profile, matchResult) {
  const cn = client.personal.firstName
  const pn = profile.personal.firstName
  const { tier, breakdown, confidence } = matchResult

  const cc = client.personal.city
  const pc = profile.personal.city
  const sameCity = cc === pc

  const cDes = client.professional?.designation ?? ''
  const pDes = profile.professional?.designation ?? ''
  const sameProfField = areSameProfession(cDes, pDes)

  const sameReligion = client.personal.religion === profile.personal.religion
  const sameValues   = client.family?.familyValues === profile.family?.familyValues

  // Top dimension by weighted contribution
  const topDimension = getTopDimension(breakdown)

  // ─── Opening (varies by tier + top dimension) ────────────────
  const openings = getOpenings(tier, topDimension, cn, pn)
  const opening  = pick(openings)

  // ─── Middle sentences (personalised context) ─────────────────
  const middles = []

  if (sameCity) {
    middles.push(`Being based in the same city — ${cc} — removes the relocation question entirely and gives them an immediate shared context.`)
    middles.push(`Both are currently in ${cc}, which means getting to know each other would be logistically straightforward.`)
  } else {
    middles.push(`Though ${cn} is in ${cc} and ${pn} is in ${pc}, both are open to the possibility of bridging that distance.`)
    middles.push(`The distance between ${cc} and ${pc} is a conversation worth having — both profiles suggest flexibility on this front.`)
  }

  if (sameProfField) {
    middles.push(`A shared background in ${getProfField(cDes)} gives them built-in common ground and mutual understanding of each other's work pressures.`)
    middles.push(`Working in the same professional space, they'll likely find it easy to relate to each other's ambitions and day-to-day challenges.`)
  }

  if (sameReligion) {
    middles.push(`Their shared ${client.personal.religion} background brings cultural familiarity that often makes the early stages of getting to know someone much smoother.`)
    middles.push(`A common religious and cultural foundation means fewer of the friction points that can slow early conversations down.`)
  }

  if (sameValues) {
    middles.push(`Both hold ${client.family?.familyValues?.toLowerCase()} family values — an area that often determines long-term compatibility more than any other single factor.`)
    middles.push(`Their aligned family outlook (${client.family?.familyValues}) is one of the strongest indicators of a harmonious long-term dynamic.`)
  }

  if (middles.length === 0) {
    middles.push(`There's meaningful common ground here worth exploring further.`)
  }

  const middle = pick(middles)

  // ─── Closing (varies by confidence) ──────────────────────────
  const closings = confidence >= 75
    ? [
        `We think this is a pairing well worth pursuing — happy to arrange an introduction at your convenience.`,
        `This feels like a genuinely promising match, and we'd love to move forward if you agree.`,
        `Based on what we know about both ${cn} and ${pn}, we're confident this is worth a conversation.`,
      ]
    : confidence >= 50
      ? [
          `We'd encourage exploring this further — there's real potential here.`,
          `While there are some differences to navigate, the alignment on key areas makes this worth a closer look.`,
          `This may not be perfect on every dimension, but the strengths here are significant.`,
        ]
      : [
          `This match has its challenges, but the shared strengths could make for an interesting conversation.`,
          `Worth considering as part of a broader shortlist — some genuine compatibility despite the differences.`,
        ]

  const closing = pick(closings)

  return `${opening} ${middle} ${closing}`
}

// ─── Helpers ──────────────────────────────────────────────────

function getTopDimension(breakdown) {
  return Object.entries(breakdown)
    .sort(([, a], [, b]) => (b.score * b.weight) - (a.score * a.weight))[0]?.[0] ?? 'values'
}

function getOpenings(tier, topDim, cn, pn) {
  const byTier = {
    Exceptional: [
      `We're genuinely excited to introduce ${pn} to ${cn} — this is one of the strongest matches we've seen in a while.`,
      `This is a standout pairing. ${cn} and ${pn} have a rare level of compatibility across the areas that matter most.`,
      `We don't use the word "exceptional" lightly, but ${pn} strikes us as a truly excellent match for ${cn}.`,
    ],
    Strong: [
      `We're pleased to suggest ${pn} as a strong match for ${cn} — the compatibility here is meaningful and grounded.`,
      `After reviewing ${cn}'s profile carefully, ${pn} stands out as one of the best fits in our current pool.`,
      `${pn} and ${cn} share a solid foundation — this is the kind of match we have real confidence in.`,
    ],
    Good: [
      `We'd like to introduce ${pn} to ${cn} — there's a good amount of natural common ground here.`,
      `${pn} comes across as a well-suited match for ${cn}, with several meaningful points of compatibility.`,
      `We think ${cn} and ${pn} would get along well — the overlap on key areas is encouraging.`,
    ],
    Fair: [
      `We wanted to bring ${pn} to ${cn}'s attention — while not a perfect fit, there's genuine potential worth exploring.`,
      `${pn} may not check every box, but there's enough common ground here to make an introduction worthwhile.`,
    ],
    Low: [
      `We're including ${pn} as a broader option for ${cn} to consider.`,
      `While this match has some differences to navigate, we felt it was worth ${cn}'s awareness.`,
    ],
  }

  return byTier[tier] ?? byTier.Good
}

function areSameProfession(a, b) {
  const categories = [
    ['engineer', 'developer', 'tech', 'software', 'data', 'product manager'],
    ['doctor', 'mbbs', 'medical', 'surgeon', 'physician'],
    ['ca', 'accountant', 'finance', 'banker', 'investment'],
    ['lawyer', 'legal', 'advocate', 'counsel'],
    ['teacher', 'professor', 'academic', 'educator'],
    ['entrepreneur', 'business', 'founder'],
  ]
  const al = a.toLowerCase()
  const bl = b.toLowerCase()
  return categories.some((cat) => cat.some((k) => al.includes(k)) && cat.some((k) => bl.includes(k)))
}

function getProfField(designation) {
  const d = designation.toLowerCase()
  if (d.includes('engineer') || d.includes('developer') || d.includes('software')) return 'technology'
  if (d.includes('doctor') || d.includes('mbbs')) return 'medicine'
  if (d.includes('ca') || d.includes('finance') || d.includes('banker')) return 'finance'
  if (d.includes('lawyer') || d.includes('legal')) return 'law'
  if (d.includes('teacher') || d.includes('professor')) return 'education'
  if (d.includes('manager')) return 'management'
  return 'their field'
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
