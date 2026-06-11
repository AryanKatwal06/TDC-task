import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function getCommandCenterSummary(clients) {
  const needsReview = clients.filter(c => c.statusTag === 'New').length
  const prompt = `
Total Clients: ${clients.length}
Needs Review: ${needsReview}
Active: ${clients.filter(c => c.statusTag === 'Active').length}
`
  return await generateAIResponse(PROMPTS.COMMAND_CENTER, prompt)
}
