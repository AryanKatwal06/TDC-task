import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function getNextBestAction(client, matches) {
  const highConfidenceMatches = matches.filter(m => m.confidence >= 75 && !m.alreadySent).length
  const prompt = `
Client: ${client.personal.firstName}
Status: ${client.statusTag}
Matches waiting to send: ${highConfidenceMatches}
Missing info: ${!client.professional?.annualIncomeLakh ? 'Income missing' : 'None'}
`
  return await generateAIResponse(PROMPTS.NEXT_ACTION, prompt)
}
