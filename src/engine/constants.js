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
    age:          0.15,
    height:       0.08,
    income:       0.10,
    education:    0.10,
    religion:     0.15,
    values:       0.12,
    lifestyle:    0.08,
    relocation:   0.08,
    kids:         0.08,
    familyValues: 0.06,
  },
  FEMALE: {
    age:          0.10,
    height:       0.05,
    income:       0.16,
    education:    0.14,
    religion:     0.12,
    values:       0.14,
    lifestyle:    0.07,
    relocation:   0.10,
    kids:         0.08,
    familyValues: 0.04,
  },
}

// Tiers translate raw 0-100 scores into human-meaningful match categories.
export const TIERS = {
  EXCEPTIONAL: { min: 80, label: 'Exceptional Match', colorClass: 'jade'    },
  STRONG:      { min: 65, label: 'Strong Match',       colorClass: 'brand'   },
  GOOD:        { min: 50, label: 'Good Match',         colorClass: 'brand'   },
  FAIR:        { min: 35, label: 'Fair Match',         colorClass: 'amber'   },
  LOW:         { min: 0,  label: 'Low Compatibility',  colorClass: 'crimson' },
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
  age:          'Age Compatibility',
  height:       'Height Preference',
  income:       'Financial Alignment',
  education:    'Educational Background',
  religion:     'Religion & Culture',
  values:       'Lifestyle Values',
  lifestyle:    'Daily Lifestyle',
  relocation:   'Location Flexibility',
  kids:         'Family Planning',
  familyValues: 'Family Background',
}
