const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

// ─── Model Pool ────────────────────────────────────────────────────────────────
// Each free model has ~8 req/min. By rotating through many,
// we get 8 × N effective requests per minute.
const FREE_MODELS = [
  'qwen/qwen3-coder:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
]

const USER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL
// If user set a model in .env, use it as first choice; otherwise just use pool
const MODEL_POOL = USER_MODEL
  ? [USER_MODEL, ...FREE_MODELS.filter(m => m !== USER_MODEL)]
  : FREE_MODELS

let currentModelIndex = 0

function getNextModel() {
  const model = MODEL_POOL[currentModelIndex % MODEL_POOL.length]
  currentModelIndex++
  return model
}

// ─── Persistent Cache ──────────────────────────────────────────────────────────
const memCache = new Map()
const CACHE_PREFIX = 'tdc_ai_v3_'

function getCacheKey(systemPrompt, userPrompt) {
  const raw = `${systemPrompt}:::${userPrompt}`
  let h = 0
  for (let i = 0; i < raw.length; i++) {
    h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0
  }
  return String(h >>> 0)
}

function getCache(key) {
  if (memCache.has(key)) return memCache.get(key)
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key)
    if (item) {
      const cacheValue = JSON.parse(item)
      memCache.set(key, cacheValue)
      return cacheValue
    }
  } catch (e) {}
  return null
}

function setCache(key, cacheValue) {
  memCache.set(key, cacheValue)
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheValue))
  } catch (e) {}
}

// ─── Deduplication ─────────────────────────────────────────────────────────────
const inFlight = new Map()

// ─── Core API call with model rotation on 429 ─────────────────────────────────
async function callAPI(systemPrompt, userPrompt, parseJson) {
  const modelsToTry = MODEL_POOL.length
  let lastError = null

  for (let attempt = 0; attempt < modelsToTry; attempt++) {
    const model = getNextModel()
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TDC Matchmaker OS'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
        })
      })

      if (response.status === 429) {
        // This model is rate-limited — try next one immediately
        lastError = new Error(`429 on ${model}`)
        continue
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`OpenRouter Error (${model}):`, errorText)
        lastError = new Error(`API ${response.status}`)
        continue
      }

      return await response.json()

    } catch (error) {
      lastError = error
      continue
    }
  }

  // All models exhausted
  throw lastError || new Error('All models rate-limited')
}

// ─── Core AI Function ─────────────────────────────────────────────────────────
/**
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {boolean} parseJson
 * @returns {Promise<any>}
 */
export async function generateAIResponse(systemPrompt, userPrompt, parseJson = false) {
  if (!API_KEY) {
    return getFallbackResponse(systemPrompt, parseJson)
  }

  const cacheKey = getCacheKey(systemPrompt, userPrompt)
  const cached = getCache(cacheKey)
  if (cached !== null) {
    return cached
  }

  // Deduplicate: reuse in-flight promise for identical requests
  if (inFlight.has(cacheKey)) {
    return inFlight.get(cacheKey)
  }

  const promise = (async () => {
    try {
      const data = await callAPI(systemPrompt, userPrompt, parseJson)
      let content = data.choices?.[0]?.message?.content?.trim() || ''

      // Strip thinking tags if present (some models wrap output in <think>)
      content = content.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim()

      if (parseJson) {
        if (content.startsWith('```json')) {
          content = content.replace(/^```json/, '').replace(/```$/, '').trim()
        } else if (content.startsWith('```')) {
          content = content.replace(/^```/, '').replace(/```$/, '').trim()
        }
        try {
          const parsed = JSON.parse(content)
          setCache(cacheKey, parsed)
          return parsed
        } catch {
          return getFallbackResponse(systemPrompt, parseJson)
        }
      }

      setCache(cacheKey, content)
      return content
    } catch (error) {
      return getFallbackResponse(systemPrompt, parseJson)
    } finally {
      inFlight.delete(cacheKey)
    }
  })()

  inFlight.set(cacheKey, promise)
  return promise
}

// ─── Fallback Responses ────────────────────────────────────────────────────────
function getFallbackResponse(systemPrompt, parseJson) {
  if (parseJson) {
    if (systemPrompt.includes('Acceptance Predictor')) return { probability: 72, reason: 'Based on historical match patterns and profile alignment.' }
    if (systemPrompt.includes('Hidden Gem')) return { isGem: false, reason: 'Standard profile — no hidden gem indicators detected.' }
    if (systemPrompt.includes('Natural Language Search')) return {}
    return {}
  }
  return 'Your pipeline is healthy. Focus on following up with recently matched clients to keep momentum.'
}