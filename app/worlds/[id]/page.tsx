'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Globe } from 'lucide-react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import { mockWorlds, mockCharacters, characterAvatarMap } from '@/lib/mockData'

const sourceTypeLabel: Record<string, string> = {
  original: '原创',
  imported: '导入',
  fanmade: '同人',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{
        padding: '12px 20px 8px',
        fontSize: 12, fontWeight: 600, color: '#999',
        textTransform: 'uppercase' as const, letterSpacing: '0.05em',
        borderTop: '1px solid #F3F4F6',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export default function WorldDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { showToast, ToastContainer } = useToast()

  const world = mockWorlds.find(w => w.id === id)
  const worldChars = world ? mockCharacters.filter(c => world.characterIds.includes(c.id)) : []

  if (!world) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12, color: '#999' }}>
        <Globe size={48} color="#D1D5DB" />
        <p style={{ fontSize: 16 }}>世界不存在</p>
        <button onClick={() => router.push('/worlds')} style={{ border: 'none', background: '#07C160', color: '#fff', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontSize: 14 }}>
          返回世界列表
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', minHeight: '100vh', background: '#FFFFFF' }}>
      <ToastContainer />

      {/* Cover */}
      <div style={{
        height: 180, background: world.coverGradient,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', gap: 10,
      }}>
        <button
          onClick={() => router.push('/worlds')}
          style={{
            position: 'absolute', top: 16, left: 16,
            background: 'rgba(255,255,255,0.2)', border: 'none',
            borderRadius: 8, padding: '6px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            cursor: 'pointer', color: '#fff', fontSize: 13,
          }}
        >
          <ArrowLeft size={16} />
          返回
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: 0 }}>{world.name}</h1>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', padding: '0 20px' }}>
          <span style={{
            border: '1.5px solid rgba(255,255,255,0.8)', color: '#fff',
            borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 500,
          }}>
            {sourceTypeLabel[world.sourceType] ?? world.sourceType}
          </span>
          {world.tags.map(tag => (
            <span key={tag} style={{
              background: 'rgba(255,255,255,0.18)', color: '#fff',
              borderRadius: 20, padding: '2px 10px', fontSize: 11,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div>
        {/* Description */}
        <div style={{ padding: '16px 24px 8px' }}>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 }}>{world.description}</p>
        </div>

        {/* Characters */}
        {worldChars.length > 0 && (
          <Section title="角色">
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '0 24px 4px' }}>
              {worldChars.map(char => (
                <div key={char.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                  onClick={() => showToast(`查看 ${char.name} 的资料`)}>
                  <CharacterAvatar avatarId={characterAvatarMap[char.id] ?? 1} size={52} />
                  <span style={{ fontSize: 12, color: '#555' }}>{char.remark || char.name}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Rules */}
        {world.rules.length > 0 && (
          <Section title="世界规则">
            <div style={{ padding: '0 24px 4px' }}>
              {world.rules.map((rule, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                    background: '#F3F4F6', fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666',
                    marginTop: 1,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.7 }}>{rule}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Timeline */}
        {world.timeline.length > 0 && (
          <Section title="时间线">
            <div style={{ padding: '0 24px 4px', position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 31, top: 0, bottom: 0, width: 2,
                background: '#E5E7EB', borderRadius: 1,
              }} />
              {world.timeline.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 18, position: 'relative' }}>
                  <div style={{
                    flexShrink: 0, width: 14, height: 14, borderRadius: '50%',
                    background: '#7C3AED', border: '2.5px solid #fff',
                    boxShadow: '0 0 0 2px #DDD6FE',
                    marginTop: 4, position: 'relative', zIndex: 1,
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', marginBottom: 3 }}>{item.era}</div>
                    <div style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Locations */}
        {world.locations.length > 0 && (
          <Section title="地点">
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 12, padding: '0 24px 4px',
            }}>
              {world.locations.map((loc, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  background: '#F9FAFB', borderRadius: 12, padding: '12px 14px',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    background: loc.color,
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', marginBottom: 3 }}>{loc.name}</div>
                    <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{loc.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Bottom actions */}
        <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => showToast('进入世界功能开发中')}
            style={{
              width: '100%', background: '#07C160', color: '#fff',
              border: 'none', borderRadius: 12, padding: '14px',
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
            }}
          >
            进入世界
          </button>
          <button
            onClick={() => showToast('编辑世界功能开发中')}
            style={{
              width: '100%', background: '#F3F4F6', color: '#555',
              border: 'none', borderRadius: 12, padding: '12px',
              fontSize: 14, cursor: 'pointer',
            }}
          >
            编辑世界
          </button>
        </div>
      </div>
    </div>
  )
}
