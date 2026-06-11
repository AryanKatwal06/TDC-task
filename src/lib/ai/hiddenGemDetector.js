import { generateAIResponse } from './openrouter.js'
import { PROMPTS } from './prompts.js'

export async function detectHiddenGem(score, breakdown) {
  if (score >= 80) return { isGem: false, reason: 'Already a high score' }
  const prompt = `
Overall Score: ${score}
Breakdown: ${JSON.stringify(breakdown)}
`
  return await generateAIResponse(PROMPTS.DETECT_HIDDEN_GEM, prompt, true)
}
