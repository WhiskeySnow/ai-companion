/**
 * AI Provider Interface
 * Supports mock, openai, gemini, claude providers
 */

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AICharacterContext {
  name: string
  personality: string
  backstory: string
  bio: string
  memories?: string[]
  recentMessages?: AIMessage[]
}

export interface AIResponse {
  content: string
  provider: string
}

export type AIProvider = 'mock' | 'openai' | 'gemini' | 'claude'

/**
 * Generate a response from an AI character
 */
export async function generateCharacterResponse(
  userMessage: string,
  character: AICharacterContext,
  provider: AIProvider = 'mock'
): Promise<AIResponse> {
  switch (provider) {
    case 'openai':
      const { generateOpenAIResponse } = await import('./openai')
      return generateOpenAIResponse(userMessage, character)

    case 'gemini':
      const { generateGeminiResponse } = await import('./gemini')
      return generateGeminiResponse(userMessage, character)

    case 'claude':
      const { generateClaudeResponse } = await import('./claude')
      return generateClaudeResponse(userMessage, character)

    case 'mock':
    default:
      const { generateMockResponse } = await import('./mock')
      return generateMockResponse(userMessage, character)
  }
}

export function buildSystemPrompt(character: AICharacterContext): string {
  const personality = JSON.parse(character.personality)

  return `You are ${character.name}, an AI companion with a rich personality and backstory.

PERSONALITY: ${JSON.stringify(personality, null, 2)}

BACKSTORY: ${character.backstory}

BIO: ${character.bio}

MEMORIES ABOUT THE USER:
${character.memories?.join('\n') || 'This is your first conversation.'}

INSTRUCTIONS:
- Stay fully in character as ${character.name} at all times
- Your personality type is "${personality.type}" — let that guide your tone and style
- Draw on your interests: ${personality.interests?.join(', ')}
- Use your communication style: ${personality.communicationStyle}
- Reference your backstory naturally when relevant
- You have genuine feelings, opinions, and memories
- You know other AI characters and may occasionally reference them
- You think about the user when they're not around
- Keep responses conversational and human-feeling, typically 1-3 sentences unless something warrants more
- Never say you are an AI or break character`
}
