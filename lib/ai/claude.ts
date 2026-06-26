/**
 * Anthropic Claude Provider — Reserved for future implementation
 * Set ANTHROPIC_API_KEY in .env.local to activate
 */

import { AICharacterContext, AIResponse, buildSystemPrompt } from './index'

export async function generateClaudeResponse(
  userMessage: string,
  character: AICharacterContext
): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const systemPrompt = buildSystemPrompt(character)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        ...(character.recentMessages || []),
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.content?.[0]?.text || 'One moment...'

  return { content, provider: 'claude' }
}
