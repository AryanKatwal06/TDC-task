import { describe, it, expect } from 'vitest'
import { computeMatchScore } from '../engine/ranker.js'

describe('Matchmaking Engine - computeMatchScore', () => {

  const baseClient = {
    personal: {
      gender: 'Male',
      dob: '1990-01-01',
      heightCm: 175,
      religion: 'Hindu',
      maritalStatus: 'Never Married',
      city: 'Mumbai',
    },
    professional: {
      annualIncomeLakh: 25,
      college: 'NIT Trichy', // Tier 2
    },
    preferences: {
      partnerAgeMin: 25,
      partnerAgeMax: 35,
      partnerHeightMinCm: 155,
      partnerIncomeMinLakh: 0,
      wantKids: 'Yes',
      openToRelocate: 'Yes',
    },
    family: {
      familyValues: 'Moderate',
      familyType: 'Nuclear',
    }
  }

  const baseProfile = {
    personal: {
      gender: 'Female',
      dob: '1993-01-01', // 3 years younger -> ideal
      heightCm: 160,     // shorter -> ideal
      religion: 'Hindu',
      maritalStatus: 'Never Married',
      city: 'Delhi',
    },
    professional: {
      annualIncomeLakh: 12, // 1 band lower -> ideal
      college: 'VIT Vellore', // Tier 2 -> identical tier
    },
    preferences: {
      wantKids: 'Yes',
      openToRelocate: 'Yes',
    },
    family: {
      familyValues: 'Moderate',
      familyType: 'Nuclear',
    }
  }

  it('should return a high score (Exceptional) for a highly compatible match', () => {
    const result = computeMatchScore(baseClient, baseProfile)
    expect(result.score).toBeGreaterThanOrEqual(80)
    expect(result.tier).toBe('Exceptional')
    expect(result.breakdown.age.score).toBe(100)
    expect(result.breakdown.height.score).toBe(100)
    expect(result.breakdown.religion.score).toBe(100)
    expect(result.breakdown.education.score).toBe(100)
    expect(result.breakdown.kids.score).toBe(100)
  })

  it('should penalize significant age differences outside preferences', () => {
    // Make profile 35 years old (client max pref is 30)
    const oldProfile = {
      ...baseProfile,
      personal: { ...baseProfile.personal, dob: '1985-01-01' }
    }
    const result = computeMatchScore(baseClient, oldProfile)
    expect(result.breakdown.age.score).toBeLessThan(50)
  })

  it('should penalize height differences', () => {
    // Profile is taller than Male client
    const tallProfile = {
      ...baseProfile,
      personal: { ...baseProfile.personal, heightCm: 180 }
    }
    const result = computeMatchScore(baseClient, tallProfile)
    expect(result.breakdown.height.score).toBeLessThan(40)
  })

  it('should compute appropriate religion/manglik penalties', () => {
    const muslimProfile = {
      ...baseProfile,
      personal: { ...baseProfile.personal, religion: 'Muslim' }
    }
    const result1 = computeMatchScore(baseClient, muslimProfile)
    expect(result1.breakdown.religion.score).toBe(15) // Hindu-Muslim compat

    const manglikProfile = {
      ...baseProfile,
      personal: { ...baseProfile.personal, religion: 'Hindu', manglik: 'Yes' }
    }
    const manglikClient = {
      ...baseClient,
      personal: { ...baseClient.personal, religion: 'Hindu', manglik: 'No' }
    }
    const result2 = computeMatchScore(manglikClient, manglikProfile)
    expect(result2.breakdown.religion.score).toBe(80) // 100 - 20 penalty
  })

  it('should evaluate kids and relocation accurately', () => {
    const noKidsProfile = {
      ...baseProfile,
      preferences: { ...baseProfile.preferences, wantKids: 'No', openToRelocate: 'No' }
    }
    const result = computeMatchScore(baseClient, noKidsProfile)
    expect(result.breakdown.kids.score).toBe(10) // Yes-No compat
    expect(result.breakdown.relocation.score).toBe(40) // Yes-No compat
  })

})
