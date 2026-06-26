'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Search, Phone, Video, MoreHorizontal, Smile, Image, Mic,
  Plus, Camera, File, Send, Pin, BellOff, ChevronRight,
  X, Volume2, Play, Sparkles, MessageCircle,
} from 'lucide-react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import { mockCharacters, mockConversations, mockAIReplies, type MockMessage, type MockCharacter } from '@/lib/mockData'

const EMOJI_LIST = [
  '😊','😂','🥰','😍','🤔','😅','😭','😤',
  '👍','👎','❤️','🔥','✨','🎉','💯','🙏',
  '😴','🥺','😏','🤩','😬','🙄','😇','🤗',
  '🎮','📚','🌙','🌸','⭐','🍕','☕','🎵',
]

const MORE_ACTIONS = [
  { Icon: Camera, label: '拍照', stub: '相机功能开发中' },
  { Icon: Image, label: '图片', stub: '图片发送中...' },
  { Icon: File, label: '文件', stub: '文件功能开发中' },
  { Icon: Phone, label: '语音', stub: '语音通话功能开发中' },
  { Icon: Video, label: '视频', stub: '视频通话功能开发中' },
  { Icon: Sparkles, label: 'AI生图', stub: 'AI生图功能即将开放' },
]

function formatNow() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
}

function VoiceMessageBar({ duration }: { duration: number }) {
  const bars = Array.from({ length: 10 }, (_, i) => 8 + ((i * 7 + 3) % 16))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
      <button style={{
        width: 28, height: 28, borderRadius: '50%',
        background: '#07C160', border: 'none', cursor: 'pointer',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Play size={10} fill="#fff" />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {bars.map((h, i) => (
          <div key={i} style={{
            width: 3, height: h, background: '#888', borderRadius: 2, opacity: 0.7,
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: '#888', flexShrink: 0 }}>{duration}&apos;&apos;</span>
    </div>
  )
}

function ImagePlaceholder({ alt }: { alt?: string }) {
  return (
    <div style={{
      width: 180, height: 130,
      background: 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
      borderRadius: 8,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 6,
    }}>
      <Image size={28} color="#aaa" />
      {alt && <span style={{ fontSize: 11, color: '#888' }}>{alt}</span>}
    </div>
  )
}

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string>('1')
  const [conversations, setConversations] = useState(mockConversations)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(
    Object.fromEntries(mockCharacters.map(c => [c.id, c.unreadCount]))
  )
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; charId: string } | null>(null)
  const [pinnedIds, setPinnedIds] = useState<string[]>(mockCharacters.filter(c => c.isPinned).map(c => c.id))
  const [mutedIds, setMutedIds] = useState<string[]>(mockCharacters.filter(c => c.isMuted).map(c => c.id))
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const replyCountRef = useRef<Record<string, number>>({})
  const { showToast, ToastContainer } = useToast()

  const selectedChar = mockCharacters.find(c => c.id === selectedId)!
  const currentMessages = conversations[selectedId] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, isTyping])

  useEffect(() => {
    setUnreadCounts(prev => ({ ...prev, [selectedId]: 0 }))
  }, [selectedId])

  const sendMessage = useCallback(() => {
    if (!input.trim()) return
    const text = input.trim()
    setInput('')
    setShowEmoji(false)
    setShowMore(false)

    const userMsg: MockMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: formatNow(),
      type: 'text',
    }
    setConversations(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), userMsg],
    }))

    const delay = 1200 + Math.random() * 1200
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const replies = mockAIReplies[selectedId] || ['嗯嗯']
        const count = replyCountRef.current[selectedId] || 0
        replyCountRef.current[selectedId] = (count + 1) % replies.length
        const replyText = replies[count % replies.length]

        let charIdx = 0
        const aiMsgId = (Date.now() + 1).toString()
        const aiMsg: MockMessage = {
          id: aiMsgId,
          role: 'ai',
          content: '',
          timestamp: formatNow(),
          type: 'text',
        }
        setConversations(prev => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] || []), aiMsg],
        }))

        const typeInterval = setInterval(() => {
          charIdx++
          const partial = replyText.slice(0, charIdx)
          setConversations(prev => ({
            ...prev,
            [selectedId]: prev[selectedId].map(m =>
              m.id === aiMsgId ? { ...m, content: partial } : m
            ),
          }))
          if (charIdx >= replyText.length) clearInterval(typeInterval)
        }, 40)
      }, delay)
    }, 300)
  }, [input, selectedId])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleContextMenu(e: React.MouseEvent, charId: string) {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, charId })
  }

  function closeContextMenu() { setContextMenu(null) }

  const sortedChars = [...mockCharacters].sort((a, b) => {
    const aPin = pinnedIds.includes(a.id) ? 0 : 1
    const bPin = pinnedIds.includes(b.id) ? 0 : 1
    return aPin - bPin
  })

  const filteredChars = sortedChars.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.content.includes(search) ||
    (c.remark && c.remark.includes(search))
  )

  function getLastMsgPreview(char: MockCharacter) {
    const msgs = conversations[char.id]
    if (!msgs) return char.lastMessage
    const real = [...msgs].reverse().find(m => m.role !== 'system_time')
    if (!real) return char.lastMessage
    return { type: real.type || 'text', content: real.content, time: real.timestamp || char.lastMessage.time }
  }

  const onlineColor: Record<string, string> = {
    online: '#07C160',
    recent: '#FFB347',
    offline: '#CCCCCC',
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }} onClick={() => { closeContextMenu(); setShowMore(false); setShowEmoji(false); setShowMoreMenu(false) }}>
      <ToastContainer />

      {/* ─── Conversation list ─── */}
      <div style={{
        width: 280, flexShrink: 0,
        background: '#F5F5F5',
        boxShadow: 'inset -1px 0 0 #E5E5E5',
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 12px 6px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A' }}>消息</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={e => { e.stopPropagation(); showToast('新建功能开发中') }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', padding: '4px 6px', fontSize: 11, borderRadius: 4 }}
              >
                + 新建
              </button>
              <button
                onClick={e => { e.stopPropagation(); setShowSearch(s => !s) }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', padding: 4, borderRadius: 4 }}
              >
                <Search size={16} />
              </button>
            </div>
          </div>
          {showSearch && (
            <div style={{
              background: '#E8E8E8', borderRadius: 6,
              display: 'flex', alignItems: 'center', padding: '6px 10px', gap: 6,
            }}>
              <Search size={13} color="#AAAAAA" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索"
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#1A1A1A', flex: 1 }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}>
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredChars.map(char => {
            const active = selectedId === char.id
            const isPinned = pinnedIds.includes(char.id)
            const isMuted = mutedIds.includes(char.id)
            const unread = unreadCounts[char.id] || 0
            const lastMsg = getLastMsgPreview(char)

            let msgPreview = lastMsg.content
            if (lastMsg.type === 'image') msgPreview = '[图片]'
            else if (lastMsg.type === 'voice') msgPreview = '[语音]'

            return (
              <div
                key={char.id}
                onClick={e => { e.stopPropagation(); setSelectedId(char.id) }}
                onContextMenu={e => { e.stopPropagation(); handleContextMenu(e, char.id) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  background: active ? '#E8E8E8' : 'transparent',
                  transition: 'background 0.1s',
                  height: 64,
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#F0F0F0' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                {/* Pin indicator */}
                {isPinned && (
                  <div style={{ position: 'absolute', top: 6, right: 8, color: '#CCCCCC' }}>
                    <Pin size={10} />
                  </div>
                )}

                {/* Avatar with unread badge */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <CharacterAvatar avatarId={char.avatarId} size={40} />
                  {/* Online dot */}
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 9, height: 9, borderRadius: '50%',
                    background: onlineColor[char.onlineStatus] || '#CCCCCC',
                    border: '1.5px solid #F5F5F5',
                  }} />
                  {unread > 0 && !isMuted && (
                    <div style={{
                      position: 'absolute', top: -4, right: -4,
                      background: '#FF4444', color: '#fff',
                      borderRadius: 10, fontSize: 10, fontWeight: 600,
                      minWidth: 16, height: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 3px', border: '1.5px solid #F5F5F5',
                    }}>
                      {unread}
                    </div>
                  )}
                  {unread > 0 && isMuted && (
                    <div style={{
                      position: 'absolute', top: -3, right: -3,
                      width: 8, height: 8,
                      background: '#CCCCCC', borderRadius: '50%',
                      border: '1.5px solid #F5F5F5',
                    }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {char.remark || char.name}
                      </span>
                      {isMuted && (
                        <span style={{ color: '#CCCCCC', display: 'flex', alignItems: 'center' }}>
                          <BellOff size={11} />
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: '#AAAAAA', flexShrink: 0, marginLeft: 4 }}>{lastMsg.time}</span>
                  </div>
                  <div style={{
                    fontSize: 12, color: '#888888',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {msgPreview}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Add new */}
          <div style={{ padding: '12px 12px 8px', borderTop: '1px solid #EBEBEB', marginTop: 4 }}>
            <button
              onClick={() => showToast('添加伙伴功能开发中')}
              style={{
                width: '100%', background: 'none', border: '1px dashed #CCCCCC',
                borderRadius: 8, padding: '8px', fontSize: 12, color: '#AAAAAA',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              <Plus size={14} /> 添加新伙伴
            </button>
          </div>
        </div>
      </div>

      {/* ─── Chat window ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          height: 60, background: '#FFFFFF',
          borderBottom: '1px solid #E5E5E5',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CharacterAvatar avatarId={selectedChar.avatarId} size={36} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#1A1A1A' }}>
                  {selectedChar.remark || selectedChar.name}
                </span>
                {selectedChar.remark && (
                  <span style={{ fontSize: 12, color: '#999' }}>{selectedChar.name}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: onlineColor[selectedChar.onlineStatus] || '#CCCCCC',
                  }} />
                  <span style={{ fontSize: 11, color: '#888' }}>{selectedChar.lastSeen}</span>
                </div>
              </div>
              {isTyping && (
                <div style={{ fontSize: 11, color: '#AAAAAA', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span>正在输入</span>
                  {[0,1,2].map(i => (
                    <div key={i} className="typing-dot" style={{
                      width: 3, height: 3, borderRadius: '50%', background: '#AAAAAA',
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
            <button onClick={() => showToast('语音通话功能开发中')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 6, borderRadius: 4, display: 'flex', alignItems: 'center' }}>
              <Phone size={20} />
            </button>
            <button onClick={() => showToast('视频通话功能开发中')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 6, borderRadius: 4, display: 'flex', alignItems: 'center' }}>
              <Video size={20} />
            </button>
            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setShowMoreMenu(s => !s) }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 6, borderRadius: 4, display: 'flex', alignItems: 'center' }}
              >
                <MoreHorizontal size={20} />
              </button>
              {showMoreMenu && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'absolute', top: '100%', right: 0, zIndex: 100,
                    background: '#fff', borderRadius: 10,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    overflow: 'hidden', minWidth: 140,
                  }}
                >
                  {['查看资料', '搜索聊天记录', '清空消息', '投诉'].map((item, i) => (
                    <button
                      key={item}
                      onClick={() => { setShowMoreMenu(false); showToast(`${item}功能开发中`) }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '10px 16px', background: 'none', border: 'none',
                        fontSize: 14, cursor: 'pointer',
                        color: item === '投诉' ? '#FF4444' : '#1A1A1A',
                        borderBottom: i < 3 ? '1px solid #F5F5F5' : 'none',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F8F8' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '16px 20px', background: '#EDEDED',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {currentMessages.map((msg, i) => {
            if (msg.role === 'system_time') {
              return (
                <div key={msg.id} style={{ textAlign: 'center', margin: '10px 0 6px' }}>
                  <span style={{
                    fontSize: 11, color: '#888',
                    background: 'rgba(0,0,0,0.1)',
                    padding: '2px 10px', borderRadius: 10,
                  }}>
                    {msg.content}
                  </span>
                </div>
              )
            }

            const isUser = msg.role === 'user'
            const prevMsg = currentMessages[i - 1]
            const isFirstInGroup = !prevMsg || prevMsg.role !== msg.role || prevMsg.type === 'system_time'

            return (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 8,
                marginBottom: 2,
              }}>
                {!isUser && (
                  <div style={{ width: 32, flexShrink: 0, marginTop: 2 }}>
                    {isFirstInGroup && <CharacterAvatar avatarId={selectedChar.avatarId} size={32} />}
                  </div>
                )}
                <div style={{ maxWidth: '60%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {!isUser && isFirstInGroup && (
                    <span style={{ fontSize: 11, color: '#AAAAAA', marginLeft: 2, marginBottom: 1 }}>
                      {selectedChar.remark || selectedChar.name}
                    </span>
                  )}
                  <div style={{
                    background: isUser ? '#95EC69' : '#FFFFFF',
                    borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    padding: msg.type === 'voice' ? '8px 12px' : msg.type === 'image' ? '4px' : '9px 13px',
                    fontSize: 14, color: '#1A1A1A', lineHeight: 1.55,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                  }}>
                    {msg.type === 'image' ? (
                      <ImagePlaceholder alt={msg.imageAlt} />
                    ) : msg.type === 'voice' ? (
                      <VoiceMessageBar duration={msg.duration || 5} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 4 }}>
              <CharacterAvatar avatarId={selectedChar.avatarId} size={32} />
              <div style={{
                background: '#FFFFFF',
                borderRadius: '4px 16px 16px 16px',
                padding: '10px 14px',
                display: 'flex', gap: 4, alignItems: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
              }}>
                {[0,1,2].map(i => (
                  <div key={i} className="typing-dot" style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#AAAAAA',
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div style={{
          background: '#FFFFFF', borderTop: '1px solid #E5E5E5',
          flexShrink: 0, position: 'relative',
        }} onClick={e => e.stopPropagation()}>
          {/* Emoji picker */}
          {showEmoji && (
            <div style={{
              position: 'absolute', bottom: '100%', left: 0, right: 0,
              background: '#fff', borderTop: '1px solid #E5E5E5',
              padding: '10px 12px',
              display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4,
              boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
            }}>
              {EMOJI_LIST.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setInput(prev => prev + emoji)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 22, padding: 4, borderRadius: 6,
                    lineHeight: 1,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F0F0F0' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* More actions panel */}
          {showMore && (
            <div style={{
              position: 'absolute', bottom: '100%', left: 0, right: 0,
              background: '#fff', borderTop: '1px solid #E5E5E5',
              padding: '16px',
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
              boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
            }}>
              {MORE_ACTIONS.map(({ Icon, label, stub }) => (
                <button
                  key={label}
                  onClick={() => { showToast(stub); setShowMore(false) }}
                  style={{
                    background: '#F5F5F5', border: 'none', borderRadius: 12,
                    padding: '14px 8px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  }}
                >
                  <Icon size={28} color="#666" />
                  <span style={{ fontSize: 11, color: '#555' }}>{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Main input row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '8px 12px 10px' }}>
            {/* Voice button */}
            <button
              onClick={() => showToast('语音消息功能开发中')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center' }}
            >
              <Mic size={22} />
            </button>

            {/* Text input */}
            <textarea
              ref={inputRef}
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

            {/* Emoji */}
            <button
              onClick={() => { setShowEmoji(s => !s); setShowMore(false) }}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                color: showEmoji ? '#07C160' : '#666',
                padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center',
              }}
            >
              <Smile size={22} />
            </button>

            {/* Image */}
            <button
              onClick={() => showToast('图片发送功能开发中')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center' }}
            >
              <Image size={20} />
            </button>

            {/* Plus / Send */}
            {input.trim() ? (
              <button
                onClick={sendMessage}
                style={{
                  background: '#07C160', color: '#fff',
                  border: 'none', borderRadius: '50%',
                  width: 34, height: 34,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'background 0.15s',
                }}
              >
                <Send size={16} />
              </button>
            ) : (
              <button
                onClick={() => { setShowMore(s => !s); setShowEmoji(false) }}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer',
                  color: showMore ? '#07C160' : '#666',
                  padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center',
                }}
              >
                <Plus size={22} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          onClick={closeContextMenu}
          style={{ position: 'fixed', inset: 0, zIndex: 200 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: contextMenu.x, top: contextMenu.y,
              background: '#fff', borderRadius: 10,
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              overflow: 'hidden', minWidth: 150, zIndex: 201,
            }}
          >
            {[
              { label: pinnedIds.includes(contextMenu.charId) ? '取消置顶' : '置顶', action: () => { setPinnedIds(prev => prev.includes(contextMenu.charId) ? prev.filter(x => x !== contextMenu.charId) : [...prev, contextMenu.charId]) } },
              { label: mutedIds.includes(contextMenu.charId) ? '取消免打扰' : '设为免打扰', action: () => { setMutedIds(prev => prev.includes(contextMenu.charId) ? prev.filter(x => x !== contextMenu.charId) : [...prev, contextMenu.charId]) } },
              { label: '标为已读', action: () => { setUnreadCounts(prev => ({ ...prev, [contextMenu.charId]: 0 })) } },
              { label: '删除', action: () => { showToast('删除功能开发中') } },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                onClick={() => { item.action(); closeContextMenu() }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 16px', background: 'none', border: 'none',
                  fontSize: 14, cursor: 'pointer',
                  borderBottom: i < arr.length - 1 ? '1px solid #F5F5F5' : 'none',
                  color: item.label === '删除' ? '#FF4444' : '#1A1A1A',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F8F8' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
