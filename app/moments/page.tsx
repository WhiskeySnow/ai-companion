'use client'

import { useState } from 'react'
import { ThumbsUp, MessageSquare, PlusCircle, X, Image as ImageIcon } from 'lucide-react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import {
  mockMoments, characterNameMap, characterAvatarMap,
  type MockMoment,
} from '@/lib/mockData'

const characterColors: Record<string, string> = {
  '1': '#7C3AED',
  '2': '#0EA5E9',
  '3': '#EC4899',
  '4': '#374151',
}

function ImageGrid({ imageColors }: { imageColors: string[] }) {
  const count = imageColors.length
  if (count === 0) return null

  if (count === 1) {
    return (
      <div
        style={{
          width: 200, height: 150, borderRadius: 6, marginTop: 8,
          background: imageColors[0],
          flexShrink: 0,
        }}
      />
    )
  }
  if (count === 2) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginTop: 8, width: 244 }}>
        {imageColors.map((color, i) => (
          <div key={i} style={{ width: 120, height: 120, borderRadius: 4, background: color }} />
        ))}
      </div>
    )
  }
  if (count === 3) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginTop: 8, width: 306 }}>
        {imageColors.map((color, i) => (
          <div key={i} style={{ width: 100, height: 100, borderRadius: 4, background: color }} />
        ))}
      </div>
    )
  }
  // 4+
  const show = imageColors.slice(0, 9)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginTop: 8, width: 276 }}>
      {show.map((color, i) => (
        <div key={i} style={{ width: 90, height: 90, borderRadius: 4, background: color }} />
      ))}
    </div>
  )
}

export default function MomentsPage() {
  const [moments, setMoments] = useState<MockMoment[]>(mockMoments)
  const [likes, setLikes] = useState<Record<string, string[]>>(
    Object.fromEntries(mockMoments.map(m => [m.id, [...m.likes]]))
  )
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})
  const [comments, setComments] = useState<Record<string, { authorId: string; content: string }[]>>(
    Object.fromEntries(mockMoments.map(m => [m.id, [...m.comments]]))
  )
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [showModal, setShowModal] = useState(false)
  const [newPostText, setNewPostText] = useState('')
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const { showToast, ToastContainer } = useToast()

  function toggleLike(id: string) {
    setLikes(prev => {
      const arr = prev[id] || []
      const hasMe = arr.includes('user')
      return { ...prev, [id]: hasMe ? arr.filter(x => x !== 'user') : [...arr, 'user'] }
    })
  }

  function submitComment(id: string) {
    const text = (commentInputs[id] || '').trim()
    if (!text) return
    setComments(prev => ({ ...prev, [id]: [...(prev[id] || []), { authorId: 'user', content: text }] }))
    setCommentInputs(prev => ({ ...prev, [id]: '' }))
  }

  function submitPost() {
    if (!newPostText.trim()) return
    const newMoment: MockMoment = {
      id: Date.now().toString(),
      authorId: 'user',
      content: newPostText.trim(),
      hasImages: false,
      imageCount: 0,
      imageColors: [],
      time: '刚刚',
      likes: [],
      comments: [],
    }
    setMoments(prev => [newMoment, ...prev])
    setLikes(prev => ({ ...prev, [newMoment.id]: [] }))
    setComments(prev => ({ ...prev, [newMoment.id]: [] }))
    setNewPostText('')
    setShowModal(false)
  }

  const MAX_CONTENT_LEN = 120

  function getLikerNames(likerIds: string[]): string {
    return likerIds.map(id => characterNameMap[id] ?? id).join('、')
  }

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#F5F5F5' }}>
      <ToastContainer />

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Cover */}
        <div style={{
          position: 'relative', height: 200,
          background: 'linear-gradient(135deg, #B5D5C5 0%, #D4B8E0 100%)',
          overflow: 'visible',
        }}>
          {/* User avatar bottom-right */}
          <div style={{ position: 'absolute', bottom: -28, right: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 10,
              background: '#555', border: '3px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 18,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              我
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '36px 16px 16px',
        }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => showToast('相册功能开发中')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: 13 }}
            >
              相册
            </button>
            <span style={{ color: '#CCC' }}>|</span>
            <button
              onClick={() => showToast('拍摄功能开发中')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: 13 }}
            >
              拍摄
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => showToast('只看我功能开发中')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 13 }}
            >
              只看我
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: '#07C160', color: '#fff',
                border: 'none', borderRadius: 20,
                padding: '7px 16px', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <PlusCircle size={14} /> 发表
            </button>
          </div>
        </div>

        {/* Feed */}
        <div style={{ padding: '0 0 60px' }}>
          {moments.map(moment => {
            const likeList = likes[moment.id] || []
            const commentList = comments[moment.id] || []
            const isOpen = openComments[moment.id]
            const likedByMe = likeList.includes('user')
            const avatarId = characterAvatarMap[moment.authorId] ?? 0
            const isExpanded = expandedIds[moment.id]
            const isLong = moment.content.length > MAX_CONTENT_LEN
            const displayName = characterNameMap[moment.authorId] ?? moment.authorId
            const nameColor = characterColors[moment.authorId] ?? '#576B95'

            return (
              <div key={moment.id} style={{
                background: '#FFFFFF',
                marginBottom: 8,
                padding: '16px 16px 0',
              }}>
                {/* Author row */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  {avatarId > 0 ? (
                    <div style={{ flexShrink: 0 }}>
                      <CharacterAvatar avatarId={avatarId} size={44} />
                    </div>
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: 8,
                      background: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
                    }}>
                      {displayName[0]}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: nameColor }}>{displayName}</span>
                      <span style={{ fontSize: 11, color: '#AAAAAA' }}>{moment.time}</span>
                    </div>

                    {/* Content */}
                    <p style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.65, margin: 0, wordBreak: 'break-word' }}>
                      {isLong && !isExpanded ? moment.content.slice(0, MAX_CONTENT_LEN) + '...' : moment.content}
                      {isLong && !isExpanded && (
                        <span
                          onClick={() => setExpandedIds(prev => ({ ...prev, [moment.id]: true }))}
                          style={{ color: '#576B95', cursor: 'pointer', fontSize: 13, marginLeft: 4 }}
                        >
                          展开
                        </span>
                      )}
                    </p>

                    {/* Image grid — CSS gradient divs, no emoji */}
                    {moment.hasImages && moment.imageColors.length > 0 && (
                      <ImageGrid imageColors={moment.imageColors} />
                    )}

                    {/* Actions row */}
                    <div style={{
                      borderTop: '1px solid #F0F0F0', marginTop: 12, paddingTop: 8, paddingBottom: 12,
                      display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16,
                    }}>
                      <button
                        onClick={() => toggleLike(moment.id)}
                        style={{
                          border: 'none', background: 'none', cursor: 'pointer',
                          fontSize: 13, color: likedByMe ? '#07C160' : '#888',
                          display: 'flex', alignItems: 'center', gap: 4, padding: 0,
                        }}
                      >
                        <ThumbsUp size={14} fill={likedByMe ? '#07C160' : 'none'} />
                        <span>{likedByMe ? '已赞' : '赞'}</span>
                      </button>
                      <button
                        onClick={() => setOpenComments(prev => ({ ...prev, [moment.id]: !prev[moment.id] }))}
                        style={{
                          border: 'none', background: 'none', cursor: 'pointer',
                          fontSize: 13, color: '#888',
                          display: 'flex', alignItems: 'center', gap: 4, padding: 0,
                        }}
                      >
                        <MessageSquare size={14} />
                        <span>{commentList.length > 0 ? commentList.length : '评论'}</span>
                      </button>
                    </div>

                    {/* Like + comment zone */}
                    {(likeList.length > 0 || commentList.length > 0) && (
                      <div style={{
                        background: '#F5F5F5', borderRadius: 6,
                        padding: '8px 10px', marginBottom: 12,
                      }}>
                        {likeList.length > 0 && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            fontSize: 13, marginBottom: commentList.length > 0 ? 6 : 0,
                            borderBottom: commentList.length > 0 ? '1px solid #EAEAEA' : 'none',
                            paddingBottom: commentList.length > 0 ? 6 : 0,
                          }}>
                            <ThumbsUp size={14} color="#576B95" />
                            <span style={{ color: '#576B95' }}>{getLikerNames(likeList)}</span>
                          </div>
                        )}
                        {commentList.map((c, idx) => (
                          <div key={idx} style={{ fontSize: 13, color: '#1A1A1A', marginTop: idx === 0 ? 0 : 4 }}>
                            <span style={{ color: '#576B95', fontWeight: 600 }}>
                              {characterNameMap[c.authorId] ?? c.authorId}：
                            </span>
                            {c.content}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment input */}
                    {isOpen && (
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <input
                          autoFocus
                          value={commentInputs[moment.id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [moment.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') submitComment(moment.id) }}
                          placeholder="写评论..."
                          style={{
                            flex: 1, border: '1px solid #E5E5E5', borderRadius: 20,
                            padding: '6px 12px', fontSize: 13, outline: 'none', background: '#fff',
                          }}
                        />
                        <button
                          onClick={() => submitComment(moment.id)}
                          style={{
                            background: '#07C160', color: '#fff',
                            border: 'none', borderRadius: 20,
                            padding: '6px 14px', fontSize: 13, cursor: 'pointer', flexShrink: 0,
                          }}
                        >
                          发送
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* New post modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px 16px 0 0',
              padding: '16px 20px 32px',
              width: '100%', maxWidth: 640,
              boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
              >
                <X size={20} />
              </button>
              <span style={{ fontWeight: 600, fontSize: 15, color: '#1A1A1A' }}>发表动态</span>
              <button
                onClick={submitPost}
                disabled={!newPostText.trim()}
                style={{
                  background: newPostText.trim() ? '#07C160' : '#CCCCCC',
                  color: '#fff', border: 'none', borderRadius: 20,
                  padding: '5px 16px', fontSize: 13, fontWeight: 600,
                  cursor: newPostText.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                发表
              </button>
            </div>

            <textarea
              autoFocus
              value={newPostText}
              onChange={e => setNewPostText(e.target.value)}
              placeholder="你想说什么？"
              rows={4}
              style={{
                width: '100%', border: 'none', borderRadius: 8,
                padding: '10px 0', fontSize: 15, outline: 'none',
                resize: 'none', fontFamily: 'inherit', color: '#1A1A1A',
                background: 'transparent',
                boxSizing: 'border-box',
              }}
            />

            {/* Add image area */}
            <div
              onClick={() => showToast('图片功能开发中')}
              style={{
                border: '1.5px dashed #D1D5DB', borderRadius: 8,
                padding: '18px', marginBottom: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                color: '#AAAAAA',
              }}
            >
              <ImageIcon size={20} color="#CCCCCC" />
              <span style={{ fontSize: 13 }}>添加图片</span>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid #F0F0F0', paddingTop: 12,
              fontSize: 13, color: '#888',
            }}>
              <span>可见范围</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>所有好友</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
