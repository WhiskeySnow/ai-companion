'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import { mockCharacters, type Character } from '@/lib/mockData'

const RELATIONSHIP_OPTIONS = ['好友', '挚友', '恋人', '家人', '暗恋', '竞争对手', '陌生人']

const relationshipColors: Record<string, string> = {
  '挚友': '#EC4899',
  '好友': '#6B9EFF',
  '普通朋友': '#AAAAAA',
  '暧昧': '#FFB347',
  '恋人': '#FF6B6B',
  '家人': '#4ADE80',
  '暗恋': '#F472B6',
  '竞争对手': '#F87171',
  '陌生人': '#9CA3AF',
}

const characterColors: Record<string, string> = {
  '1': '#7C3AED',
  '2': '#0EA5E9',
  '3': '#EC4899',
  '4': '#374151',
}

const navRows = [
  { label: '查看动态', badge: '12篇' },
  { label: '查看记忆', badge: '8条记忆' },
  { label: '设置人设', badge: '' },
  { label: '设置语音', badge: '' },
]

export default function ContactsPage() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [remarks, setRemarks] = useState<Record<string, string>>(
    Object.fromEntries(mockCharacters.map(c => [c.id, c.remark]))
  )
  const [editingRemark, setEditingRemark] = useState<string | null>(null)
  const [remarkDraft, setRemarkDraft] = useState('')
  const [relationships, setRelationships] = useState<Record<string, string>>(
    Object.fromEntries(mockCharacters.map(c => [c.id, c.relationship]))
  )
  const [tags, setTags] = useState<Record<string, string[]>>(
    Object.fromEntries(mockCharacters.map(c => [c.id, [...c.traits]]))
  )
  const [newTag, setNewTag] = useState('')
  const [addingTag, setAddingTag] = useState<string | null>(null)
  const { showToast, ToastContainer } = useToast()

  const groups = ['特别关注', '好友', '神秘']
  const filteredChars = mockCharacters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (remarks[c.id] || '').includes(search) ||
    c.status.includes(search)
  )

  const selectedContact = selectedId ? mockCharacters.find(c => c.id === selectedId) : null
  const charColor = selectedId ? (characterColors[selectedId] || '#888') : '#888'

  function startEditRemark(charId: string) {
    setEditingRemark(charId)
    setRemarkDraft(remarks[charId] || '')
  }

  function saveRemark(charId: string) {
    setRemarks(prev => ({ ...prev, [charId]: remarkDraft }))
    setEditingRemark(null)
  }

  function removeTag(charId: string, tag: string) {
    setTags(prev => ({ ...prev, [charId]: prev[charId].filter(t => t !== tag) }))
  }

  function addTag(charId: string) {
    if (!newTag.trim()) return
    setTags(prev => ({ ...prev, [charId]: [...(prev[charId] || []), newTag.trim()] }))
    setNewTag('')
    setAddingTag(null)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }} onClick={() => setAddingTag(null)}>
      <ToastContainer />

      {/* ─── Left list ─── */}
      <div style={{
        width: 280, flexShrink: 0,
        background: '#F5F5F5',
        boxShadow: 'inset -1px 0 0 #E5E5E5',
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 12px 8px', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 10 }}>联系人</div>
          <div style={{
            background: '#E8E8E8', borderRadius: 6,
            display: 'flex', alignItems: 'center', padding: '6px 10px', gap: 6,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2" width="13" height="13">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索联系人"
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#1A1A1A', flex: 1 }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {groups.map(group => {
            const contacts = filteredChars.filter(c => c.group === group)
            if (contacts.length === 0) return null
            return (
              <div key={group}>
                {/* Group header */}
                <div style={{
                  background: '#EBEBEB', padding: '5px 12px',
                  fontSize: 12, color: '#888888', fontWeight: 500,
                  display: 'flex', justifyContent: 'space-between',
                  height: 40, alignItems: 'center',
                }}>
                  <span>{group}</span>
                  <span style={{ fontSize: 11, color: '#BBBBBB' }}>{contacts.length}</span>
                </div>
                {contacts.map(contact => {
                  const active = selectedId === contact.id
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedId(contact.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        background: active ? '#E8E8E8' : 'transparent',
                        height: 52,
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#F0F0F0' }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                    >
                      <CharacterAvatar avatarId={contact.avatarId} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{contact.name}</div>
                        <div style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {contact.status}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          <div style={{ padding: '12px', borderTop: '1px solid #EBEBEB', marginTop: 4 }}>
            <button
              onClick={() => showToast('添加伙伴功能开发中')}
              style={{
                width: '100%', background: 'none', border: '1px dashed #CCCCCC',
                borderRadius: 8, padding: '8px', fontSize: 12, color: '#AAAAAA',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              <span>+</span> 添加新伙伴
            </button>
          </div>
        </div>
      </div>

      {/* ─── Right panel ─── */}
      <div style={{ flex: 1, background: '#F5F5F5', overflowY: 'auto' }}>
        {!selectedContact ? (
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: '#AAAAAA', gap: 12,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5" width="56" height="56">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span style={{ fontSize: 14 }}>选择联系人查看详情</span>
          </div>
        ) : (
          <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 0 40px' }}>
            {/* Top card */}
            <div style={{ background: '#FFFFFF', marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {/* Cover gradient */}
              <div style={{
                height: 80,
                background: `linear-gradient(135deg, ${charColor}CC, ${charColor}44)`,
              }} />
              {/* Avatar + info centered */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px 20px', position: 'relative', marginTop: -28 }}>
                <div style={{ border: '3px solid #fff', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CharacterAvatar avatarId={selectedContact.avatarId} size={56} />
                </div>
                <div style={{ marginTop: 10, fontWeight: 700, fontSize: 18, color: '#1A1A1A' }}>
                  {selectedContact.name}
                </div>
                {remarks[selectedContact.id] && (
                  <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
                    ({remarks[selectedContact.id]})
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <span style={{
                    fontSize: 11, color: relationshipColors[relationships[selectedContact.id]] || '#888',
                    border: `1px solid ${relationshipColors[relationships[selectedContact.id]] || '#888'}`,
                    borderRadius: 10, padding: '1px 8px',
                  }}>
                    {relationships[selectedContact.id]}
                  </span>
                  <span style={{ fontSize: 12, color: '#888' }}>亲密度 {selectedContact.intimacy}/100</span>
                  {selectedContact.intimacyChange > 0 && (
                    <span style={{ fontSize: 11, color: '#07C160', background: '#E6F9F0', borderRadius: 8, padding: '1px 6px' }}>
                      +{selectedContact.intimacyChange}
                    </span>
                  )}
                </div>
                {/* Intimacy bar */}
                <div style={{ width: '100%', maxWidth: 280, marginTop: 8 }}>
                  <div style={{ height: 4, background: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${selectedContact.intimacy}%`,
                      background: `linear-gradient(90deg, ${charColor}99, ${charColor})`,
                      borderRadius: 2, transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px', justifyContent: 'center' }}>
                {[
                  { label: '💬 发消息', isGreen: true, action: () => router.push('/messages') },
                  { label: '🎙 语音', isGreen: false, action: () => showToast('语音功能开发中') },
                  { label: '📹 视频', isGreen: false, action: () => showToast('视频功能开发中') },
                  { label: '⋯ 更多', isGreen: false, action: () => showToast('更多功能开发中') },
                ].map(btn => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    style={{
                      flex: 1, borderRadius: 10, padding: '9px 4px',
                      background: btn.isGreen ? '#07C160' : '#F0F0F0',
                      color: btn.isGreen ? '#fff' : '#555',
                      border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Info section */}
            <div style={{
              background: '#FFFFFF', margin: '0 0 8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              borderRadius: 0,
            }}>
              {/* 备注 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 13, color: '#888', flexShrink: 0, width: 60 }}>备注</span>
                {editingRemark === selectedContact.id ? (
                  <div style={{ flex: 1, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <input
                      autoFocus
                      value={remarkDraft}
                      onChange={e => setRemarkDraft(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveRemark(selectedContact.id) }}
                      style={{ border: '1px solid #E5E5E5', borderRadius: 6, padding: '3px 8px', fontSize: 14, outline: 'none', background: '#FAFAFA' }}
                    />
                    <button onClick={() => saveRemark(selectedContact.id)} style={{ background: '#07C160', color: '#fff', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer' }}>保存</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, color: remarks[selectedContact.id] ? '#1A1A1A' : '#CCCCCC' }}>
                      {remarks[selectedContact.id] || '添加备注'}
                    </span>
                    <button onClick={() => startEditRemark(selectedContact.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#BBBBBB', padding: 2 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* 关系 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 13, color: '#888', flexShrink: 0, width: 60 }}>关系</span>
                <select
                  value={relationships[selectedContact.id]}
                  onChange={e => setRelationships(prev => ({ ...prev, [selectedContact.id]: e.target.value }))}
                  style={{ border: 'none', outline: 'none', fontSize: 14, color: '#1A1A1A', background: 'transparent', cursor: 'pointer', textAlign: 'right' }}
                >
                  {RELATIONSHIP_OPTIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* 亲密度 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 13, color: '#888', flexShrink: 0, width: 60 }}>亲密度</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 120, height: 4, background: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${selectedContact.intimacy}%`,
                      background: charColor, borderRadius: 2,
                    }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{selectedContact.intimacy}</span>
                  {selectedContact.intimacyChange > 0 && (
                    <span style={{ fontSize: 11, color: '#07C160', background: '#E6F9F0', borderRadius: 8, padding: '1px 6px' }}>
                      ↑{selectedContact.intimacyChange}
                    </span>
                  )}
                </div>
              </div>

              {/* 分组 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 13, color: '#888', flexShrink: 0, width: 60 }}>分组</span>
                <span style={{ fontSize: 14, color: '#1A1A1A' }}>{selectedContact.group}</span>
              </div>

              {/* 标签 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 13, color: '#888', flexShrink: 0, width: 60, paddingTop: 2 }}>标签</span>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end', flex: 1 }} onClick={e => e.stopPropagation()}>
                  {(tags[selectedContact.id] || []).map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: '#F0F0F0', borderRadius: 12, padding: '2px 10px',
                        fontSize: 12, color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      {tag}
                      <span onClick={() => removeTag(selectedContact.id, tag)} style={{ color: '#BBB', fontSize: 10, cursor: 'pointer' }}>✕</span>
                    </span>
                  ))}
                  {addingTag === selectedContact.id ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <input
                        autoFocus
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') addTag(selectedContact.id) }}
                        style={{ border: '1px solid #E5E5E5', borderRadius: 10, padding: '2px 8px', fontSize: 12, outline: 'none', width: 80 }}
                        placeholder="标签名"
                      />
                      <button onClick={() => addTag(selectedContact.id)} style={{ background: '#07C160', color: '#fff', border: 'none', borderRadius: 8, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>+</button>
                    </div>
                  ) : (
                    <span
                      onClick={() => setAddingTag(selectedContact.id)}
                      style={{ background: 'none', border: '1px dashed #CCC', borderRadius: 12, padding: '2px 10px', fontSize: 12, color: '#BBB', cursor: 'pointer' }}
                    >
                      + 添加
                    </span>
                  )}
                </div>
              </div>

              {/* 心情 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 13, color: '#888', flexShrink: 0, width: 60 }}>心情</span>
                <span style={{ fontSize: 14, color: '#1A1A1A' }}>{selectedContact.mood}</span>
              </div>

              {/* 人设 */}
              <div style={{ padding: '12px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, color: '#888', flexShrink: 0, width: 60 }}>人设</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.6, margin: 0, textAlign: 'right' }}>
                      {selectedContact.bio}
                    </p>
                    <button
                      onClick={() => showToast('查看全部功能开发中')}
                      style={{ background: 'none', border: 'none', color: '#07C160', fontSize: 12, cursor: 'pointer', padding: '4px 0 0', float: 'right' }}
                    >
                      查看全部
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation rows */}
            <div style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {navRows.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => showToast(`${item.label}功能开发中`)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 20px', background: 'none', border: 'none',
                    borderBottom: i < navRows.length - 1 ? '1px solid #F0F0F0' : 'none',
                    cursor: 'pointer', fontSize: 14, color: '#1A1A1A', textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F8F8' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
                >
                  <span>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.badge && (
                      <span style={{ fontSize: 12, color: '#888', background: '#F0F0F0', borderRadius: 10, padding: '1px 8px' }}>
                        {item.badge}
                      </span>
                    )}
                    <svg viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2" width="14" height="14">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
