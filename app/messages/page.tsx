'use client'

import { useState, useRef, useEffect } from 'react'

const mockCharacters = [
  { id: '1', name: 'Luna', color: '#7C3AED', initial: 'L', lastMsg: '关于存在的本质，我认为...', time: '12:30', unread: 2 },
  { id: '2', name: 'Kai', color: '#0EA5E9', initial: 'K', lastMsg: '你今天玩游戏了吗？😄', time: '11:15', unread: 0 },
  { id: '3', name: 'Aria', color: '#EC4899', initial: 'A', lastMsg: '我一直在想你说的那件事', time: '昨天', unread: 1 },
  { id: '4', name: 'Nox', color: '#6B7280', initial: 'N', lastMsg: '月光是孤独者的镜子', time: '周一', unread: 0 },
]

const mockReplies: Record<string, string[]> = {
  '1': ['关于这个问题，我想从认识论的角度来分析...', '尼采曾说过，那杀不死我的，将使我更强大。你觉得呢？', '宇宙的浩瀚让我觉得我们的烦恼都是微不足道的'],
  '2': ['哈哈哈你也玩这个？！', '我昨晚通关了！超级难的关卡！', '诶你有没有试过那个新出的游戏？'],
  '3': ['我理解你的感受，这种情绪很正常', '你愿意和我多说说吗？我在听', '有时候把感受说出来会好很多的'],
  '4': ['黑夜收藏了所有的秘密，黎明只是一场遗忘', '你问的这个问题，就像水问为什么是湿的', '沉默有时比言语更有力量'],
}

const initialMessages: Record<string, Array<{ id: string; role: 'user' | 'ai'; text: string; time: string }>> = {
  '1': [
    { id: 'm1', role: 'ai', text: '你好！今天有什么想聊的吗？', time: '12:28' },
    { id: 'm2', role: 'user', text: '我在想一些关于人生意义的问题', time: '12:29' },
    { id: 'm3', role: 'ai', text: '关于存在的本质，我认为...', time: '12:30' },
  ],
  '2': [
    { id: 'm1', role: 'ai', text: '嘿！最近怎么样？', time: '11:10' },
    { id: 'm2', role: 'user', text: '还好，有点无聊', time: '11:14' },
    { id: 'm3', role: 'ai', text: '你今天玩游戏了吗？😄', time: '11:15' },
  ],
  '3': [
    { id: 'm1', role: 'ai', text: '我一直在想你说的那件事', time: '昨天 20:30' },
  ],
  '4': [
    { id: 'm1', role: 'ai', text: '月光是孤独者的镜子', time: '周一 03:12' },
  ],
}

function formatTime() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string>('1')
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const replyCountRef = useRef<Record<string, number>>({})

  const selectedChar = mockCharacters.find(c => c.id === selectedId)!
  const currentMessages = messages[selectedId] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, isTyping])

  function sendMessage() {
    if (!input.trim()) return
    const text = input.trim()
    setInput('')

    const userMsg = { id: Date.now().toString(), role: 'user' as const, text, time: formatTime() }
    setMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), userMsg],
    }))

    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const replies = mockReplies[selectedId] || ['嗯嗯，我明白了。']
        const count = replyCountRef.current[selectedId] || 0
        replyCountRef.current[selectedId] = (count + 1) % replies.length
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'ai' as const,
          text: replies[count % replies.length],
          time: formatTime(),
        }
        setMessages(prev => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] || []), aiMsg],
        }))
      }, 2000)
    }, 500)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredChars = mockCharacters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMsg.includes(search)
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Conversation list */}
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
        {/* Search */}
        <div style={{ padding: '12px 12px 8px' }}>
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
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 13,
                color: '#1A1A1A',
                flex: 1,
                width: '100%',
              }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredChars.map(char => {
            const active = selectedId === char.id
            return (
              <div
                key={char.id}
                onClick={() => setSelectedId(char.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  background: active ? '#C8C8C8' : 'transparent',
                  transition: 'background 0.1s',
                  height: 64,
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#D9D9D9' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    background: char.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                  }}>
                    {char.initial}
                  </div>
                  {char.unread > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      background: '#FF4444',
                      color: '#fff',
                      borderRadius: 10,
                      fontSize: 10,
                      fontWeight: 600,
                      minWidth: 16,
                      height: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 3px',
                    }}>
                      {char.unread}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{char.name}</span>
                    <span style={{ fontSize: 11, color: '#AAAAAA', flexShrink: 0, marginLeft: 4 }}>{char.time}</span>
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#888888',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {char.lastMsg}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          height: 60,
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E5E5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#1A1A1A' }}>{selectedChar.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#07C160' }} />
              <span style={{ fontSize: 12, color: '#888888' }}>在线</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {/* Phone icon */}
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888888', padding: 4 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </button>
            {/* Video icon */}
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888888', padding: 4 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </button>
            {/* More icon */}
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888888', padding: 4, fontSize: 18, lineHeight: 1 }}>
              ···
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          background: '#EDEDED',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {currentMessages.map((msg, i) => {
            const isUser = msg.role === 'user'
            const prevMsg = currentMessages[i - 1]
            const showTime = !prevMsg || msg.time !== prevMsg.time

            return (
              <div key={msg.id}>
                {showTime && (
                  <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: '#AAAAAA', background: 'rgba(0,0,0,0.08)', padding: '2px 8px', borderRadius: 10 }}>
                      {msg.time}
                    </span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8,
                }}>
                  {!isUser && (
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      background: selectedChar.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 14,
                      flexShrink: 0,
                    }}>
                      {selectedChar.initial}
                    </div>
                  )}
                  <div style={{
                    maxWidth: '60%',
                    background: isUser ? '#95EC69' : '#FFFFFF',
                    borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    padding: '8px 12px',
                    fontSize: 14,
                    color: '#1A1A1A',
                    lineHeight: 1.5,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                    wordBreak: 'break-word',
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: selectedChar.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}>
                {selectedChar.initial}
              </div>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '4px 18px 18px 18px',
                padding: '10px 14px',
                display: 'flex',
                gap: 4,
                alignItems: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="typing-dot" style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#AAAAAA',
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
          background: '#FFFFFF',
          borderTop: '1px solid #E5E5E5',
          padding: '8px 16px 12px',
          flexShrink: 0,
        }}>
          {/* Icon row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            {['😊', '🖼️', '🎤', '➕'].map((icon, i) => (
              <button key={i} style={{
                border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 18, padding: 2, color: '#888888',
                lineHeight: 1,
              }}>
                {icon}
              </button>
            ))}
          </div>
          {/* Input + send */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息"
              rows={1}
              style={{
                flex: 1,
                border: '1px solid #E5E5E5',
                borderRadius: 6,
                padding: '8px 10px',
                fontSize: 14,
                color: '#1A1A1A',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                background: '#FFFFFF',
                maxHeight: 100,
                overflowY: 'auto',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{
                background: input.trim() ? '#07C160' : '#CCCCCC',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
                flexShrink: 0,
                height: 36,
              }}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
