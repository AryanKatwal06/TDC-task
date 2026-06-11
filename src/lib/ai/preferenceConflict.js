import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function analyzePreferenceConflict(client, availableCount) {
  const prompt = `
Client Preferences: ${JSON.stringify(client.preferences)}
Available Matches in Pool: ${availableCount}
`
  const data = await generateAIResponse(PROMPTS.PREFERENCE_CONFLICT, prompt, true)
  if (data && data.hasConflict) {
    return data.insight
  }
  return 'OK'
}
