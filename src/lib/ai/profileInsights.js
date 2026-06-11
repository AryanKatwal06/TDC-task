import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function getProfileInsights(profile) {
  const prompt = `
Profile Data:
- City: ${profile.personal?.city}
- Profession: ${profile.professional?.designation} at ${profile.professional?.company}
- Income: ${profile.professional?.annualIncomeLakh} LPA
- Values: ${profile.family?.familyValues}
- Relocation: ${profile.preferences?.openToRelocate}
- Want Kids: ${profile.preferences?.wantKids}
`
  const result = await generateAIResponse(PROMPTS.PROFILE_INSIGHTS, prompt)
  return result.split(',').map(s => s.trim()).filter(Boolean)
}
