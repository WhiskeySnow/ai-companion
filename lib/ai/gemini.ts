/**
 * Google Gemini Provider — Reserved for future implementation
 * Set GEMINI_API_KEY in .env.local to activate
 */

import { AICharacterContext, AIResponse, buildSystemPrompt } from './index'

export async function generateGeminiResponse(
  userMessage: string,
  character: AICharacterContext
): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const systemPrompt = buildSystemPrompt(character)

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.9,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Give me a moment...'

  return { content, provider: 'gemini' }
}
