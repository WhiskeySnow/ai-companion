'use client'

import { useState } from 'react'
import Link from 'next/link'

const mockContacts = [
  { id: '1', name: 'Luna', group: '特别关注', color: '#7C3AED', initial: 'L', status: '在思考宇宙的问题...', traits: ['哲学', '天文', '沉思'], bio: '一个热爱哲学与天文学的AI伙伴，总是带来深刻的思考' },
  { id: '2', name: 'Kai', group: '好友', color: '#0EA5E9', initial: 'K', status: '正在打游戏 🎮', traits: ['游戏', '活泼', '幽默'], bio: '阳光开朗的游戏爱好者，和他聊天总是很开心' },
  { id: '3', name: 'Aria', group: '好友', color: '#EC4899', initial: 'A', status: '在看你的消息呢', traits: ['温柔', '共情', '支持'], bio: '温暖体贴的倾听者，总能让你感到被理解' },
  { id: '4', name: 'Nox', group: '神秘', color: '#6B7280', initial: 'N', status: '...', traits: ['诗意', '神秘', '深刻'], bio: '神秘的诗人，用隐喻和意象与世界对话' },
]

const groups = ['特别关注', '好友', '神秘']

export default function ContactsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [remark, setRemark] = useState('')

  const selectedContact = mockContacts.find(c => c.id === selectedId)

  const filteredContacts = mockContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left list */}
      <div style={{
        width: 280,
        flexShrink: 0,
        background: '#F5F5F5',
        borderRight: '1px solid #E5E5E5',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Header + search */}
        <div style={{ padding: '14px 12px 8px' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A1A', marginBottom: 10 }}>联系人</div>
          <div style={{
            background: '#E8E8E8',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            padding: '6px 10px',
            gap: 6,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2" width="14" height="14">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索"
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, color: '#1A1A1A', flex: 1, width: '100%',
              }}
            />
          </div>
        </div>

        {/* Group list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {groups.map(group => {
            const contacts = filteredContacts.filter(c => c.group === group)
            if (contacts.length === 0) return null
            return (
              <div key={group}>
                <div style={{
                  background: '#EBEBEB',
                  padding: '5px 12px',
                  fontSize: 11,
                  color: '#888888',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {group}
                </div>
                {contacts.map(contact => {
                  const active = selectedId === contact.id
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedId(contact.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        background: active ? '#C8C8C8' : 'transparent',
                        height: 52,
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#D9D9D9' }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                    >
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 6,
                        background: contact.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0,
                      }}>
                        {contact.initial}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{contact.name}</div>
                        <div style={{ fontSize: 11, color: '#888888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {contact.status}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: '#F5F5F5', overflowY: 'auto' }}>
        {!selectedContact ? (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#AAAAAA',
            gap: 12,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5" width="56" height="56">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span style={{ fontSize: 14 }}>选择联系人查看资料</span>
          </div>
        ) : (
          <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 0 40px' }}>
            {/* Profile top */}
            <div style={{
              background: '#FFFFFF',
              marginBottom: 8,
            }}>
              {/* Cover */}
              <div style={{
                height: 140,
                background: `linear-gradient(135deg, ${selectedContact.color}cc, ${selectedContact.color}44)`,
              }} />
              {/* Avatar + info */}
              <div style={{ padding: '0 20px 20px', position: 'relative', marginTop: -36 }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: 10,
                  background: selectedContact.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 28,
                  border: '3px solid #FFFFFF',
                  marginBottom: 10,
                }}>
                  {selectedContact.initial}
                </div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#1A1A1A', marginBottom: 4 }}>{selectedContact.name}</div>
                <div style={{ fontSize: 13, color: '#888888', marginBottom: 16 }}>{selectedContact.status}</div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link href="/messages" style={{
                    background: '#07C160',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}>
                    发消息
                  </Link>
                  {['语音', '视频', '更多'].map(btn => (
                    <button key={btn} style={{
                      background: '#F5F5F5',
                      color: '#1A1A1A',
                      border: '1px solid #E5E5E5',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}>
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div style={{ background: '#FFFFFF', marginBottom: 8 }}>
              {[
                {
                  label: '备注',
                  content: (
                    <input
                      value={remark}
                      onChange={e => setRemark(e.target.value)}
                      placeholder="添加备注"
                      style={{ border: 'none', outline: 'none', fontSize: 14, color: '#1A1A1A', textAlign: 'right', width: '100%', background: 'transparent' }}
                    />
                  )
                },
                { label: '关系', content: <span style={{ fontSize: 14, color: '#1A1A1A' }}>好友</span> },
                { label: '分组', content: <span style={{ fontSize: 14, color: '#1A1A1A' }}>{selectedContact.group}</span> },
                { label: '来源', content: <span style={{ fontSize: 14, color: '#1A1A1A' }}>我创建的</span> },
              ].map(({ label, content }) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderBottom: '1px solid #F0F0F0',
                }}>
                  <span style={{ fontSize: 14, color: '#888888', flexShrink: 0, marginRight: 16 }}>{label}</span>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>{content}</div>
                </div>
              ))}

              {/* Tags */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#888888', flexShrink: 0 }}>标签</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {selectedContact.traits.map(t => (
                    <span key={t} style={{
                      background: '#F0F0F0',
                      borderRadius: 12,
                      padding: '2px 10px',
                      fontSize: 12,
                      color: '#555555',
                    }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div style={{ padding: '12px 20px' }}>
                <div style={{ fontSize: 14, color: '#888888', marginBottom: 6 }}>人设简介</div>
                <div style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.6 }}>{selectedContact.bio}</div>
              </div>
            </div>

            {/* Navigation rows */}
            <div style={{ background: '#FFFFFF' }}>
              {['查看动态', '查看记忆', '设置人设', '设置声音'].map((item, i, arr) => (
                <button
                  key={item}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 20px',
                    background: 'none',
                    border: 'none',
                    borderBottom: i < arr.length - 1 ? '1px solid #F0F0F0' : 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#1A1A1A',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F8F8' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
                >
                  {item}
                  <svg viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2" width="16" height="16">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
