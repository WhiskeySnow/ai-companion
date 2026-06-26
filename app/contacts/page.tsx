'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, MessageCircle, Phone, Video, Star, Tag,
  FileText, Users, Pin, BellOff, Trash2, ChevronRight,
  MapPin, Clock, Hash,
} from 'lucide-react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import { mockCharacters, mockMoments, characterNameMap, type MockCharacter } from '@/lib/mockData'

const characterColors: Record<string, string> = {
  '1': '#7C3AED',
  '2': '#0EA5E9',
  '3': '#EC4899',
  '4': '#374151',
}

const onlineDotColor: Record<string, string> = {
  online: '#07C160',
  recent: '#FFB347',
  offline: '#CCCCCC',
}

const onlineLabel: Record<string, string> = {
  online: '在线',
  recent: '最近在线',
  offline: '离线',
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 24, borderRadius: 12,
        background: value ? '#07C160' : '#D1D5DB',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        padding: '0 3px',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, background: '#fff', borderRadius: '50%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transform: value ? 'translateX(16px)' : 'translateX(0)',
        transition: 'transform 0.2s',
      }} />
    </div>
  )
}

export default function ContactsPage() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [remarks, setRemarks] = useState<Record<string, string>>(
    Object.fromEntries(mockCharacters.map(c => [c.id, c.remark]))
  )
  const [editingRemark, setEditingRemark] = useState<string | null>(null)
  const [remarkDraft, setRemarkDraft] = useState('')
  const [pinnedIds, setPinnedIds] = useState<string[]>(mockCharacters.filter(c => c.isPinned).map(c => c.id))
  const [mutedIds, setMutedIds] = useState<string[]>(mockCharacters.filter(c => c.isMuted).map(c => c.id))
  const [showRemarkPanel, setShowRemarkPanel] = useState(false)
  const { showToast, ToastContainer } = useToast()

  const groups = Array.from(new Set(mockCharacters.map(c => c.group)))
  const filteredChars = mockCharacters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (remarks[c.id] || '').includes(search) ||
    c.signature.includes(search)
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

  // Get 3 most recent moment images for this character
  function getRecentMomentThumbs(charId: string): string[] {
    return mockMoments
      .filter(m => m.authorId === charId && m.hasImages && m.imageColors.length > 0)
      .slice(0, 3)
      .map(m => m.imageColors[0])
  }

  const isPinned = selectedId ? pinnedIds.includes(selectedId) : false
  const isMuted = selectedId ? mutedIds.includes(selectedId) : false

  function togglePin(id: string) {
    setPinnedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  function toggleMute(id: string) {
    setMutedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const navActions = [
    { label: '设为特别关心', Icon: Star },
    { label: '设置备注与标签', Icon: Tag, action: () => setShowRemarkPanel(true) },
    { label: '查找聊天记录', Icon: Search },
    { label: '查看共同好友', Icon: Users },
  ]

  const bottomActions = [
    { label: '查看朋友圈', Icon: FileText },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
            <Search size={13} color="#AAAAAA" />
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
                      onClick={() => { setSelectedId(contact.id); setShowRemarkPanel(false) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        background: active ? '#E8E8E8' : 'transparent',
                        height: 56,
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#F0F0F0' }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                    >
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <CharacterAvatar avatarId={contact.avatarId} size={36} />
                        <div style={{
                          position: 'absolute', bottom: 0, right: 0,
                          width: 9, height: 9, borderRadius: '50%',
                          background: onlineDotColor[contact.onlineStatus] || '#CCC',
                          border: '1.5px solid #F5F5F5',
                        }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>
                          {remarks[contact.id] || contact.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {contact.signature}
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
              + 添加新伙伴
            </button>
          </div>
        </div>
      </div>

      {/* ─── Right panel ─── */}
      <div style={{ flex: 1, background: '#F0F0F0', overflowY: 'auto' }}>
        {!selectedContact ? (
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: '#AAAAAA', gap: 12,
          }}>
            <Users size={56} color="#CCCCCC" />
            <span style={{ fontSize: 14 }}>选择联系人查看详情</span>
          </div>
        ) : (
          <div style={{ maxWidth: 520, margin: '0 auto', paddingBottom: 60 }}>

            {/* ── Cover + avatar ── */}
            <div style={{
              background: '#FFFFFF',
              marginBottom: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              {/* Cover gradient */}
              <div style={{
                height: 120,
                background: `linear-gradient(135deg, ${charColor}CC, ${charColor}44)`,
                position: 'relative',
              }}>
                {/* Avatar in bottom-right */}
                <div style={{
                  position: 'absolute', bottom: -36, right: 20,
                  border: '3px solid #fff', borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}>
                  <CharacterAvatar avatarId={selectedContact.avatarId} size={72} />
                </div>
              </div>

              {/* Name + meta */}
              <div style={{ padding: '12px 20px 16px', paddingTop: 16 }}>
                <div style={{ marginBottom: 20 /* space for floating avatar */ }}>
                  <div style={{ paddingRight: 100 }}>
                    <div style={{ fontWeight: 700, fontSize: 20, color: '#1A1A1A', lineHeight: 1.2 }}>
                      {selectedContact.name}
                    </div>
                    {remarks[selectedContact.id] && (
                      <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
                        备注：{remarks[selectedContact.id]}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: '#AAAAAA', marginTop: 2 }}>
                      {selectedContact.accountId}
                    </div>
                  </div>
                </div>

                {/* Signature */}
                {selectedContact.signature && (
                  <div style={{ fontSize: 13, color: '#888', fontStyle: 'italic', marginBottom: 8 }}>
                    &ldquo;{selectedContact.signature}&rdquo;
                  </div>
                )}

                {/* Online status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: onlineDotColor[selectedContact.onlineStatus] || '#CCC',
                  }} />
                  <span style={{ fontSize: 12, color: '#888' }}>
                    {onlineLabel[selectedContact.onlineStatus]} · {selectedContact.lastSeen}
                  </span>
                </div>
              </div>

              {/* 朋友圈 row */}
              <div style={{
                borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0',
                padding: '10px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer',
              }}
                onClick={() => showToast('查看朋友圈功能开发中')}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <span style={{ fontSize: 14, color: '#1A1A1A' }}>朋友圈</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {/* 3 moment thumbnails */}
                  {getRecentMomentThumbs(selectedContact.id).map((color, i) => (
                    <div key={i} style={{
                      width: 48, height: 48, borderRadius: 4,
                      background: color,
                      flexShrink: 0,
                    }} />
                  ))}
                  <ChevronRight size={16} color="#CCCCCC" />
                </div>
              </div>

              {/* Info rows */}
              <div style={{ padding: '8px 0' }}>
                {[
                  { label: '地区', value: selectedContact.region },
                  { label: '来源', value: '通过星尘关系网认识' },
                  { label: '共同回忆', value: `认识${selectedContact.daysSinceMet}天，聊过${selectedContact.totalMessages}条消息` },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 20px', fontSize: 13,
                  }}>
                    <span style={{ color: '#888' }}>{row.label}</span>
                    <span style={{ color: '#1A1A1A' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
                <button
                  onClick={() => router.push('/messages')}
                  style={{
                    flex: 1, background: '#07C160', color: '#fff',
                    border: 'none', borderRadius: 10, padding: '10px',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  <MessageCircle size={16} /> 发消息
                </button>
                <button
                  onClick={() => showToast('语音功能开发中')}
                  style={{
                    flex: 1, background: '#F0F0F0', color: '#555',
                    border: 'none', borderRadius: 10, padding: '10px',
                    fontSize: 13, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  <Phone size={16} /> 音频通话
                </button>
                <button
                  onClick={() => showToast('视频功能开发中')}
                  style={{
                    flex: 1, background: '#F0F0F0', color: '#555',
                    border: 'none', borderRadius: 10, padding: '10px',
                    fontSize: 13, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  <Video size={16} /> 视频通话
                </button>
              </div>
            </div>

            {/* ── Nav actions ── */}
            <div style={{ background: '#FFFFFF', marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {navActions.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => item.action ? item.action() : showToast(`${item.label}功能开发中`)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 20px', background: 'none', border: 'none',
                    borderBottom: i < navActions.length - 1 ? '1px solid #F0F0F0' : 'none',
                    cursor: 'pointer', fontSize: 14, color: '#1A1A1A', textAlign: 'left',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F8F8' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={16} color="#CCCCCC" />
                </button>
              ))}
            </div>

            {/* 备注与标签 inline panel */}
            {showRemarkPanel && (
              <div style={{ background: '#FFFFFF', marginBottom: 8, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>备注与标签</div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>备注名</div>
                  {editingRemark === selectedContact.id ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        autoFocus
                        value={remarkDraft}
                        onChange={e => setRemarkDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveRemark(selectedContact.id) }}
                        style={{
                          flex: 1, border: '1px solid #E5E5E5', borderRadius: 6,
                          padding: '6px 10px', fontSize: 14, outline: 'none',
                        }}
                      />
                      <button onClick={() => saveRemark(selectedContact.id)}
                        style={{ background: '#07C160', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>
                        保存
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, color: remarks[selectedContact.id] ? '#1A1A1A' : '#CCCCCC' }}>
                        {remarks[selectedContact.id] || '添加备注'}
                      </span>
                      <button onClick={() => startEditRemark(selectedContact.id)}
                        style={{ background: '#F0F0F0', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', color: '#666' }}>
                        编辑
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>标签</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['朋友', '有趣', '夜猫子'].map(tag => (
                    <span key={tag} style={{
                      background: '#F0F0F0', borderRadius: 12, padding: '3px 12px',
                      fontSize: 12, color: '#555',
                    }}>
                      {tag}
                    </span>
                  ))}
                  <span style={{ background: 'none', border: '1px dashed #CCC', borderRadius: 12, padding: '3px 12px', fontSize: 12, color: '#BBB', cursor: 'pointer' }}
                    onClick={() => showToast('标签编辑功能开发中')}>
                    + 添加
                  </span>
                </div>
                <button onClick={() => setShowRemarkPanel(false)}
                  style={{ marginTop: 12, background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer' }}>
                  收起
                </button>
              </div>
            )}

            {/* ── Bottom toggles ── */}
            <div style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {/* 查看朋友圈 */}
              <button
                onClick={() => showToast('查看朋友圈功能开发中')}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px', background: 'none', border: 'none',
                  borderBottom: '1px solid #F0F0F0',
                  cursor: 'pointer', fontSize: 14, color: '#1A1A1A', textAlign: 'left',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F8F8' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
              >
                <span>查看朋友圈</span>
                <ChevronRight size={16} color="#CCCCCC" />
              </button>

              {/* 置顶聊天 */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderBottom: '1px solid #F0F0F0',
              }}>
                <span style={{ fontSize: 14, color: '#1A1A1A' }}>置顶聊天</span>
                <Toggle
                  value={isPinned}
                  onChange={() => togglePin(selectedContact.id)}
                />
              </div>

              {/* 消息免打扰 */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderBottom: '1px solid #F0F0F0',
              }}>
                <span style={{ fontSize: 14, color: '#1A1A1A' }}>消息免打扰</span>
                <Toggle
                  value={isMuted}
                  onChange={() => toggleMute(selectedContact.id)}
                />
              </div>

              {/* 清空聊天记录 */}
              <button
                onClick={() => showToast('清空聊天记录功能开发中')}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: 14, color: '#FF4444', textAlign: 'left',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
              >
                <span>清空聊天记录</span>
                <ChevronRight size={16} color="#FFAAAA" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
