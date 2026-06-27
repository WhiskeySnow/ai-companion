'use client'

import React, { useState } from 'react'
import { ThumbsUp, MessageSquare, PlusCircle, X, Image as ImageIcon, MoreHorizontal } from 'lucide-react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import {
  mockMoments, characterNameMap, characterAvatarMap,
  type MockMoment,
} from '@/lib/mockData'

const charColor: Record<string, string> = {
  '1': '#7C3AED', '2': '#0EA5E9', '3': '#EC4899', '4': '#4B5563',
}

function ImageGrid({ colors }: { colors: string[] }) {
  const n = colors.length
  if (n === 0) return null
  if (n === 1) return (
    <div style={{ marginTop: 8, borderRadius: 6, overflow: 'hidden', width: 220, height: 160, background: colors[0], flexShrink: 0 }} />
  )
  const cols  = n <= 2 ? 2 : 3
  const size  = n <= 2 ? 130 : n <= 6 ? 96 : 86
  const show  = colors.slice(0, 9)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: 3, marginTop: 8 }}>
      {show.map((c, i) => (
        <div key={i} style={{ width: size, height: size, borderRadius: 4, background: c, flexShrink: 0 }} />
      ))}
    </div>
  )
}

export default function MomentsPage() {
  const [moments, setMoments]     = useState<MockMoment[]>(mockMoments)
  const [likes, setLikes]         = useState<Record<string, string[]>>(
    Object.fromEntries(mockMoments.map(m => [m.id, [...m.likes]]))
  )
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})
  const [comments, setComments]   = useState<Record<string, { authorId: string; content: string }[]>>(
    Object.fromEntries(mockMoments.map(m => [m.id, [...m.comments]]))
  )
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [expandedIds,   setExpandedIds]   = useState<Record<string, boolean>>({})
  const [hoveredId,     setHoveredId]     = useState<string | null>(null)
  const [showModal,     setShowModal]     = useState(false)
  const [newPostText,   setNewPostText]   = useState('')
  const { showToast, ToastContainer } = useToast()

  function toggleLike(id: string) {
    setLikes(prev => {
      const arr = prev[id] || []
      return { ...prev, [id]: arr.includes('user') ? arr.filter(x => x !== 'user') : [...arr, 'user'] }
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
    const m: MockMoment = {
      id: Date.now().toString(), authorId: 'user',
      content: newPostText.trim(),
      hasImages: false, imageCount: 0, imageColors: [],
      time: '刚刚', likes: [], comments: [],
    }
    setMoments(prev => [m, ...prev])
    setLikes(prev    => ({ ...prev, [m.id]: [] }))
    setComments(prev => ({ ...prev, [m.id]: [] }))
    setNewPostText(''); setShowModal(false)
  }

  const MAX_LEN = 150

  function likerNames(ids: string[]) {
    return ids.map(id => characterNameMap[id] ?? id).join('、')
  }

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#F0F0F0' }}>
      <ToastContainer />
      <div style={{ maxWidth: 660, margin: '0 auto' }}>

        {/* ── Cover ── */}
        <div style={{ position: 'relative', height: 220, background: 'linear-gradient(135deg,#BDD5C8 0%,#C9B8DA 60%,#D4C5B0 100%)', overflow: 'visible', flexShrink: 0 }}>
          <div style={{ position: 'absolute', bottom: -32, right: 18 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 12,
              background: '#4A4A55', border: '3px solid #FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 20,
              boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            }}>
              我
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '42px 16px 14px',
          background: '#F0F0F0',
        }}>
          <div style={{ display: 'flex', gap: 14 }}>
            {['相册','拍摄'].map(label => (
              <button key={label} onClick={() => showToast(`${label}功能开发中`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555555', fontSize: 13 }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => showToast('只看我功能开发中')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888', fontSize: 13 }}>
              只看我
            </button>
            <button onClick={() => setShowModal(true)} style={{
              background: '#07C160', color: '#fff',
              border: 'none', borderRadius: 18,
              padding: '6px 16px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <PlusCircle size={14} /> 发表
            </button>
          </div>
        </div>

        {/* ── Feed ── */}
        <div style={{ paddingBottom: 60 }}>
          {moments.map(moment => {
            const likeList    = likes[moment.id]    || []
            const commentList = comments[moment.id] || []
            const isOpen      = openComments[moment.id]
            const likedByMe   = likeList.includes('user')
            const avatarId    = characterAvatarMap[moment.authorId] ?? 0
            const isExpanded  = expandedIds[moment.id]
            const isLong      = moment.content.length > MAX_LEN
            const displayName = characterNameMap[moment.authorId] ?? moment.authorId
            const nameCol     = charColor[moment.authorId] ?? '#576B95'
            const isHovered   = hoveredId === moment.id
            const hasInteractions = likeList.length > 0 || commentList.length > 0

            return (
              <div
                key={moment.id}
                style={{ background: '#FFFFFF', marginBottom: 1, padding: '16px 16px 0', position: 'relative' }}
                onMouseEnter={() => setHoveredId(moment.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* ⋯ button — only on hover */}
                {isHovered && (
                  <button
                    onClick={() => showToast('更多操作功能开发中')}
                    style={{
                      position: 'absolute', top: 14, right: 14,
                      border: 'none', background: 'none', cursor: 'pointer',
                      color: '#BBBBBB', padding: '2px 4px', borderRadius: 4,
                      display: 'flex', alignItems: 'center',
                      transition: 'color 0.1s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#888888' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#BBBBBB' }}
                  >
                    <MoreHorizontal size={17} />
                  </button>
                )}

                {/* Author + content row */}
                <div style={{ display: 'flex', gap: 12 }}>
                  {/* Avatar */}
                  <div style={{ flexShrink: 0 }}>
                    {avatarId > 0 ? (
                      <CharacterAvatar avatarId={avatarId} size={42} />
                    ) : (
                      <div style={{
                        width: 42, height: 42, borderRadius: 8,
                        background: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 15,
                      }}>
                        {displayName[0]}
                      </div>
                    )}
                  </div>

                  {/* Content column */}
                  <div style={{ flex: 1, minWidth: 0, paddingRight: isHovered ? 28 : 0 }}>
                    {/* Name + time */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: nameCol }}>{displayName}</span>
                      <span style={{ fontSize: 11, color: '#C0C0C0' }}>{moment.time}</span>
                    </div>

                    {/* Text */}
                    <p style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.7, margin: '0 0 0', wordBreak: 'break-word' }}>
                      {isLong && !isExpanded ? moment.content.slice(0, MAX_LEN) + '…' : moment.content}
                      {isLong && !isExpanded && (
                        <span
                          onClick={() => setExpandedIds(prev => ({ ...prev, [moment.id]: true }))}
                          style={{ color: '#576B95', cursor: 'pointer', fontSize: 13, marginLeft: 4 }}
                        >
                          全文
                        </span>
                      )}
                    </p>

                    {/* Image grid */}
                    {moment.hasImages && moment.imageColors.length > 0 && (
                      <ImageGrid colors={moment.imageColors} />
                    )}

                    {/* Like / comment action row */}
                    <div style={{
                      display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                      gap: 14, marginTop: 10, paddingBottom: 4,
                    }}>
                      <button
                        onClick={() => toggleLike(moment.id)}
                        style={{
                          border: 'none', background: 'none', cursor: 'pointer',
                          fontSize: 13, color: likedByMe ? '#07C160' : '#999999',
                          display: 'flex', alignItems: 'center', gap: 4, padding: 0,
                          transition: 'color 0.1s',
                        }}
                      >
                        <ThumbsUp size={14} fill={likedByMe ? '#07C160' : 'none'} strokeWidth={2} />
                        <span>{likedByMe ? '已赞' : '赞'}</span>
                      </button>
                      <button
                        onClick={() => setOpenComments(prev => ({ ...prev, [moment.id]: !prev[moment.id] }))}
                        style={{
                          border: 'none', background: 'none', cursor: 'pointer',
                          fontSize: 13, color: '#999999',
                          display: 'flex', alignItems: 'center', gap: 4, padding: 0,
                        }}
                      >
                        <MessageSquare size={14} strokeWidth={2} />
                        <span>{commentList.length > 0 ? commentList.length : '评论'}</span>
                      </button>
                    </div>

                    {/* Like + comment zone */}
                    {hasInteractions && (
                      <div style={{
                        background: '#F7F7F7', borderRadius: 6,
                        padding: '8px 10px', marginBottom: 12,
                        border: '1px solid #EFEFEF',
                      }}>
                        {likeList.length > 0 && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            fontSize: 13,
                            borderBottom: commentList.length > 0 ? '1px solid #EBEBEB' : 'none',
                            paddingBottom: commentList.length > 0 ? 6 : 0,
                            marginBottom: commentList.length > 0 ? 6 : 0,
                          }}>
                            <ThumbsUp size={13} color="#576B95" />
                            <span style={{ color: '#576B95' }}>{likerNames(likeList)}</span>
                          </div>
                        )}
                        {commentList.map((c, idx) => (
                          <div key={idx} style={{
                            fontSize: 13.5, color: '#1A1A1A',
                            marginTop: idx > 0 ? 4 : 0,
                            lineHeight: 1.55,
                          }}>
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
                      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                        <input
                          autoFocus
                          value={commentInputs[moment.id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [moment.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') submitComment(moment.id) }}
                          placeholder="写评论…"
                          style={{
                            flex: 1, border: '1px solid #E5E5E5', borderRadius: 20,
                            padding: '6px 13px', fontSize: 13, outline: 'none',
                            background: '#fff', transition: 'border-color 0.15s',
                          }}
                          onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = '#C8C8C8' }}
                          onBlur={e =>  { (e.currentTarget as HTMLInputElement).style.borderColor = '#E5E5E5' }}
                        />
                        <button
                          onClick={() => submitComment(moment.id)}
                          style={{
                            background: '#07C160', color: '#fff', border: 'none',
                            borderRadius: 20, padding: '6px 16px', fontSize: 13,
                            cursor: 'pointer', flexShrink: 0, fontWeight: 600,
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

      {/* ── New post modal ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF', borderRadius: '16px 16px 0 0',
              padding: '16px 20px 36px', width: '100%', maxWidth: 640,
              boxShadow: '0 -8px 40px rgba(0,0,0,0.14)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}>
                <X size={20} />
              </button>
              <span style={{ fontWeight: 600, fontSize: 15, color: '#1A1A1A' }}>发表动态</span>
              <button onClick={submitPost} disabled={!newPostText.trim()} style={{
                background: newPostText.trim() ? '#07C160' : '#CCCCCC',
                color: '#fff', border: 'none', borderRadius: 18,
                padding: '5px 18px', fontSize: 13, fontWeight: 600,
                cursor: newPostText.trim() ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
              }}>
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
                width: '100%', border: 'none', padding: '10px 0',
                fontSize: 15, outline: 'none', resize: 'none',
                fontFamily: 'inherit', color: '#1A1A1A', background: 'transparent',
                boxSizing: 'border-box', lineHeight: 1.7,
              }}
            />
            <div
              onClick={() => showToast('图片功能开发中')}
              style={{
                border: '1.5px dashed #D8D8D8', borderRadius: 10,
                padding: '18px', marginBottom: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                color: '#C0C0C0',
              }}
            >
              <ImageIcon size={20} color="#CCCCCC" />
              <span style={{ fontSize: 13 }}>添加图片</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid #F0F0F0', paddingTop: 12,
              fontSize: 13, color: '#888888',
            }}>
              <span>可见范围</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>所有好友</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
