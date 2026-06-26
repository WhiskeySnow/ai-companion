'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTime } from '@/lib/utils'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'

interface Post {
  id: string
  content: string
  imageUrl?: string | null
  likes: number
  createdAt: string | Date
  character: {
    id: string
    name: string
    avatar?: string | null
  }
  comments?: Array<{
    id: string
    content: string
    characterId?: string | null
    createdAt: string | Date
  }>
}

interface FeedPostProps {
  post: Post
}

export function FeedPost({ post }: FeedPostProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [saved, setSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  function handleLike() {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  function handleSave() {
    setSaved(!saved)
  }

  function handleComment(e: React.FormEvent) {
    e.preventDefault()
    // Future: POST to API
    setCommentText('')
  }

  return (
    <article className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Link href={`/characters/${post.character.id}`}>
          <Avatar name={post.character.name} size="md" online={true} />
        </Link>
        <div className="flex-1">
          <Link
            href={`/characters/${post.character.id}`}
            className="font-semibold text-white hover:text-accent-purple-light transition-colors"
          >
            {post.character.name}
          </Link>
          <div className="text-xs text-white/30">
            {formatRelativeTime(post.createdAt)}
          </div>
        </div>
        <Link
          href={`/chat/${post.character.id}`}
          className="text-xs px-3 py-1 rounded-full bg-accent-purple/15 hover:bg-accent-purple/25 text-accent-purple-light border border-accent-purple/20 transition-all"
        >
          Chat
        </Link>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full h-56 object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 pb-3 border-t border-white/5 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all hover:bg-white/5 ${
            liked ? 'text-pink-400' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Heart size={16} className={liked ? 'fill-current' : ''} />
          <span>{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
        >
          <MessageCircle size={16} />
          <span>{post.comments?.length || 0}</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
          <Share2 size={16} />
        </button>

        <div className="flex-1" />

        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all hover:bg-white/5 ${
            saved ? 'text-accent-purple-light' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Bookmark size={16} className={saved ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-white/5 px-4 py-3 space-y-3 animate-fade-in">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map(comment => (
              <div key={comment.id} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-xs">
                  {comment.characterId ? '🤖' : '👤'}
                </div>
                <div className="flex-1 bg-white/5 rounded-xl px-3 py-2">
                  <p className="text-white/70 text-xs">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/30 text-xs text-center">No comments yet. Be first!</p>
          )}

          {/* Comment input */}
          <form onSubmit={handleComment} className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex-shrink-0 flex items-center justify-center text-xs">
              👤
            </div>
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/6 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/30 border border-white/8 focus:outline-none focus:border-accent-purple/40"
            />
          </form>
        </div>
      )}
    </article>
  )
}
