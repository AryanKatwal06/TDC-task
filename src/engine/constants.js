/**
 * All scoring weights, tier thresholds, and compatibility matrices.
 * Centralised here so tuning the engine means editing ONE file.
 */

// Income weight is deliberately higher for female clients.
// This reflects observed preference patterns on BharatMatrimony and Shaadi.com
// where female profiles rank partner income as a top-3 criteria significantly
// more often than male profiles do. The weights model real behavior.
export const WEIGHTS = {
  MALE: {
    kids:         0.20,
    relocation:   0.15,
    education:    0.15,
    lifestyle:    0.15,
    familyValues: 0.15,
    profession:   0.10,
    income:       0.10,
  },
  FEMALE: {
    kids:         0.20,
    relocation:   0.15,
    education:    0.15,
    lifestyle:    0.15,
    familyValues: 0.15,
    profession:   0.10,
    income:       0.10,
  },
}

// Tiers translate raw 0-100 scores into human-meaningful match categories.
export const TIERS = {
  ELITE:       { min: 95, label: 'Elite Match',        colorClass: 'jade'    },
  EXCELLENT:   { min: 85, label: 'Excellent Match',    colorClass: 'brand'   },
  STRONG:      { min: 75, label: 'Strong Match',       colorClass: 'brand'   },
  MODERATE:    { min: 60, label: 'Moderate Match',     colorClass: 'amber'   },
  WEAK:        { min: 0,  label: 'Weak Match',         colorClass: 'crimson' },
}

// This matrix reflects observed patterns on Indian matrimonial platforms, not a values judgment.
export const RELIGION_COMPAT = {
  'Hindu-Hindu':       100,
  'Muslim-Muslim':     100,
  'Christian-Christian':100,
  'Sikh-Sikh':         100,
  'Jain-Jain':         100,
  'Hindu-Jain':         75,
  'Jain-Hindu':         75,
  'Hindu-Sikh':         65,
  'Sikh-Hindu':         65,
  'Christian-Catholic': 85,
  'Catholic-Christian': 85,
  'Hindu-Christian':    40,
  'Christian-Hindu':    40,
  'Hindu-Muslim':       15,
  'Muslim-Hindu':       15,
  'Muslim-Christian':   20,
  'Christian-Muslim':   20,
  'Sikh-Muslim':        20,
  'Muslim-Sikh':        20,
}

// Based on standard Indian tech and MBA recruiting tier classifications.
export const EDUCATION_TIERS = {
  // Tier 1 — Elite institutions
  'IIT Bombay': 1, 'IIT Delhi': 1, 'IIT Madras': 1, 'IIT Kharagpur': 1,
  'IIT Kanpur': 1, 'IIT Roorkee': 1, 'AIIMS Delhi': 1, 'JIPMER': 1,
  'IIM Ahmedabad': 1, 'IIM Bangalore': 1, 'IIM Calcutta': 1,
  'ISB Hyderabad': 1, 'BITS Pilani': 1, 'NLU Delhi': 1,

  // Tier 2 — Top national institutions
  'NIT Trichy': 2, 'NIT Warangal': 2, 'NIT Surathkal': 2, 'BITS Hyderabad': 2,
  'VIT Vellore': 2, 'COEP Pune': 2, 'SRCC Delhi': 2, 'LSR Delhi': 2,
  'St. Xavier\'s College': 2, 'Loyola College': 2, 'Symbiosis Pune': 2,
  'Jadavpur University': 2, 'IIM Lucknow': 2, 'XLRI Jamshedpur': 2,
  'MDI Gurgaon': 2, 'IIT Hyderabad': 2, 'IIT Gandhinagar': 2,

  // Tier 3 — State-level good colleges (default)
  // Anything not in tier 1 or 2 is tier 3
}

export function getEducationTier(college) {
  if (!college) return 3
  if (EDUCATION_TIERS[college] === 1) return 1
  if (EDUCATION_TIERS[college] === 2) return 2
  return 3
}


export const INCOME_BANDS = [
  { id: 0, min: 0,   max: 4   },
  { id: 1, min: 4,   max: 8   },
  { id: 2, min: 8,   max: 15  },
  { id: 3, min: 15,  max: 30  },
  { id: 4, min: 30,  max: 60  },
  { id: 5, min: 60,  max: Infinity },
]

export function getIncomeBand(lakh) {
  if (!lakh || lakh <= 0) return 0
  for (let i = INCOME_BANDS.length - 1; i >= 0; i--) {
    if (lakh >= INCOME_BANDS[i].min) return INCOME_BANDS[i].id
  }
  return 0
}


export const DIMENSION_LABELS = {
  kids:         'Children Preference',
  relocation:   'Location Compatibility',
  education:    'Education Compatibility',
  lifestyle:    'Lifestyle Compatibility',
  familyValues: 'Family Compatibility',
  profession:   'Profession Compatibility',
  income:       'Income Compatibility',
}
