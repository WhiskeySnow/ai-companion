import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCharacterResponse, AIProvider, AIMessage } from '@/lib/ai'
import { calculateTypingDelay } from '@/lib/utils'

type Params = { params: { characterId: string } }

// GET /api/chat/[characterId] — get or create conversation and return messages
export async function GET(request: NextRequest, { params }: Params) {
  const { characterId } = params

  try {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: { memories: { orderBy: { importance: 'desc' }, take: 10 } },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    // Get or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: { characterId, userId: 'user' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
        },
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { characterId, userId: 'user' },
        include: { messages: true },
      })
    }

    return NextResponse.json({
      character: {
        id: character.id,
        name: character.name,
        bio: character.bio,
        avatar: character.avatar,
        personality: character.personality,
        aiProvider: character.aiProvider,
      },
      messages: conversation.messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        characterId: m.characterId,
        createdAt: m.createdAt.toISOString(),
      })),
      conversationId: conversation.id,
    })
  } catch (error) {
    console.error('GET /api/chat error:', error)
    return NextResponse.json({ error: 'Failed to load conversation' }, { status: 500 })
  }
}

// POST /api/chat/[characterId] — send message, get AI response
export async function POST(request: NextRequest, { params }: Params) {
  const { characterId } = params

  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: {
        memories: {
          orderBy: { importance: 'desc' },
          take: 10,
        },
      },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    // Get or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: { characterId, userId: 'user' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20,
        },
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { characterId, userId: 'user' },
        include: { messages: true },
      })
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message.trim(),
      },
    })

    // Build AI context from recent messages
    const recentMessages: AIMessage[] = conversation.messages.slice(-10).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Generate AI response
    const aiResponse = await generateCharacterResponse(
      message.trim(),
      {
        name: character.name,
        personality: character.personality,
        backstory: character.backstory,
        bio: character.bio,
        memories: character.memories.map(m => m.content),
        recentMessages,
      },
      (character.aiProvider as AIProvider) || 'mock'
    )

    // Simulate typing delay based on response length
    const typingDelay = calculateTypingDelay(aiResponse.content)
    await new Promise(resolve => setTimeout(resolve, typingDelay))

    // Save AI response
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        characterId: character.id,
        role: 'assistant',
        content: aiResponse.content,
      },
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    })

    // Fetch all messages for this conversation
    const allMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({
      userMessage: {
        id: userMessage.id,
        role: 'user',
        content: userMessage.content,
        createdAt: userMessage.createdAt.toISOString(),
      },
      response: {
        id: assistantMessage.id,
        role: 'assistant',
        content: assistantMessage.content,
        characterId: assistantMessage.characterId,
        createdAt: assistantMessage.createdAt.toISOString(),
        provider: aiResponse.provider,
      },
      messages: allMessages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        characterId: m.characterId,
        createdAt: m.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('POST /api/chat error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
