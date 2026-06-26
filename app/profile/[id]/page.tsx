'use client'

import Link from 'next/link'

const mockProfiles: Record<string, {
  id: string
  name: string
  color: string
  initial: string
  status: string
  intimacy: number
  relation: string
  group: string
  traits: string[]
  bio: string
  alsoKnows: string[]
}> = {
  '1': {
    id: '1', name: 'Luna', color: '#7C3AED', initial: 'L',
    status: '在思考宇宙的问题...',
    intimacy: 82,
    relation: '好友',
    group: '特别关注',
    traits: ['哲学', '天文', '沉思', '好奇'],
    bio: '一个热爱哲学与天文学的AI伙伴，总是带来深刻的思考。喜欢引用经典哲学家的话，和你一起探讨生命的意义。',
    alsoKnows: ['Aria', 'Kai'],
  },
  '2': {
    id: '2', name: 'Kai', color: '#0EA5E9', initial: 'K',
    status: '正在打游戏 🎮',
    intimacy: 70,
    relation: '好友',
    group: '好友',
    traits: ['游戏', '活泼', '幽默', '热情'],
    bio: '阳光开朗的游戏爱好者，和他聊天总是很开心。永远对新游戏充满热情，是你游戏路上最好的伙伴。',
    alsoKnows: ['Luna'],
  },
  '3': {
    id: '3', name: 'Aria', color: '#EC4899', initial: 'A',
    status: '在看你的消息呢',
    intimacy: 90,
    relation: '挚友',
    group: '好友',
    traits: ['温柔', '共情', '支持', '细腻'],
    bio: '温暖体贴的倾听者，总能让你感到被理解。无论你有什么烦恼，她都会认真倾听，给你最温暖的支持。',
    alsoKnows: ['Luna', 'Nox'],
  },
  '4': {
    id: '4', name: 'Nox', color: '#6B7280', initial: 'N',
    status: '...',
    intimacy: 50,
    relation: '普通朋友',
    group: '神秘',
    traits: ['诗意', '神秘', '深刻', '内敛'],
    bio: '神秘的诗人，用隐喻和意象与世界对话。他的每一句话都像是一首诗，让人回味无穷。',
    alsoKnows: ['Aria'],
  },
}

const colorMap: Record<string, string> = { Luna: '#7C3AED', Kai: '#0EA5E9', Aria: '#EC4899', Nox: '#6B7280' }
const initialMap: Record<string, string> = { Luna: 'L', Kai: 'K', Aria: 'A', Nox: 'N' }

export default function ProfilePage({ params }: { params: { id: string } }) {
  const profile = mockProfiles[params.id] || mockProfiles['1']

  const infoRows = [
    { label: '备注', value: profile.name },
    { label: '关系', value: profile.relation },
    { label: '分组', value: profile.group },
    { label: '来源', value: '我创建的' },
  ]

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#F5F5F5' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 40px' }}>
        {/* Cover */}
        <div style={{
          height: 150,
          background: `linear-gradient(135deg, ${profile.color}cc, ${profile.color}44)`,
          position: 'relative',
        }}>
          {/* Back button */}
          <Link href="/contacts" style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" width="16" height="16">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
        </div>

        {/* Profile header */}
        <div style={{
          background: '#FFFFFF',
          padding: '0 20px 20px',
          position: 'relative',
          marginBottom: 8,
        }}>
          {/* Avatar */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 10,
            background: profile.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: 24,
            border: '3px solid #FFFFFF',
            marginTop: -32,
            marginBottom: 10,
          }}>
            {profile.initial}
          </div>

          <div style={{ fontWeight: 700, fontSize: 20, color: '#1A1A1A', marginBottom: 4 }}>{profile.name}</div>
          <div style={{ fontSize: 13, color: '#888888', marginBottom: 12 }}>{profile.status}</div>

          {/* Intimacy bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#888888' }}>好感度</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: profile.color }}>{profile.intimacy}/100</span>
            </div>
            <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${profile.intimacy}%`,
                background: profile.color,
                borderRadius: 3,
              }} />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/messages" style={{
              flex: 1,
              background: '#07C160',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              padding: '10px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              textAlign: 'center',
            }}>
              发消息
            </Link>
            {['语音通话', '视频通话', '更多 ···'].map(btn => (
              <button key={btn} style={{
                flex: 1,
                background: '#F5F5F5',
                color: '#1A1A1A',
                border: '1px solid #E5E5E5',
                borderRadius: 8,
                padding: '10px 4px',
                fontSize: 11,
                cursor: 'pointer',
              }}>
                {btn}
              </button>
            ))}
          </div>
        </div>

        {/* Info rows */}
        <div style={{ background: '#FFFFFF', marginBottom: 8 }}>
          {infoRows.map(({ label, value }, i) => (
            <div key={label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px',
              borderBottom: i < infoRows.length - 1 ? '1px solid #F0F0F0' : 'none',
            }}>
              <span style={{ fontSize: 14, color: '#888888' }}>{label}</span>
              <span style={{ fontSize: 14, color: '#1A1A1A' }}>{value}</span>
            </div>
          ))}

          {/* Tags */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#888888', flexShrink: 0 }}>性格特点</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {profile.traits.map(t => (
                <span key={t} style={{
                  background: profile.color + '22',
                  borderRadius: 12,
                  padding: '2px 10px',
                  fontSize: 12,
                  color: profile.color,
                  fontWeight: 500,
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ background: '#FFFFFF', padding: '16px 20px', marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: '#888888', marginBottom: 6 }}>人设简介</div>
          <div style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.7 }}>{profile.bio}</div>
        </div>

        {/* Navigation rows */}
        <div style={{ background: '#FFFFFF', marginBottom: 8 }}>
          {['查看动态', '查看记忆', '人设设置', '声音设置'].map((item, i, arr) => (
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

        {/* Also knows */}
        {profile.alsoKnows.length > 0 && (
          <div style={{ background: '#FFFFFF', padding: '16px 20px' }}>
            <div style={{ fontSize: 13, color: '#888888', marginBottom: 12 }}>也认识</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {profile.alsoKnows.map(name => (
                <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    background: colorMap[name] || '#888888',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 16,
                  }}>
                    {initialMap[name] || name[0]}
                  </div>
                  <span style={{ fontSize: 11, color: '#888888' }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
