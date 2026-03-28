const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// ── Core call ──────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userMessage, maxTokens = 1024) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'AI request failed')
  }

  const data = await response.json()
  return data.content[0].text
}

// ── Writing features ───────────────────────────────────────────────────────

export async function continueStory(text, genre = 'general') {
  return callClaude(
    `You are a creative writing assistant for Talescape, a platform for writers.
     Continue the story in the same tone, style, and voice as the provided text.
     Genre: ${genre}. Write 2-3 paragraphs max. Do not add any commentary.`,
    `Continue this story:\n\n${text}`
  )
}

export async function improveWriting(text) {
  return callClaude(
    `You are an expert editor on Talescape. Improve the writing for clarity,
     flow, and impact. Preserve the author's voice and intent. Return only
     the improved text with no commentary or explanation.`,
    `Improve this writing:\n\n${text}`
  )
}

export async function generatePoem(topic, style = 'free verse') {
  return callClaude(
    `You are a poet on Talescape. Write an evocative, original poem.
     Style: ${style}. Return only the poem, no title unless it adds meaning.`,
    `Write a poem about: ${topic}`
  )
}

export async function suggestTitle(text) {
  return callClaude(
    `You are a creative director on Talescape. Suggest 5 compelling titles
     for the given writing. Return only the titles as a numbered list.`,
    `Suggest titles for:\n\n${text}`,
    256
  )
}

export async function analyzeTone(text) {
  return callClaude(
    `You are a literary analyst on Talescape. Analyze the tone, mood, and
     style of the writing in 2-3 sentences. Be specific and insightful.`,
    `Analyze the tone of:\n\n${text}`,
    512
  )
}

export async function expandIdea(idea) {
  return callClaude(
    `You are a creative writing coach on Talescape. Take a brief idea and
     expand it into a rich story outline with characters, setting, and plot
     points. Keep it under 300 words.`,
    `Expand this idea into a story outline: ${idea}`
  )
}

export async function rephraseText(text, tone = 'neutral') {
  return callClaude(
    `You are a writing assistant on Talescape. Rephrase the given text in a
     ${tone} tone. Preserve meaning. Return only the rephrased version.`,
    `Rephrase this text:\n\n${text}`
  )
}
