import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function explainMatch(client, profile, score, breakdown) {
  const prompt = `
Customer: ${client.personal.firstName} (${client.personal.age || ''} yrs, ${client.personal.city})
Matched Profile: ${profile.personal.firstName} (${profile.personal.age || ''} yrs, ${profile.personal.city})
Match Score: ${score}%

Breakdown:
${Object.entries(breakdown).map(([k, v]) => `- ${v.label}: ${v.score}/100`).join('\n')}

Generate a natural language explanation of why this match works, or what the main friction points might be.
`
  return await generateAIResponse(PROMPTS.EXPLAIN_MATCH, prompt)
}
