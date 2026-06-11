import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function predictAcceptance(client, profile, score) {
  const prompt = `
Match Score: ${score}%
Customer preferences: ${JSON.stringify(client.preferences)}
Profile attributes: ${JSON.stringify(profile.personal)}
`
  return await generateAIResponse(PROMPTS.PREDICT_ACCEPTANCE, prompt, true)
}
