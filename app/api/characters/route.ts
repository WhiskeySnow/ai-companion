import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/characters — list all characters
export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: {
            conversations: true,
            posts: true,
            memories: true,
          },
        },
      },
    })
    return NextResponse.json(characters)
  } catch (error) {
    console.error('GET /api/characters error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    )
  }
}

// POST /api/characters — create new character
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, bio, personality, backstory, aiProvider, aiModel, voiceId, avatar } = body

    if (!name || !bio || !personality || !backstory) {
      return NextResponse.json(
        { error: 'Missing required fields: name, bio, personality, backstory' },
        { status: 400 }
      )
    }

    const character = await prisma.character.create({
      data: {
        name,
        bio,
        personality,
        backstory,
        aiProvider: aiProvider || 'mock',
        aiModel: aiModel || null,
        voiceId: voiceId || null,
        avatar: avatar || null,
      },
    })

    // Create an initial memory and thought
    await Promise.all([
      prisma.memory.create({
        data: {
          characterId: character.id,
          type: 'fact',
          content: 'This is my first interaction with the user.',
          importance: 5,
        },
      }),
      prisma.characterThought.create({
        data: {
          characterId: character.id,
          content: 'A new connection. I wonder what kind of person they are.',
          sentiment: 'curious',
        },
      }),
    ])

    return NextResponse.json(character, { status: 201 })
  } catch (error) {
    console.error('POST /api/characters error:', error)
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    )
  }
}
