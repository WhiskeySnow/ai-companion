'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, X, Globe } from 'lucide-react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import { mockWorlds, mockCharacters, characterAvatarMap, type MockWorld } from '@/lib/mockData'

const sourceTypeLabel: Record<string, string> = {
  original: '原创',
  imported: '导入',
  fanmade: '同人',
}

function WorldDetail({ world, onClose }: { world: MockWorld; onClose?: () => void }) {
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()
  const worldChars = mockCharacters.filter(c => world.characterIds.includes(c.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <ToastContainer />
      {/* Cover */}
      <div style={{
        height: 160, flexShrink: 0,
        background: world.coverGradient,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', gap: 10,
      }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(255,255,255,0.2)', border: 'none',
              borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
            }}
          >
            <X size={14} />
          </button>
        )}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>{world.name}</h1>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', padding: '0 16px' }}>
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

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#FFFFFF' }}>
        {/* Description */}
        <div style={{ padding: '16px 20px 8px' }}>
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, margin: 0 }}>{world.description}</p>
        </div>

        {/* Characters */}
        {worldChars.length > 0 && (
          <Section title="角色">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '0 20px 4px' }}>
              {worldChars.map(char => (
                <div key={char.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                  onClick={() => showToast(`查看 ${char.name} 的资料`)}>
                  <CharacterAvatar avatarId={characterAvatarMap[char.id] ?? 1} size={48} />
                  <span style={{ fontSize: 11, color: '#555' }}>{char.remark || char.name}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Rules */}
        {world.rules.length > 0 && (
          <Section title="世界规则">
            <div style={{ padding: '0 20px 4px' }}>
              {world.rules.map((rule, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                    background: '#F3F4F6', fontSize: 11, fontWeight: 600,
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
            <div style={{ padding: '0 20px 4px', position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 27, top: 0, bottom: 0, width: 2,
                background: '#E5E7EB', borderRadius: 1,
              }} />
              {world.timeline.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16, position: 'relative' }}>
                  <div style={{
                    flexShrink: 0, width: 14, height: 14, borderRadius: '50%',
                    background: '#7C3AED', border: '2.5px solid #fff',
                    boxShadow: '0 0 0 2px #DDD6FE',
                    marginTop: 3, position: 'relative', zIndex: 1,
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1A1A1A', marginBottom: 2 }}>{item.era}</div>
                    <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{item.description}</div>
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
              gap: 10, padding: '0 20px 4px',
            }}>
              {world.locations.map((loc, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: '#F9FAFB', borderRadius: 10, padding: '10px 12px',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: loc.color,
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1A1A1A', marginBottom: 2 }}>{loc.name}</div>
                    <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>{loc.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Empty world */}
        {world.rules.length === 0 && world.timeline.length === 0 && world.locations.length === 0 && worldChars.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
            <Globe size={40} color="#D1D5DB" />
            <p style={{ marginTop: 12, fontSize: 14 }}>这个世界还是空白的</p>
            <p style={{ fontSize: 12, color: '#BBB' }}>开始添加角色、规则和地点</p>
          </div>
        )}

        {/* Bottom actions */}
        <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => showToast('进入世界功能开发中')}
            style={{
              width: '100%', background: '#07C160', color: '#fff',
              border: 'none', borderRadius: 10, padding: '12px',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}
          >
            进入世界
          </button>
          <button
            onClick={() => showToast('编辑世界功能开发中')}
            style={{
              width: '100%', background: '#F3F4F6', color: '#555',
              border: 'none', borderRadius: 10, padding: '10px',
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{
        padding: '12px 20px 8px',
        fontSize: 12, fontWeight: 600, color: '#999',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        borderTop: '1px solid #F3F4F6',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export default function WorldsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const { showToast, ToastContainer } = useToast()

  const filteredWorlds = mockWorlds.filter(w =>
    w.name.includes(search) || w.tags.some(t => t.includes(search)) || w.description.includes(search)
  )

  const selectedWorld = mockWorlds.find(w => w.id === selectedId) ?? null

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <ToastContainer />

      {/* Left panel — world list */}
      <div style={{
        width: 280, flexShrink: 0,
        background: '#F5F5F5',
        boxShadow: 'inset -1px 0 0 #E5E5E5',
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 12px 10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A' }}>世界</span>
            <button
              onClick={() => showToast('创建世界功能开发中')}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                color: '#07C160', fontSize: 12, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 3, padding: '4px 6px',
              }}
            >
              <Plus size={14} />
              创建世界
            </button>
          </div>
          {/* Search */}
          <div style={{
            background: '#E8E8E8', borderRadius: 6,
            display: 'flex', alignItems: 'center', padding: '6px 10px', gap: 6,
          }}>
            <Search size={13} color="#AAAAAA" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索世界"
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#1A1A1A', flex: 1 }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* World list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredWorlds.map(world => {
            const active = selectedId === world.id
            const charCount = world.characterIds.length
            return (
              <div
                key={world.id}
                onClick={() => setSelectedId(world.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 12px',
                  cursor: 'pointer', height: 72,
                  background: active ? '#E8E8E8' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#F0F0F0' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                {/* Gradient cover thumbnail */}
                <div style={{
                  width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                  background: world.coverGradient,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', marginBottom: 2 }}>
                    {world.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#999', marginBottom: 1 }}>
                    {world.tags.join(' · ')}
                  </div>
                  <div style={{ fontSize: 11, color: '#AAAAAA' }}>
                    {charCount}个角色
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel — detail */}
      <div style={{ flex: 1, height: '100vh', overflow: 'hidden' }}>
        {selectedWorld ? (
          <WorldDetail world={selectedWorld} />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: 12, color: '#999',
          }}>
            <Globe size={48} color="#D1D5DB" />
            <span style={{ fontSize: 16, fontWeight: 500 }}>选择一个世界</span>
            <span style={{ fontSize: 13, color: '#BBB' }}>从左侧选择世界，或创建一个新世界</span>
          </div>
        )}
      </div>
    </div>
  )
}
