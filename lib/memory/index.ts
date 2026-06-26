/**
 * Long-term Memory System — Reserved for future implementation
 * Handles extracting, storing, and retrieving memories about users
 */

export interface Memory {
  id: string
  characterId: string
  type: 'fact' | 'emotion' | 'event' | 'preference'
  content: string
  importance: number
  createdAt: Date
}

export interface MemoryContext {
  characterId: string
  userId?: string
}

/**
 * Extract memories from a conversation message
 * Future: Use NLP/AI to identify important facts to remember
 */
export async function extractMemories(
  message: string,
  context: MemoryContext
): Promise<Omit<Memory, 'id' | 'createdAt'>[]> {
  // TODO: Implement with AI provider
  // Ideas:
  // - Extract named entities (people, places, things user mentions)
  // - Detect emotional states
  // - Identify preferences ("I love X", "I hate Y")
  // - Track events ("I'm going to...", "I just...")
  // - Rate importance by uniqueness and emotional weight
  return []
}

/**
 * Retrieve relevant memories for a conversation
 * Future: Use vector embeddings for semantic search
 */
export async function retrieveRelevantMemories(
  query: string,
  context: MemoryContext,
  limit = 5
): Promise<Memory[]> {
  // TODO: Implement with vector embeddings
  // Ideas:
  // - Embed query and memories into vector space
  // - Find k-nearest memories by cosine similarity
  // - Weight by recency and importance
  return []
}

/**
 * Update memory importance based on recurrence
 * Frequently mentioned things become more important
 */
export async function reinforceMemory(memoryId: string): Promise<void> {
  // TODO: Implement
}

/**
 * Generate a memory summary for character context
 */
export function formatMemoriesForContext(memories: Memory[]): string {
  if (memories.length === 0) return 'No specific memories yet.'

  return memories
    .sort((a, b) => b.importance - a.importance)
    .map(m => `[${m.type.toUpperCase()}] ${m.content}`)
    .join('\n')
}
