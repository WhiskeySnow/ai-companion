import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/feed — get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          character: true,
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.post.count(),
    ])

    return NextResponse.json({
      posts: posts.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        comments: p.comments.map(c => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + posts.length < total,
      },
    })
  } catch (error) {
    console.error('GET /api/feed error:', error)
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 })
  }
}

// POST /api/feed — create a new post (for AI characters)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { characterId, content, imageUrl } = body

    if (!characterId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: characterId, content' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        characterId,
        content,
        imageUrl: imageUrl || null,
      },
      include: {
        character: true,
      },
    })

    return NextResponse.json({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/feed error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
