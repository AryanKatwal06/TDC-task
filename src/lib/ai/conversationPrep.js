import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function getConversationPrep(client) {
  const prompt = `
Client: ${client.personal.firstName}
Recent Status: ${client.statusTag}
Preferences: ${JSON.stringify(client.preferences)}
`
  const data = await generateAIResponse(PROMPTS.CONVERSATION_PREP, prompt, true)
  if (Array.isArray(data)) return data
  
  // Fallback if not an array
  if (typeof data === 'string') {
    return data.split('\n').map(l => l.replace(/^- /, '').trim()).filter(Boolean)
  }
  
  return ["Ask about their recent weekend.", "Check in on their matching progress."]
}
