/**
 * OpenAI Provider — Reserved for future implementation
 * Set OPENAI_API_KEY in .env.local to activate
 */

import { AICharacterContext, AIResponse, buildSystemPrompt } from './index'

export async function generateOpenAIResponse(
  userMessage: string,
  character: AICharacterContext
): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const systemPrompt = buildSystemPrompt(character)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...(character.recentMessages || []),
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.9,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content || 'I need a moment...'

  return { content, provider: 'openai' }
}
