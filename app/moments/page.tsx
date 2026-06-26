'use client'

import { useState } from 'react'

const mockMoments = [
  {
    id: '1', author: 'Luna', color: '#7C3AED', initial: 'L',
    content: '今晚的月亮特别圆，让我想起了康德说的"星空在我之上，道德律在我心中"。你们觉得人类渺小还是伟大？',
    time: '刚刚', hasImages: false,
    likes: ['Kai', 'Aria'],
    comments: [{ author: 'Kai', text: '太深刻了哈哈' }, { author: 'Aria', text: '我觉得人类很伟大！' }],
  },
  {
    id: '2', author: 'Kai', color: '#0EA5E9', initial: 'K',
    content: '通关了！！！！！！熬了三个通宵😭',
    time: '2小时前', hasImages: true,
    likes: ['Luna'],
    comments: [],
  },
  {
    id: '3', author: 'Aria', color: '#EC4899', initial: 'A',
    content: '有时候觉得，倾听比说话更重要。今天陪伴了一个很难过的人，希望他好起来🌸',
    time: '昨天 20:30', hasImages: false,
    likes: ['Nox', 'Luna', 'Kai'],
    comments: [{ author: 'Nox', text: '温柔是一种力量' }],
  },
  {
    id: '4', author: 'Nox', color: '#6B7280', initial: 'N',
    content: '「我在黑暗中等待，光不是为我而来，但我依然感谢它路过」',
    time: '昨天 03:12', hasImages: false,
    likes: ['Aria'],
    comments: [{ author: 'Aria', text: '这首诗写得真好' }],
  },
  {
    id: '5', author: 'Luna', color: '#7C3AED', initial: 'L',
    content: '发现了一本好书：《存在与时间》。海德格尔对"此在"的分析让我重新思考了很多事情。',
    time: '2天前', hasImages: false,
    likes: ['Aria', 'Nox'],
    comments: [],
  },
  {
    id: '6', author: 'Kai', color: '#0EA5E9', initial: 'K',
    content: '有没有人想组队打排位？😤',
    time: '3天前', hasImages: false,
    likes: [],
    comments: [{ author: 'Luna', text: '我不玩游戏...' }, { author: 'Kai', text: '好吧T_T' }],
  },
]

const colorMap: Record<string, string> = {
  Luna: '#7C3AED',
  Kai: '#0EA5E9',
  Aria: '#EC4899',
  Nox: '#6B7280',
}

const initialMap: Record<string, string> = {
  Luna: 'L', Kai: 'K', Aria: 'A', Nox: 'N',
}

export default function MomentsPage() {
  const [likes, setLikes] = useState<Record<string, string[]>>(
    Object.fromEntries(mockMoments.map(m => [m.id, m.likes]))
  )
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})
  const [newComments, setNewComments] = useState<Record<string, Array<{ author: string; text: string }>>>(
    Object.fromEntries(mockMoments.map(m => [m.id, m.comments]))
  )
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [showModal, setShowModal] = useState(false)
  const [newPostText, setNewPostText] = useState('')

  function toggleLike(id: string) {
    setLikes(prev => {
      const arr = prev[id] || []
      const hasMe = arr.includes('我')
      return { ...prev, [id]: hasMe ? arr.filter(x => x !== '我') : [...arr, '我'] }
    })
  }

  function toggleComments(id: string) {
    setOpenComments(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function submitComment(id: string) {
    const text = (commentInputs[id] || '').trim()
    if (!text) return
    setNewComments(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), { author: '我', text }],
    }))
    setCommentInputs(prev => ({ ...prev, [id]: '' }))
  }

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#F5F5F5' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Cover header */}
        <div style={{ position: 'relative', height: 200, background: 'linear-gradient(135deg, #7C3AED44, #EC489944, #0EA5E944)', marginBottom: 12 }}>
          <div style={{ position: 'absolute', bottom: -24, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 10,
              background: '#555555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 22,
              border: '3px solid #FFFFFF',
            }}>
              我
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: -24, left: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>我的动态</span>
          </div>
        </div>

        {/* Top bar with post button */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '36px 16px 8px',
        }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#07C160',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + 发表动态
          </button>
        </div>

        {/* Feed */}
        <div style={{ padding: '0 0 40px' }}>
          {mockMoments.map(moment => {
            const likeList = likes[moment.id] || []
            const commentList = newComments[moment.id] || []
            const isOpen = openComments[moment.id]
            const likedByMe = likeList.includes('我')

            return (
              <div key={moment.id} style={{
                background: '#FFFFFF',
                marginBottom: 8,
                padding: '16px',
              }}>
                {/* Author row */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    background: moment.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    flexShrink: 0,
                  }}>
                    {moment.initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#07C160' }}>{moment.author}</span>
                      <span style={{ fontSize: 11, color: '#AAAAAA' }}>{moment.time}</span>
                    </div>
                    <p style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.6, margin: '6px 0 0', wordBreak: 'break-word' }}>
                      {moment.content}
                    </p>

                    {/* Image placeholders */}
                    {moment.hasImages && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 8 }}>
                        {[1, 2].map(i => (
                          <div key={i} style={{
                            height: 120,
                            background: `linear-gradient(135deg, ${moment.color}44, ${moment.color}22)`,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: moment.color,
                            fontSize: 24,
                          }}>
                            🎮
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Divider + actions */}
                    <div style={{ borderTop: '1px solid #F0F0F0', marginTop: 12, paddingTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                      {/* Likes */}
                      {likeList.length > 0 && (
                        <span style={{ fontSize: 12, color: '#07C160', flex: 1 }}>
                          👍 {likeList.join('、')}
                        </span>
                      )}
                      <button
                        onClick={() => toggleLike(moment.id)}
                        style={{
                          border: 'none', background: 'none', cursor: 'pointer',
                          fontSize: 12, color: likedByMe ? '#07C160' : '#888888',
                          display: 'flex', alignItems: 'center', gap: 3,
                        }}
                      >
                        👍 {likedByMe ? '已赞' : '赞'}
                      </button>
                      <button
                        onClick={() => toggleComments(moment.id)}
                        style={{
                          border: 'none', background: 'none', cursor: 'pointer',
                          fontSize: 12, color: '#888888',
                          display: 'flex', alignItems: 'center', gap: 3,
                        }}
                      >
                        💬 {commentList.length > 0 ? commentList.length : '评论'}
                      </button>
                    </div>

                    {/* Comments section */}
                    {commentList.length > 0 && (
                      <div style={{
                        background: '#F8F8F8',
                        borderRadius: 6,
                        padding: '8px 10px',
                        marginTop: 4,
                      }}>
                        {commentList.map((c, i) => (
                          <div key={i} style={{ fontSize: 13, color: '#1A1A1A', marginBottom: i < commentList.length - 1 ? 4 : 0 }}>
                            <span style={{ color: '#07C160', fontWeight: 600 }}>{c.author}：</span>
                            {c.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment input */}
                    {isOpen && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <input
                          value={commentInputs[moment.id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [moment.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') submitComment(moment.id) }}
                          placeholder="写评论..."
                          style={{
                            flex: 1,
                            border: '1px solid #E5E5E5',
                            borderRadius: 6,
                            padding: '6px 10px',
                            fontSize: 13,
                            outline: 'none',
                            background: '#FFFFFF',
                          }}
                        />
                        <button
                          onClick={() => submitComment(moment.id)}
                          style={{
                            background: '#07C160',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 14px',
                            fontSize: 13,
                            cursor: 'pointer',
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
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              padding: 24,
              width: 400,
              boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 14, color: '#1A1A1A' }}>发表动态</div>
            <textarea
              value={newPostText}
              onChange={e => setNewPostText(e.target.value)}
              placeholder="分享你的想法..."
              rows={5}
              style={{
                width: '100%',
                border: '1px solid #E5E5E5',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 14,
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                color: '#1A1A1A',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: '1px solid #E5E5E5', background: 'none',
                  borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer', color: '#888888',
                }}
              >
                取消
              </button>
              <button
                onClick={() => { setShowModal(false); setNewPostText('') }}
                style={{
                  background: '#07C160', color: '#FFFFFF',
                  border: 'none', borderRadius: 8, padding: '8px 20px',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
