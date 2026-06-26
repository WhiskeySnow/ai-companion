'use client'

import { useState } from 'react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import { mockCharacters, mockMoments, type MomentPost } from '@/lib/mockData'

const avatarIdByName: Record<string, number> = {
  Luna: 1, Kai: 2, Aria: 3, Nox: 4,
}
const colorByName: Record<string, string> = {
  Luna: '#7C3AED', Kai: '#0EA5E9', Aria: '#EC4899', Nox: '#374151',
}

function ImageGrid({ count, color }: { count: number; color: string }) {
  if (count === 0) return null
  if (count === 1) {
    return (
      <div style={{
        width: 300, height: 200,
        background: `linear-gradient(135deg, ${color}33, ${color}18)`,
        borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, marginTop: 8,
      }}>
        🖼
      </div>
    )
  }
  if (count === 2) {
    return (
      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
        {[0,1].map(i => (
          <div key={i} style={{
            width: 150, height: 150,
            background: `linear-gradient(135deg, ${color}${i === 0 ? '44' : '28'}, ${color}18)`,
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>🖼</div>
        ))}
      </div>
    )
  }
  if (count === 3) {
    return (
      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 100, height: 100,
            background: `linear-gradient(135deg, ${color}40, ${color}18)`,
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🖼</div>
        ))}
      </div>
    )
  }
  // 4-9 grid
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 90px)', gap: 4, marginTop: 8,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: 90, height: 90,
          background: `linear-gradient(135deg, ${color}44, ${color}22)`,
          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>🖼</div>
      ))}
    </div>
  )
}

export default function MomentsPage() {
  const [moments, setMoments] = useState<MomentPost[]>(mockMoments)
  const [likes, setLikes] = useState<Record<string, string[]>>(
    Object.fromEntries(mockMoments.map(m => [m.id, [...m.likes]]))
  )
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})
  const [comments, setComments] = useState<Record<string, { author: string; text: string }[]>>(
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
      const hasMe = arr.includes('我')
      return { ...prev, [id]: hasMe ? arr.filter(x => x !== '我') : [...arr, '我'] }
    })
  }

  function submitComment(id: string) {
    const text = (commentInputs[id] || '').trim()
    if (!text) return
    setComments(prev => ({ ...prev, [id]: [...(prev[id] || []), { author: '我', text }] }))
    setCommentInputs(prev => ({ ...prev, [id]: '' }))
  }

  function submitPost() {
    if (!newPostText.trim()) return
    const newMoment: MomentPost = {
      id: Date.now().toString(),
      authorId: 'me',
      authorName: '我',
      content: newPostText.trim(),
      time: '刚刚',
      imageCount: 0,
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

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#F5F5F5' }}>
      <ToastContainer />

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Cover */}
        <div style={{
          position: 'relative', height: 220,
          background: 'linear-gradient(135deg, #7C3AED44 0%, #EC489944 50%, #0EA5E944 100%)',
          overflow: 'hidden',
        }}>
          {/* subtle pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%)',
          }} />
          {/* User avatar bottom-right */}
          <div style={{ position: 'absolute', bottom: -20, right: 20 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 12,
              background: '#555', border: '3px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              我
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: -20, left: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>我的朋友圈</span>
          </div>
        </div>

        {/* Action bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '36px 16px 12px',
        }}>
          <div style={{
            flex: 1, maxWidth: 260,
            background: '#E8E8E8', borderRadius: 20,
            display: 'flex', alignItems: 'center', padding: '7px 12px', gap: 6,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2" width="14" height="14">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="搜索动态" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#1A1A1A', flex: 1 }} />
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#07C160', color: '#fff',
              border: 'none', borderRadius: 20,
              padding: '8px 18px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            ✏ 发表动态
          </button>
        </div>

        {/* Feed */}
        <div style={{ padding: '0 0 60px' }}>
          {moments.map(moment => {
            const likeList = likes[moment.id] || []
            const commentList = comments[moment.id] || []
            const isOpen = openComments[moment.id]
            const likedByMe = likeList.includes('我')
            const avatarId = avatarIdByName[moment.authorName] || 0
            const color = colorByName[moment.authorName] || '#888'
            const isExpanded = expandedIds[moment.id]
            const isLong = moment.content.length > MAX_CONTENT_LEN

            return (
              <div key={moment.id} style={{
                background: '#FFFFFF',
                marginBottom: 8,
                padding: '16px 16px 0',
              }}>
                {/* Author row */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  {avatarId > 0 ? (
                    <CharacterAvatar avatarId={avatarId} size={44} />
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: 8,
                      background: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
                    }}>
                      {moment.authorName[0]}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#07C160' }}>{moment.authorName}</span>
                      <span style={{ fontSize: 11, color: '#AAAAAA' }}>{moment.time}</span>
                    </div>

                    {/* Content */}
                    <p style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.65, margin: 0, wordBreak: 'break-word' }}>
                      {isLong && !isExpanded ? moment.content.slice(0, MAX_CONTENT_LEN) + '...' : moment.content}
                      {isLong && !isExpanded && (
                        <span
                          onClick={() => setExpandedIds(prev => ({ ...prev, [moment.id]: true }))}
                          style={{ color: '#07C160', cursor: 'pointer', fontSize: 13, marginLeft: 4 }}
                        >
                          展开
                        </span>
                      )}
                    </p>

                    {/* Image grid */}
                    <ImageGrid count={moment.imageCount} color={color} />

                    {/* Actions */}
                    <div style={{
                      borderTop: '1px solid #F0F0F0', marginTop: 12, paddingTop: 8, paddingBottom: 12,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      {/* Likes display */}
                      {likeList.length > 0 ? (
                        <div style={{
                          background: '#F5F5F5', borderRadius: 12,
                          padding: '3px 10px', fontSize: 12,
                          display: 'flex', alignItems: 'center', gap: 4,
                          flex: 1, marginRight: 12,
                        }}>
                          <span>👍</span>
                          <span>
                            {likeList.map((name, i) => (
                              <span key={name}>
                                <span style={{ color: '#07C160' }}>{name}</span>
                                {i < likeList.length - 1 && <span style={{ color: '#888' }}>、</span>}
                              </span>
                            ))}
                          </span>
                        </div>
                      ) : <div style={{ flex: 1 }} />}

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          onClick={() => toggleLike(moment.id)}
                          style={{
                            border: 'none', background: 'none', cursor: 'pointer',
                            fontSize: 13, color: likedByMe ? '#07C160' : '#888',
                            display: 'flex', alignItems: 'center', gap: 3, padding: 0,
                          }}
                        >
                          👍 {likedByMe ? '已赞' : '赞'}
                        </button>
                        <button
                          onClick={() => setOpenComments(prev => ({ ...prev, [moment.id]: !prev[moment.id] }))}
                          style={{
                            border: 'none', background: 'none', cursor: 'pointer',
                            fontSize: 13, color: '#888',
                            display: 'flex', alignItems: 'center', gap: 3, padding: 0,
                          }}
                        >
                          💬 {commentList.length > 0 ? commentList.length : '评论'}
                        </button>
                      </div>
                    </div>

                    {/* Comments */}
                    {commentList.length > 0 && (
                      <div style={{ background: '#F8F8F8', borderRadius: 8, padding: '8px 10px', marginBottom: 8 }}>
                        {commentList.map((c, idx) => (
                          <div key={idx} style={{ fontSize: 13, color: '#1A1A1A', marginBottom: idx < commentList.length - 1 ? 5 : 0 }}>
                            <span style={{ color: '#07C160', fontWeight: 600 }}>{c.author}：</span>
                            {c.text}
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
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF', borderRadius: 14,
              padding: '20px 24px 24px', width: 440,
              boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 18, padding: 0 }}
              >
                ✕
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
              placeholder="想说点什么..."
              rows={4}
              style={{
                width: '100%', border: '1px solid #E5E5E5', borderRadius: 10,
                padding: '10px 12px', fontSize: 14, outline: 'none',
                resize: 'none', fontFamily: 'inherit', color: '#1A1A1A',
                background: '#FAFAFA',
                boxSizing: 'border-box',
              }}
            />

            {/* Bottom toolbar */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {[
                { icon: '📷', label: '添加图片', stub: '图片功能开发中' },
                { icon: '😊', label: '表情', stub: '表情功能开发中' },
                { icon: '📍', label: '位置', stub: '位置功能开发中' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => showToast(item.stub)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: '#F5F5F5', border: 'none', borderRadius: 20,
                    padding: '5px 12px', fontSize: 12, color: '#666',
                    cursor: 'pointer',
                  }}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: '#F5F5F5', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: '#666',
              }}>
                🌏 所有好友
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
