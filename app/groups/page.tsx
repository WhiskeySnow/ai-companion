'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Search, Plus, X, Users, Mic, Smile, Image, Send,
  MoreHorizontal, BellOff, Play,
} from 'lucide-react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import {
  mockGroups, mockGroupMessages, mockGroupReplies,
  mockCharacters, characterAvatarMap,
  type MockGroup, type MockGroupMessage,
} from '@/lib/mockData'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatNow() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const EMOJI_LIST = [
  '😊','😂','🥰','😍','🤔','😅','😭','😤',
  '👍','👎','❤️','🔥','✨','🎉','💯','🙏',
  '😴','🥺','😏','🤩','😬','🙄','😇','🤗',
]

// ─── sub-components ─────────────────────────────────────────────────────────

function GroupAvatar({ color, name, size = 48 }: { color: string; name: string; size?: number }) {
  const char = name.charAt(0)
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.38,
    }}>
      {char}
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 24, borderRadius: 12,
        background: value ? '#07C160' : '#D1D5DB',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        padding: '0 3px', transition: 'background 0.2s', flexShrink: 0,
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

function VoiceMessageBar({ duration }: { duration: number }) {
  const bars = Array.from({ length: 8 }, (_, i) => 6 + ((i * 7 + 3) % 14))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
      <button style={{
        width: 24, height: 24, borderRadius: '50%', background: '#07C160',
        border: 'none', cursor: 'pointer', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Play size={8} fill="#fff" />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ width: 3, height: h, background: '#888', borderRadius: 2, opacity: 0.7 }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: '#888', flexShrink: 0 }}>{duration}&apos;&apos;</span>
    </div>
  )
}

// ─── typing indicator used in message list ──────────────────────────────────

interface TypingEntry { charId: string; senderName: string; avatarId: number }

function GroupTypingIndicator({ entry }: { entry: TypingEntry }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 2 }}>
      <CharacterAvatar avatarId={entry.avatarId} size={32} />
      <div>
        <div style={{ fontSize: 11, color: '#AAAAAA', marginBottom: 2 }}>{entry.senderName}</div>
        <div style={{
          background: '#FFFFFF', borderRadius: '4px 16px 16px 16px',
          padding: '8px 12px', display: 'flex', gap: 4, alignItems: 'center',
          boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="typing-dot" style={{
              width: 6, height: 6, borderRadius: '50%', background: '#AAAAAA',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── right panel ────────────────────────────────────────────────────────────

interface GroupSettingsPanelProps {
  group: MockGroup
  onClose: () => void
  muted: boolean
  pinned: boolean
  onToggleMuted: () => void
  onTogglePinned: () => void
  onClearChat: () => void
  showToast: (msg: string) => void
}

function GroupSettingsPanel({ group, onClose, muted, pinned, onToggleMuted, onTogglePinned, onClearChat, showToast }: GroupSettingsPanelProps) {
  const chars = mockCharacters.filter(c => group.memberIds.includes(c.id))
  const memberCount = group.memberIds.length

  return (
    <div style={{
      width: 300, flexShrink: 0, background: '#FFFFFF',
      borderLeft: '1px solid #E5E5E5',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', borderBottom: '1px solid #F3F4F6', flexShrink: 0,
      }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>群设置</span>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Group avatar + name */}
        <div style={{ padding: '20px 16px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <GroupAvatar color={group.avatarColor} name={group.name} size={64} />
          <div style={{ fontWeight: 600, fontSize: 16, color: '#1A1A1A' }}>{group.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>成员 {memberCount}人</div>
        </div>

        {/* Members grid */}
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>群成员</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
          }}>
            {chars.map(char => (
              <div key={char.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <CharacterAvatar avatarId={characterAvatarMap[char.id] ?? 1} size={48} />
                <span style={{ fontSize: 10, color: '#555', textAlign: 'center' }}>{char.remark || char.name}</span>
              </div>
            ))}
            {/* User */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 24, background: '#555',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 600, fontSize: 16,
              }}>我</div>
              <span style={{ fontSize: 10, color: '#555' }}>我</span>
            </div>
            {/* Add button */}
            <button
              onClick={() => showToast('添加成员功能开发中')}
              style={{
                width: 48, height: 48, borderRadius: 8, border: '1.5px dashed #D1D5DB',
                background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#AAAAAA', alignSelf: 'flex-start',
              }}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Announcement */}
        {group.announcement && (
          <div style={{ padding: '0 16px 12px' }}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>群公告</div>
            <div style={{
              background: '#F9FAFB', borderRadius: 8, padding: '10px 12px',
              fontSize: 13, color: '#444', lineHeight: 1.6,
            }}>
              {group.announcement}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: '#F3F4F6', margin: '4px 0' }} />

        {/* Toggles */}
        <div style={{ padding: '8px 0' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px',
          }}>
            <span style={{ fontSize: 14, color: '#1A1A1A' }}>消息免打扰</span>
            <Toggle value={muted} onChange={onToggleMuted} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px',
          }}>
            <span style={{ fontSize: 14, color: '#1A1A1A' }}>置顶该群聊</span>
            <Toggle value={pinned} onChange={onTogglePinned} />
          </div>
        </div>

        <div style={{ height: 1, background: '#F3F4F6', margin: '4px 0' }} />

        {/* Actions */}
        <div style={{ padding: '8px 0' }}>
          <button
            onClick={() => { onClearChat(); showToast('聊天记录已清空') }}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              width: '100%', padding: '12px 16px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 14, color: '#1A1A1A',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F8F8' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
          >
            清空聊天记录
          </button>
          <button
            onClick={() => showToast('退出群聊功能开发中')}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              width: '100%', padding: '12px 16px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 14, color: '#EF4444',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
          >
            退出群聊
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── main chat column ───────────────────────────────────────────────────────

interface ChatColumnProps {
  group: MockGroup
  messages: MockGroupMessage[]
  onSend: (text: string) => void
  typingEntries: TypingEntry[]
  showToast: (msg: string) => void
  onMoreClick: () => void
  showSettings: boolean
}

function ChatColumn({ group, messages, onSend, typingEntries, showToast, onMoreClick, showSettings }: ChatColumnProps) {
  const [input, setInput] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingEntries])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) { onSend(input.trim()); setInput('') }
    }
  }

  function handleSend() {
    if (input.trim()) { onSend(input.trim()); setInput('') }
  }

  const memberCount = group.memberIds.length

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', minWidth: 0 }}>
      {/* Header */}
      <div style={{
        height: 60, background: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GroupAvatar color={group.avatarColor} name={group.name} size={36} />
          <div>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#1A1A1A' }}>{group.name}</span>
            <span style={{ fontSize: 12, color: '#999', marginLeft: 6 }}>{memberCount}人</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => showToast('搜索聊天记录功能开发中')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 6, display: 'flex', alignItems: 'center' }}>
            <Search size={20} />
          </button>
          <button
            onClick={onMoreClick}
            style={{
              border: 'none', background: 'none', cursor: 'pointer', padding: 6,
              color: showSettings ? '#07C160' : '#666', display: 'flex', alignItems: 'center',
            }}
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
        background: '#EDEDED', display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        {messages.map((msg, i) => {
          if (msg.role === 'system' || msg.type === 'system') {
            return (
              <div key={msg.id} style={{ textAlign: 'center', margin: '8px 0' }}>
                <span style={{
                  fontSize: 11, color: '#888',
                  background: 'rgba(0,0,0,0.08)',
                  padding: '2px 10px', borderRadius: 10,
                }}>
                  {msg.content}
                </span>
              </div>
            )
          }

          const isUser = msg.senderId === 'user' || msg.role === 'user'
          const prevMsg = messages[i - 1]
          const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId || prevMsg.role === 'system' || prevMsg.type === 'system'

          return (
            <div key={msg.id} style={{
              display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start', gap: 6, marginBottom: 2,
            }}>
              {!isUser && (
                <div style={{ width: 32, flexShrink: 0, marginTop: 2 }}>
                  {isFirstInGroup && <CharacterAvatar avatarId={msg.avatarId} size={32} />}
                </div>
              )}
              <div style={{ maxWidth: '60%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {!isUser && isFirstInGroup && (
                  <span style={{ fontSize: 11, color: '#AAAAAA', marginLeft: 2, marginBottom: 1 }}>
                    {msg.senderName}
                  </span>
                )}
                <div style={{
                  background: isUser ? '#95EC69' : '#FFFFFF',
                  borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  padding: msg.type === 'voice' ? '8px 12px' : msg.type === 'image' ? '4px' : '9px 13px',
                  fontSize: 14, color: '#1A1A1A', lineHeight: 1.55,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
                  wordBreak: 'break-word' as const, overflow: 'hidden',
                }}>
                  {msg.type === 'image' ? (
                    <div style={{
                      width: 200, height: 150,
                      background: msg.imageColors
                        ? msg.imageColors[0]
                        : 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
                      borderRadius: 6,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Image size={28} color="rgba(255,255,255,0.7)" />
                    </div>
                  ) : msg.type === 'voice' ? (
                    <VoiceMessageBar duration={5} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing indicators */}
        {typingEntries.map(entry => (
          <GroupTypingIndicator key={entry.charId} entry={entry} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div style={{
        background: '#FFFFFF', borderTop: '1px solid #E5E5E5',
        flexShrink: 0, position: 'relative',
      }} onClick={() => setShowEmoji(false)}>
        {/* Emoji picker */}
        {showEmoji && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 0, right: 0,
            background: '#fff', borderTop: '1px solid #E5E5E5',
            padding: '10px 12px',
            display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4,
            boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
          }} onClick={e => e.stopPropagation()}>
            {EMOJI_LIST.map(emoji => (
              <button
                key={emoji}
                onClick={() => setInput(prev => prev + emoji)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, padding: 4, borderRadius: 6, lineHeight: 1 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F0F0F0' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '8px 12px 10px' }}>
          <button onClick={() => showToast('语音消息功能开发中')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Mic size={22} />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="发消息"
            rows={1}
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: '#F5F5F5', borderRadius: 8,
              padding: '8px 10px', fontSize: 14, color: '#1A1A1A',
              resize: 'none', fontFamily: 'inherit',
              maxHeight: 100, overflowY: 'auto', lineHeight: 1.5,
            }}
          />
          <button
            onClick={e => { e.stopPropagation(); setShowEmoji(s => !s) }}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: showEmoji ? '#07C160' : '#666', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center' }}
          >
            <Smile size={22} />
          </button>
          <button onClick={() => showToast('图片发送功能开发中')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Image size={20} />
          </button>
          {input.trim() ? (
            <button
              onClick={handleSend}
              style={{
                background: '#07C160', color: '#fff', border: 'none', borderRadius: '50%',
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <Send size={16} />
            </button>
          ) : (
            <button
              onClick={() => showToast('更多功能开发中')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center' }}
            >
              <Plus size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── main page ──────────────────────────────────────────────────────────────

export default function GroupsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [allMessages, setAllMessages] = useState<Record<string, MockGroupMessage[]>>(
    Object.fromEntries(
      Object.entries(mockGroupMessages).map(([k, v]) => [k, [...v]])
    )
  )
  const [typingMap, setTypingMap] = useState<Record<string, TypingEntry[]>>({})
  const [showSettings, setShowSettings] = useState(false)
  const [mutedGroups, setMutedGroups] = useState<string[]>([])
  const [pinnedGroups, setPinnedGroups] = useState<string[]>([])
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(
    Object.fromEntries(mockGroups.map(g => [g.id, g.unreadCount]))
  )
  const replyCountRef = useRef<Record<string, number>>({})
  const { showToast, ToastContainer } = useToast()

  const selectedGroup = mockGroups.find(g => g.id === selectedId) ?? null

  // Mark as read when selected
  useEffect(() => {
    if (selectedId) setUnreadCounts(prev => ({ ...prev, [selectedId]: 0 }))
  }, [selectedId])

  const handleSend = useCallback((text: string) => {
    if (!selectedId) return

    const userMsg: MockGroupMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: '我',
      avatarId: 0,
      role: 'user',
      content: text,
      type: 'text',
      timestamp: formatNow(),
    }

    setAllMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), userMsg],
    }))

    // Pick 1-3 random responders from this group's AI members
    const group = mockGroups.find(g => g.id === selectedId)
    if (!group) return
    const aiMemberIds = group.memberIds.filter(id => id !== 'user')
    if (aiMemberIds.length === 0) return

    const shuffled = [...aiMemberIds].sort(() => Math.random() - 0.5)
    const responders = shuffled.slice(0, Math.min(aiMemberIds.length, 1 + Math.floor(Math.random() * 3)))

    let cumulativeDelay = 1000 + Math.random() * 800

    responders.forEach((charId, idx) => {
      const char = mockCharacters.find(c => c.id === charId)
      if (!char) return
      const avatarId = characterAvatarMap[charId] ?? 1
      const senderName = char.remark || char.name
      const replies = mockGroupReplies[charId] ?? ['嗯']
      const count = replyCountRef.current[charId] ?? 0
      replyCountRef.current[charId] = count + 1
      const replyText = replies[count % replies.length]

      const typingEntry: TypingEntry = { charId, senderName, avatarId }

      // Show typing
      setTimeout(() => {
        setTypingMap(prev => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] ?? []).filter(e => e.charId !== charId), typingEntry],
        }))
      }, cumulativeDelay)

      const replyDelay = cumulativeDelay + 600 + Math.random() * 900

      // Emit reply
      setTimeout(() => {
        setTypingMap(prev => ({
          ...prev,
          [selectedId]: (prev[selectedId] ?? []).filter(e => e.charId !== charId),
        }))
        const aiMsg: MockGroupMessage = {
          id: `${Date.now()}_${idx}`,
          senderId: charId,
          senderName,
          avatarId,
          role: 'ai',
          content: replyText,
          type: 'text',
          timestamp: formatNow(),
        }
        setAllMessages(prev => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] ?? []), aiMsg],
        }))
      }, replyDelay)

      cumulativeDelay = replyDelay + 500 + Math.random() * 1000
    })
  }, [selectedId])

  const sortedGroups = [...mockGroups].sort((a, b) => {
    const aPin = pinnedGroups.includes(a.id) ? 0 : 1
    const bPin = pinnedGroups.includes(b.id) ? 0 : 1
    return aPin - bPin
  }).filter(g =>
    g.name.includes(search) || g.lastMessage.includes(search)
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <ToastContainer />

      {/* ─── Left column — group list ─── */}
      <div style={{
        width: 280, flexShrink: 0,
        background: '#F5F5F5', boxShadow: 'inset -1px 0 0 #E5E5E5',
        display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 12px 10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A' }}>群聊</span>
            <button
              onClick={() => showToast('创建群聊功能开发中')}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                color: '#07C160', fontSize: 12, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 3, padding: '4px 6px',
              }}
            >
              <Plus size={14} />
              创建群聊
            </button>
          </div>
          <div style={{
            background: '#E8E8E8', borderRadius: 6,
            display: 'flex', alignItems: 'center', padding: '6px 10px', gap: 6,
          }}>
            <Search size={13} color="#AAAAAA" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索"
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#1A1A1A', flex: 1 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Group list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sortedGroups.map(group => {
            const active = selectedId === group.id
            const isMuted = mutedGroups.includes(group.id)
            const unread = unreadCounts[group.id] ?? 0

            // Get actual last message
            const msgs = allMessages[group.id] ?? []
            const lastReal = [...msgs].reverse().find(m => m.role !== 'system' && m.type !== 'system')
            const lastText = lastReal
              ? `${lastReal.senderId === 'user' ? '' : lastReal.senderName + ': '}${lastReal.type === 'image' ? '[图片]' : lastReal.type === 'voice' ? '[语音]' : lastReal.content}`
              : group.lastMessage

            return (
              <div
                key={group.id}
                onClick={() => { setSelectedId(group.id); setShowSettings(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', cursor: 'pointer', height: 64,
                  background: active ? '#E8E8E8' : 'transparent',
                  transition: 'background 0.1s', position: 'relative',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#F0F0F0' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <GroupAvatar color={group.avatarColor} name={group.name} size={48} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {group.name}
                      </span>
                      {isMuted && <BellOff size={11} color="#CCCCCC" />}
                    </div>
                    <span style={{ fontSize: 11, color: '#AAAAAA', flexShrink: 0, marginLeft: 4 }}>{group.lastTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                    <span style={{ fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {lastText}
                    </span>
                    {unread > 0 && !isMuted && (
                      <div style={{
                        background: '#FF4444', color: '#fff', borderRadius: 10,
                        fontSize: 10, fontWeight: 600,
                        minWidth: 16, height: 16, padding: '0 3px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {unread}
                      </div>
                    )}
                    {unread > 0 && isMuted && (
                      <div style={{ width: 8, height: 8, background: '#CCCCCC', borderRadius: '50%', flexShrink: 0 }} />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Middle column — chat ─── */}
      {selectedGroup ? (
        <>
          <ChatColumn
            group={selectedGroup}
            messages={allMessages[selectedId!] ?? []}
            onSend={handleSend}
            typingEntries={typingMap[selectedId!] ?? []}
            showToast={showToast}
            onMoreClick={() => setShowSettings(s => !s)}
            showSettings={showSettings}
          />
          {/* ─── Right panel — settings ─── */}
          {showSettings && (
            <GroupSettingsPanel
              group={selectedGroup}
              onClose={() => setShowSettings(false)}
              muted={mutedGroups.includes(selectedId!)}
              pinned={pinnedGroups.includes(selectedId!)}
              onToggleMuted={() => setMutedGroups(prev => prev.includes(selectedId!) ? prev.filter(x => x !== selectedId) : [...prev, selectedId!])}
              onTogglePinned={() => setPinnedGroups(prev => prev.includes(selectedId!) ? prev.filter(x => x !== selectedId) : [...prev, selectedId!])}
              onClearChat={() => setAllMessages(prev => ({ ...prev, [selectedId!]: [] }))}
              showToast={showToast}
            />
          )}
        </>
      ) : (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 12, color: '#999', height: '100vh',
        }}>
          <Users size={48} color="#D1D5DB" />
          <span style={{ fontSize: 16, fontWeight: 500 }}>选择群聊或创建新群</span>
          <span style={{ fontSize: 13, color: '#BBB' }}>从左侧选择一个群聊</span>
        </div>
      )}
    </div>
  )
}
