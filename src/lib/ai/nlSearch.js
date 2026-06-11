import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function parseNLSearch(query) {
  const prompt = `Query: "${query}"`
  return await generateAIResponse(PROMPTS.NL_SEARCH, prompt, true)
}
