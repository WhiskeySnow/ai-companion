'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Search, Phone, Video, MoreHorizontal, Smile, Image, Mic,
  Plus, Camera, File, Send, Pin, BellOff,
  X, Play, Sparkles,
} from 'lucide-react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { useToast } from '@/components/ui/Toast'
import {
  mockCharacters, mockConversations, mockAIReplies,
  type MockMessage, type MockCharacter,
} from '@/lib/mockData'

const EMOJI_LIST = [
  '😊','😂','🥰','😍','🤔','😅','😭','😤',
  '👍','👎','❤️','🔥','✨','🎉','💯','🙏',
  '😴','🥺','😏','🤩','😬','🙄','😇','🤗',
  '🎮','📚','🌙','🌸','⭐','🍕','☕','🎵',
]

const MORE_ACTIONS = [
  { Icon: Camera, label: '拍照',    stub: '相机功能开发中' },
  { Icon: Image,  label: '图片',    stub: '图片发送中...' },
  { Icon: File,   label: '文件',    stub: '文件功能开发中' },
  { Icon: Phone,  label: '语音通话', stub: '语音通话功能开发中' },
  { Icon: Video,  label: '视频通话', stub: '视频通话功能开发中' },
  { Icon: Sparkles, label: 'AI生图', stub: 'AI生图功能即将开放' },
]

// ─── helpers ────────────────────────────────────────────────

function formatNow() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

function parseTime(ts: string): number {
  if (!ts) return -1
  const [h, m] = ts.split(':').map(Number)
  return isNaN(h) || isNaN(m) ? -1 : h * 60 + m
}

// ─── timestamp formatting ────────────────────────────────────

const DAY_MAP: Record<string, number> = { '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'日':0,'天':0 }

function parseDateLabel(label: string): Date {
  const today = new Date(); today.setHours(0,0,0,0)
  if (label === '今天') return new Date(today)
  if (label === '昨天') { const d = new Date(today); d.setDate(d.getDate()-1); return d }

  if (label.startsWith('上周')) {
    const target = DAY_MAP[label.slice(2)] ?? 1
    const dow = today.getDay() === 0 ? 7 : today.getDay()   // Mon=1…Sun=7
    const thisMonday = new Date(today); thisMonday.setDate(today.getDate() - dow + 1)
    const lastMonday = new Date(thisMonday); lastMonday.setDate(thisMonday.getDate() - 7)
    const offset = target === 0 ? 6 : target - 1            // Mon=0…Sun=6
    const d = new Date(lastMonday); d.setDate(lastMonday.getDate() + offset); return d
  }
  if (label.startsWith('周')) {
    const target = DAY_MAP[label.slice(1)] ?? 1
    let back = (today.getDay() - target + 7) % 7
    if (back === 0) back = 7
    const d = new Date(today); d.setDate(d.getDate() - back); return d
  }
  const dm = label.match(/^(\d+)天前$/)
  if (dm) { const d = new Date(today); d.setDate(d.getDate()-+dm[1]); return d }
  const wm = label.match(/^(\d+)周前$/)
  if (wm) { const d = new Date(today); d.setDate(d.getDate()-+wm[1]*7); return d }
  return new Date(today)
}

function getDateFromContext(msgs: MockMessage[], i: number): Date {
  for (let j = i - 1; j >= 0; j--) {
    if (msgs[j].role === 'system_time') return parseDateLabel(msgs[j].content)
  }
  return new Date()
}

function formatTimestamp(date: Date, timeStr: string): string {
  if (!timeStr) return ''
  const [hStr, mStr] = timeStr.split(':')
  const h = parseInt(hStr ?? '0')
  const m = mStr ?? '00'
  const period = h < 12 ? '上午' : '下午'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const timeFmt = `${period} ${h12}:${m}`

  const now = new Date()
  const today = new Date(now); today.setHours(0,0,0,0)
  const msgDay = new Date(date); msgDay.setHours(0,0,0,0)
  const diffDays = Math.round((today.getTime() - msgDay.getTime()) / 86400000)

  if (diffDays === 0) return timeFmt
  if (diffDays === 1) return `昨天 ${timeFmt}`
  if (diffDays <= 6) {
    const names = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
    return `${names[msgDay.getDay()]} ${timeFmt}`
  }
  if (msgDay.getFullYear() === now.getFullYear()) {
    return `${msgDay.getMonth()+1}月${msgDay.getDate()}日 ${timeFmt}`
  }
  return `${msgDay.getFullYear()}年${msgDay.getMonth()+1}月${msgDay.getDate()}日 ${timeFmt}`
}

function getStampBefore(msgs: MockMessage[], i: number): string | null {
  const msg = msgs[i]
  if (msg.role === 'system_time' || !msg.timestamp) return null

  let prevTs: string | null = null
  for (let j = i - 1; j >= 0; j--) {
    if (msgs[j].role === 'system_time') break
    if (msgs[j].timestamp) { prevTs = msgs[j].timestamp; break }
  }

  const label = formatTimestamp(getDateFromContext(msgs, i), msg.timestamp)
  if (!prevTs) return label
  const gap = parseTime(msg.timestamp) - parseTime(prevTs)
  return gap >= 5 ? label : null
}

// ─── sub-components ─────────────────────────────────────────

function TimeChip({ label }: { label: string }) {
  return (
    <div style={{ textAlign: 'center', margin: '12px 0 4px', userSelect: 'none', flexShrink: 0 }}>
      <span style={{
        fontSize: 11, color: '#888888',
        background: 'rgba(0,0,0,0.08)',
        padding: '2px 10px', borderRadius: 10,
      }}>
        {label}
      </span>
    </div>
  )
}

function VoiceMessageBar({ duration, isUser }: { duration: number; isUser?: boolean }) {
  // Natural speech waveform: taller in the middle
  const heights = [4, 7, 11, 16, 20, 22, 19, 15, 11, 8, 5, 3]
  const barFill = isUser ? 'rgba(0,0,0,0.30)' : '#BBBBBB'
  const btnBg   = isUser ? 'rgba(0,0,0,0.12)' : '#EFEFEF'
  const playCol = isUser ? 'rgba(0,0,0,0.45)' : '#888888'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      flexDirection: isUser ? 'row-reverse' : 'row',
      padding: '1px 0',
    }}>
      <button style={{
        width: 30, height: 30, borderRadius: '50%',
        background: btnBg, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Play size={11} fill={playCol} color={playCol} />
      </button>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 2,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}>
        {heights.map((h, i) => (
          <div key={i} style={{ width: 3, height: h, background: barFill, borderRadius: 2 }} />
        ))}
      </div>

      <span style={{ fontSize: 11, color: isUser ? 'rgba(0,0,0,0.45)' : '#999999', flexShrink: 0 }}>
        {duration}″
      </span>
    </div>
  )
}

const IMG_GRADIENTS = [
  'linear-gradient(135deg,#E2E8F0,#CBD5E1)',
  'linear-gradient(135deg,#DBEAFE,#BFDBFE)',
  'linear-gradient(135deg,#FCE7F3,#FBCFE8)',
  'linear-gradient(135deg,#D1FAE5,#A7F3D0)',
  'linear-gradient(135deg,#FEF3C7,#FDE68A)',
  'linear-gradient(135deg,#EDE9FE,#DDD6FE)',
]

function ImageMessage({ alt, seed = 0 }: { alt?: string; seed?: number }) {
  const bg = IMG_GRADIENTS[seed % IMG_GRADIENTS.length]
  return (
    <div style={{
      width: 178, height: 128, borderRadius: 6,
      background: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 6,
    }}>
      <Image size={22} color="rgba(0,0,0,0.18)" />
      {alt && (
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textAlign: 'center', padding: '0 12px', lineHeight: 1.4 }}>
          {alt}
        </span>
      )}
    </div>
  )
}

// ─── main page ──────────────────────────────────────────────

export default function MessagesPage() {
  const [selectedId, setSelectedId]       = useState<string>('1')
  const [conversations, setConversations] = useState(mockConversations)
  const [input, setInput]                 = useState('')
  const [isTyping, setIsTyping]           = useState(false)
  const [search, setSearch]               = useState('')
  const [showSearch, setShowSearch]       = useState(false)
  const [showEmoji, setShowEmoji]         = useState(false)
  const [showMore, setShowMore]           = useState(false)
  const [showMoreMenu, setShowMoreMenu]   = useState(false)
  const [unreadCounts, setUnreadCounts]   = useState<Record<string, number>>(
    Object.fromEntries(mockCharacters.map(c => [c.id, c.unreadCount]))
  )
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; charId: string } | null>(null)
  const [pinnedIds, setPinnedIds]     = useState<string[]>(mockCharacters.filter(c => c.isPinned).map(c => c.id))
  const [mutedIds,  setMutedIds]      = useState<string[]>(mockCharacters.filter(c => c.isMuted).map(c => c.id))
  const [readMsgIds, setReadMsgIds]   = useState<Set<string>>(new Set())

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLTextAreaElement>(null)
  const replyCountRef  = useRef<Record<string, number>>({})
  const { showToast, ToastContainer } = useToast()

  const selectedChar    = mockCharacters.find(c => c.id === selectedId)!
  const currentMessages = conversations[selectedId] || []

  // Mark new messages as read after 1.5 s
  useEffect(() => {
    setUnreadCounts(prev => ({ ...prev, [selectedId]: 0 }))
  }, [selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, isTyping])

  const onlineColor: Record<string, string> = {
    online:  '#07C160',
    recent:  '#FFB347',
    offline: '#CCCCCC',
  }

  // ── send flow ──
  const sendMessage = useCallback(() => {
    if (!input.trim()) return
    const text = input.trim()
    setInput('')
    setShowEmoji(false)
    setShowMore(false)

    const now      = formatNow()
    const userMsgId = `u-${Date.now()}`
    const userMsg: MockMessage = {
      id: userMsgId, role: 'user', content: text, timestamp: now, type: 'text',
    }
    setConversations(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), userMsg],
    }))

    // Mark user message as "sending" then "read" after AI starts typing
    const preDelay = 800 + Math.random() * 800
    setTimeout(() => {
      setReadMsgIds(prev => { const s = new Set(prev); s.add(userMsgId); return s })
      setIsTyping(true)
      const replyDelay = 1000 + Math.random() * 1200
      setTimeout(() => {
        setIsTyping(false)
        const replies = mockAIReplies[selectedId] || ['嗯嗯']
        const count   = replyCountRef.current[selectedId] || 0
        replyCountRef.current[selectedId] = (count + 1) % replies.length
        const replyText = replies[count % replies.length]

        let charIdx  = 0
        const aiId   = `a-${Date.now()}`
        const aiMsg: MockMessage = { id: aiId, role: 'ai', content: '', timestamp: formatNow(), type: 'text' }
        setConversations(prev => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] || []), aiMsg],
        }))
        const interval = setInterval(() => {
          charIdx++
          setConversations(prev => ({
            ...prev,
            [selectedId]: prev[selectedId].map(m =>
              m.id === aiId ? { ...m, content: replyText.slice(0, charIdx) } : m
            ),
          }))
          if (charIdx >= replyText.length) clearInterval(interval)
        }, 45)
      }, replyDelay)
    }, preDelay)
  }, [input, selectedId])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  function handleContextMenu(e: React.MouseEvent, charId: string) {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, charId })
  }

  const closeAll = () => {
    setContextMenu(null); setShowMore(false); setShowEmoji(false); setShowMoreMenu(false)
  }

  const sortedChars = [...mockCharacters].sort((a, b) => {
    return (pinnedIds.includes(a.id) ? 0 : 1) - (pinnedIds.includes(b.id) ? 0 : 1)
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
    let content = real.content
    if (real.type === 'image')   content = '[图片]'
    if (real.type === 'voice')   content = '[语音]'
    if (real.type === 'sticker') content = '[表情]'
    return { type: real.type || 'text', content, time: real.timestamp || char.lastMessage.time }
  }

  // Count user messages that are not yet "read"
  function isUserMsgRead(msgId: string) {
    return readMsgIds.has(msgId)
  }

  return (
    <div
      style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}
      onClick={closeAll}
    >
      <ToastContainer />

      {/* ════════════════ CONVERSATION LIST ════════════════ */}
      <div style={{
        width: 280, flexShrink: 0,
        background: '#F5F5F5',
        borderRight: '1px solid #E0E0E0',
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 12px 8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1A1A1A', letterSpacing: 0.2 }}>消息</span>
            <div style={{ display: 'flex', gap: 2 }}>
              <button
                onClick={e => { e.stopPropagation(); showToast('新建功能开发中') }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', padding: '4px 6px', fontSize: 12, borderRadius: 4 }}
              >
                + 新建
              </button>
              <button
                onClick={e => { e.stopPropagation(); setShowSearch(s => !s) }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', padding: '4px 5px', borderRadius: 4, display: 'flex', alignItems: 'center' }}
              >
                <Search size={15} />
              </button>
            </div>
          </div>

          {showSearch && (
            <div style={{
              background: '#EAEAEA', borderRadius: 6,
              display: 'flex', alignItems: 'center', padding: '5px 9px', gap: 5,
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
                <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredChars.map(char => {
            const active   = selectedId === char.id
            const isPinned = pinnedIds.includes(char.id)
            const isMuted  = mutedIds.includes(char.id)
            const unread   = unreadCounts[char.id] || 0
            const lastMsg  = getLastMsgPreview(char)

            return (
              <div
                key={char.id}
                onClick={e => { e.stopPropagation(); setSelectedId(char.id) }}
                onContextMenu={e => { e.stopPropagation(); handleContextMenu(e, char.id) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px',
                  cursor: 'pointer',
                  background: active ? '#DCDCDC' : 'transparent',
                  transition: 'background 0.1s',
                  height: 62,
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#EBEBEB' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                {isPinned && (
                  <div style={{ position: 'absolute', top: 5, right: 8, color: '#C8C8C8' }}>
                    <Pin size={9} />
                  </div>
                )}

                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <CharacterAvatar avatarId={char.avatarId} size={40} />
                  {/* online dot */}
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 9, height: 9, borderRadius: '50%',
                    background: onlineColor[char.onlineStatus] || '#CCCCCC',
                    border: '1.5px solid #F5F5F5',
                  }} />
                  {/* unread badge */}
                  {unread > 0 && !isMuted && (
                    <div style={{
                      position: 'absolute', top: -4, right: -4,
                      background: '#FF3B30', color: '#fff',
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
                      position: 'absolute', top: -2, right: -2,
                      width: 7, height: 7, background: '#C8C8C8', borderRadius: '50%',
                    }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
                      <span style={{
                        fontWeight: 600, fontSize: 14, color: '#1A1A1A',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {char.remark || char.name}
                      </span>
                      {isMuted && <BellOff size={11} color="#C8C8C8" style={{ flexShrink: 0 }} />}
                    </div>
                    <span style={{ fontSize: 11, color: '#AAAAAA', flexShrink: 0, marginLeft: 6 }}>
                      {lastMsg.time}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#999999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lastMsg.content}
                  </div>
                </div>
              </div>
            )
          })}

          <div style={{ padding: '10px 12px 8px', borderTop: '1px solid #E8E8E8', marginTop: 4 }}>
            <button
              onClick={() => showToast('添加伙伴功能开发中')}
              style={{
                width: '100%', background: 'none', border: '1px dashed #CCCCCC',
                borderRadius: 8, padding: '7px', fontSize: 12, color: '#AAAAAA',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              <Plus size={13} /> 添加新伙伴
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════ CHAT WINDOW ════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* ── Header ── */}
        <div style={{
          height: 56, background: '#FFFFFF',
          borderBottom: '1px solid #E8E8E8',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px', flexShrink: 0,
          boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CharacterAvatar avatarId={selectedChar.avatarId} size={32} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>
                  {selectedChar.remark || selectedChar.name}
                </span>
                {selectedChar.remark && (
                  <span style={{ fontSize: 12, color: '#AAAAAA' }}>{selectedChar.name}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: onlineColor[selectedChar.onlineStatus] || '#CCC' }} />
                  <span style={{ fontSize: 11, color: '#AAAAAA' }}>{selectedChar.lastSeen}</span>
                </div>
              </div>
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                  <span style={{ fontSize: 11, color: '#AAAAAA' }}>正在输入</span>
                  {[0,1,2].map(i => (
                    <div key={i} className="typing-dot" style={{
                      width: 3, height: 3, borderRadius: '50%', background: '#BBBBBB',
                      animationDelay: `${i * 0.22}s`,
                    }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4, alignItems: 'center', position: 'relative' }}>
            {[
              { Icon: Phone, tip: '语音通话功能开发中' },
              { Icon: Video, tip: '视频通话功能开发中' },
            ].map(({ Icon, tip }) => (
              <button
                key={tip}
                onClick={() => showToast(tip)}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer', color: '#666666',
                  padding: '6px 7px', borderRadius: 6, display: 'flex', alignItems: 'center',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F0F0F0' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
              >
                <Icon size={17} />
              </button>
            ))}

            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setShowMoreMenu(s => !s) }}
                style={{
                  border: 'none', cursor: 'pointer', color: '#666666',
                  padding: '6px 7px', borderRadius: 6, display: 'flex', alignItems: 'center',
                  transition: 'background 0.1s',
                  background: showMoreMenu ? '#F0F0F0' : 'none',
                }}
              >
                <MoreHorizontal size={17} />
              </button>
              {showMoreMenu && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 200,
                    background: '#FFFFFF', borderRadius: 10,
                    boxShadow: '0 6px 24px rgba(0,0,0,0.13)',
                    overflow: 'hidden', minWidth: 148,
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {['查看资料','搜索聊天记录','清空消息','投诉'].map((item, i, arr) => (
                    <button
                      key={item}
                      onClick={() => { setShowMoreMenu(false); showToast(`${item}功能开发中`) }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '10px 16px', background: 'none', border: 'none',
                        fontSize: 13.5, cursor: 'pointer',
                        color: item === '投诉' ? '#FF3B30' : '#1A1A1A',
                        borderBottom: i < arr.length - 1 ? '1px solid #F2F2F2' : 'none',
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

        {/* ── Messages area ── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '12px 16px 8px',
          background: '#EDEDED',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {currentMessages.map((msg, i) => {
            /* system_time rows are invisible date-context markers only */
            if (msg.role === 'system_time') {
              return <div key={msg.id} style={{ display: 'none' }} aria-hidden />
            }

            const stampToShow   = getStampBefore(currentMessages, i)
            const isUser        = msg.role === 'user'
            const prevMsg       = currentMessages[i - 1]
            const nextMsg       = currentMessages[i + 1]
            const isFirstInGroup = !prevMsg || prevMsg.role !== msg.role || !!getStampBefore(currentMessages, i)
            const isLastInGroup  = !nextMsg  || nextMsg.role  !== msg.role
            const isSticker     = msg.type === 'sticker'
            const isLastUserMsg = isUser && i === currentMessages.length - 1
            const msgIsRead     = isUserMsgRead(msg.id) || !isLastUserMsg // older msgs always "read"

            return (
              <React.Fragment key={msg.id}>
                {stampToShow && <TimeChip label={stampToShow} />}

                <div style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 6,
                  marginTop: isFirstInGroup ? 8 : 2,
                  marginBottom: isLastInGroup ? 2 : 0,
                }}>
                  {/* AI avatar — only on first in group */}
                  {!isUser && (
                    <div style={{ width: 30, flexShrink: 0 }}>
                      {isFirstInGroup
                        ? <CharacterAvatar avatarId={selectedChar.avatarId} size={30} />
                        : null}
                    </div>
                  )}

                  <div style={{
                    maxWidth: '55%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    gap: 0,
                  }}>
                    {/* Name label for AI first-in-group */}
                    {!isUser && isFirstInGroup && (
                      <span style={{ fontSize: 11, color: '#AAAAAA', marginLeft: 2, marginBottom: 2 }}>
                        {selectedChar.remark || selectedChar.name}
                      </span>
                    )}

                    {/* ── Sticker (no bubble) ── */}
                    {isSticker ? (
                      <div style={{ fontSize: 46, lineHeight: 1, padding: '4px 2px', userSelect: 'none' }}>
                        {msg.content}
                      </div>
                    ) : (
                      /* ── Bubble ── */
                      <div style={{
                        background: isUser ? '#95EC69' : '#FFFFFF',
                        borderRadius: isUser
                          ? (isFirstInGroup ? '12px 3px 12px 12px' : '12px 12px 12px 12px')
                          : (isFirstInGroup ? '3px 12px 12px 12px' : '12px 12px 12px 12px'),
                        padding: msg.type === 'voice'
                          ? '7px 12px'
                          : msg.type === 'image'
                          ? '3px'
                          : '7px 12px',
                        fontSize: 13.5, color: '#1A1A1A', lineHeight: 1.45,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
                        wordBreak: 'break-word', overflow: 'hidden',
                        maxWidth: '100%',
                      }}>
                        {msg.type === 'image' ? (
                          <ImageMessage alt={msg.imageAlt} seed={msg.id.charCodeAt(0)} />
                        ) : msg.type === 'voice' ? (
                          <VoiceMessageBar duration={msg.duration ?? 5} isUser={isUser} />
                        ) : (
                          msg.content
                        )}
                      </div>
                    )}

                    {/* ── Read / unread status under user messages ── */}
                    {isUser && isLastInGroup && !isSticker && (
                      <div style={{ fontSize: 10.5, color: '#BBBBBB', marginTop: 1, paddingRight: 1 }}>
                        {msgIsRead ? '已读' : '未读'}
                      </div>
                    )}
                  </div>

                  {/* User avatar — shown on right, first message in each group */}
                  {isUser && (
                    <div style={{ width: 30, flexShrink: 0 }}>
                      {isFirstInGroup ? <UserAvatar size={30} /> : null}
                    </div>
                  )}
                </div>
              </React.Fragment>
            )
          })}

          {/* Typing bubble */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 6 }}>
              <CharacterAvatar avatarId={selectedChar.avatarId} size={30} />
              <div style={{
                background: '#FFFFFF',
                borderRadius: '3px 12px 12px 12px',
                padding: '9px 14px',
                display: 'flex', gap: 4, alignItems: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
              }}>
                {[0,1,2].map(i => (
                  <div key={i} className="typing-dot" style={{
                    width: 5, height: 5, borderRadius: '50%', background: '#CCCCCC',
                    animationDelay: `${i * 0.22}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input bar ── */}
        <div
          style={{ background: '#FFFFFF', borderTop: '1px solid #E8E8E8', flexShrink: 0, position: 'relative' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Emoji picker */}
          {showEmoji && (
            <div style={{
              position: 'absolute', bottom: '100%', left: 0, right: 0,
              background: '#FAFAFA', borderTop: '1px solid #E8E8E8',
              padding: '10px 12px',
              display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 2,
              boxShadow: '0 -4px 16px rgba(0,0,0,0.07)',
            }}>
              {EMOJI_LIST.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setInput(prev => prev + emoji)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 22, padding: '5px 4px', borderRadius: 6, lineHeight: 1,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EFEFEF' }}
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
              background: '#FAFAFA', borderTop: '1px solid #E8E8E8',
              padding: '16px 20px 20px',
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
              boxShadow: '0 -4px 16px rgba(0,0,0,0.07)',
            }}>
              {MORE_ACTIONS.map(({ Icon, label, stub }) => (
                <button
                  key={label}
                  onClick={() => { showToast(stub); setShowMore(false) }}
                  style={{
                    background: 'none', border: 'none', borderRadius: 12,
                    padding: '0', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  }}
                >
                  <div style={{
                    width: 56, height: 56, background: '#F0F0F0', borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={24} color="#555555" />
                  </div>
                  <span style={{ fontSize: 11.5, color: '#666666' }}>{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Main input row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, padding: '8px 12px 10px' }}>
            <button
              onClick={() => showToast('语音消息功能开发中')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666666', padding: '5px 4px', flexShrink: 0, display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#333' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#666666' }}
            >
              <Mic size={18} />
            </button>

            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="发消息"
              rows={1}
              style={{
                flex: 1, border: '1px solid #E5E5E5', outline: 'none',
                background: '#FFFFFF', borderRadius: 8,
                padding: '7px 10px', fontSize: 14, color: '#1A1A1A',
                resize: 'none', fontFamily: 'inherit',
                maxHeight: 96, overflowY: 'auto', lineHeight: 1.5,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#C8C8C8' }}
              onBlur={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#E5E5E5' }}
            />

            <button
              onClick={() => { setShowEmoji(s => !s); setShowMore(false) }}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                color: showEmoji ? '#07C160' : '#666666',
                padding: '5px 4px', flexShrink: 0, display: 'flex', alignItems: 'center',
                transition: 'color 0.1s',
              }}
            >
              <Smile size={19} />
            </button>

            <button
              onClick={() => showToast('图片发送功能开发中')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666666', padding: '5px 4px', flexShrink: 0, display: 'flex', alignItems: 'center' }}
            >
              <Image size={19} />
            </button>

            {input.trim() ? (
              <button
                onClick={sendMessage}
                style={{
                  background: '#07C160', color: '#fff', border: 'none', borderRadius: '50%',
                  width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#06AD56' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#07C160' }}
              >
                <Send size={15} />
              </button>
            ) : (
              <button
                onClick={() => { setShowMore(s => !s); setShowEmoji(false) }}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer',
                  color: showMore ? '#07C160' : '#666666',
                  padding: '5px 4px', flexShrink: 0, display: 'flex', alignItems: 'center',
                  transition: 'color 0.1s',
                }}
              >
                <Plus size={19} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div onClick={closeAll} style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed', left: contextMenu.x, top: contextMenu.y,
              background: '#FFFFFF', borderRadius: 10,
              boxShadow: '0 6px 24px rgba(0,0,0,0.13)',
              overflow: 'hidden', minWidth: 152, zIndex: 301,
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {[
              {
                label: pinnedIds.includes(contextMenu.charId) ? '取消置顶' : '置顶',
                action: () => { setPinnedIds(prev => prev.includes(contextMenu.charId) ? prev.filter(x => x !== contextMenu.charId) : [...prev, contextMenu.charId]) },
              },
              {
                label: mutedIds.includes(contextMenu.charId) ? '取消免打扰' : '设为免打扰',
                action: () => { setMutedIds(prev => prev.includes(contextMenu.charId) ? prev.filter(x => x !== contextMenu.charId) : [...prev, contextMenu.charId]) },
              },
              { label: '标为已读', action: () => { setUnreadCounts(prev => ({ ...prev, [contextMenu.charId]: 0 })) } },
              { label: '删除',     action: () => { showToast('删除功能开发中') } },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                onClick={() => { item.action(); closeAll() }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 16px', background: 'none', border: 'none',
                  fontSize: 13.5, cursor: 'pointer',
                  color: item.label === '删除' ? '#FF3B30' : '#1A1A1A',
                  borderBottom: i < arr.length - 1 ? '1px solid #F2F2F2' : 'none',
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
