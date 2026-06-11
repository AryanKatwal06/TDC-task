import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function generateIntro(client, profile) {
  const prompt = `
Customer: ${client.personal.firstName} (Looking for: ${client.preferences?.partnerAgeMin}-${client.preferences?.partnerAgeMax} yrs, ${client.preferences?.openToRelocate})
Match: ${profile.personal.firstName} (${profile.personal.city}, ${profile.professional?.designation}, ${profile.professional?.company})

Write the introduction paragraph to send to the customer. Keep it to 2-3 sentences.
`
  return await generateAIResponse(PROMPTS.GENERATE_INTRO, prompt)
}
