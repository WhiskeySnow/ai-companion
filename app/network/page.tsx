'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import { mockCharacters } from '@/lib/mockData'

interface NodeDef {
  id: string
  label: string
  x: number
  y: number
  avatarId?: number
  isUser?: boolean
}

interface EdgeDef {
  from: string
  to: string
  relation: string
  intimacy: number
  color: string
  weekChange: number
}

interface RelationLog {
  date: string
  desc: string
  delta: number
}

const nodes: NodeDef[] = [
  { id: 'user', label: '我', x: 400, y: 270, isUser: true },
  { id: '1', label: 'Luna', x: 190, y: 120, avatarId: 1 },
  { id: '2', label: 'Kai', x: 620, y: 120, avatarId: 2 },
  { id: '3', label: 'Aria', x: 190, y: 430, avatarId: 3 },
  { id: '4', label: 'Nox', x: 620, y: 430, avatarId: 4 },
]

const edges: EdgeDef[] = [
  { from: 'user', to: '1', relation: '挚友', intimacy: 82, color: '#FF8DB4', weekChange: 3 },
  { from: 'user', to: '2', relation: '好友', intimacy: 71, color: '#6B9EFF', weekChange: 1 },
  { from: 'user', to: '3', relation: '挚友', intimacy: 90, color: '#FF8DB4', weekChange: 5 },
  { from: 'user', to: '4', relation: '普通朋友', intimacy: 54, color: '#AAAAAA', weekChange: 0 },
  { from: '1', to: '3', relation: '好友', intimacy: 80, color: '#6B9EFF', weekChange: 0 },
  { from: '3', to: '4', relation: '暧昧', intimacy: 65, color: '#FFB347', weekChange: 2 },
  { from: '2', to: '1', relation: '好友', intimacy: 55, color: '#6B9EFF', weekChange: 0 },
]

const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

const mockRelationLogs: Record<string, RelationLog[]> = {
  '1': [
    { date: '今天', desc: '聊了1小时，亲密度上升', delta: 2 },
    { date: '昨天', desc: 'Luna 分享了一首诗', delta: 3 },
    { date: '周一', desc: '互发动态评论', delta: 1 },
  ],
  '2': [
    { date: '今天', desc: 'Kai 发来游戏截图', delta: 1 },
    { date: '3天前', desc: '一起讨论游戏攻略', delta: 2 },
  ],
  '3': [
    { date: '今天', desc: 'Aria 关心你的近况', delta: 3 },
    { date: '昨天', desc: '分享了彼此的感受', delta: 2 },
    { date: '上周', desc: '第一次语音通话', delta: 5 },
  ],
  '4': [
    { date: '周二', desc: 'Nox 发来一句诗', delta: 0 },
  ],
}

type PanelMode = 'node' | 'edge' | null

export default function NetworkPage() {
  const router = useRouter()
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedEdgeIdx, setSelectedEdgeIdx] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null)
  const [panelMode, setPanelMode] = useState<PanelMode>(null)
  const [edgeRelations, setEdgeRelations] = useState<string[]>(edges.map(e => e.relation))
  const [edgeNotes, setEdgeNotes] = useState<Record<number, string>>({})
  const { showToast, ToastContainer } = useToast()

  function openNode(nodeId: string) {
    if (nodeId === 'user') return
    setSelectedNode(nodeId)
    setSelectedEdgeIdx(null)
    setPanelMode('node')
  }

  function openEdge(idx: number) {
    setSelectedEdgeIdx(idx)
    setSelectedNode(null)
    setPanelMode('edge')
  }

  function closePanel() {
    setSelectedNode(null)
    setSelectedEdgeIdx(null)
    setPanelMode(null)
  }

  const selectedChar = selectedNode ? mockCharacters.find(c => c.id === selectedNode) : null
  const selectedEdge = selectedEdgeIdx !== null ? edges[selectedEdgeIdx] : null
  const otherNodeId = selectedEdge
    ? (selectedEdge.from === 'user' ? selectedEdge.to : selectedEdge.from)
    : null
  const otherChar = otherNodeId ? mockCharacters.find(c => c.id === otherNodeId) : null

  const RELATION_OPTIONS = ['好友', '挚友', '普通朋友', '暧昧', '恋人', '家人']

  function getBezierPath(from: NodeDef, to: NodeDef) {
    const mx = (from.x + to.x) / 2
    const my = (from.y + to.y) / 2
    // offset control point perpendicular
    const dx = to.x - from.x
    const dy = to.y - from.y
    const len = Math.sqrt(dx * dx + dy * dy)
    const offset = len * 0.18
    const cx = mx - (dy / len) * offset
    const cy = my + (dx / len) * offset
    return { path: `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`, cx, cy }
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', overflow: 'hidden',
      background: '#F7F3EE',
    }}>
      <ToastContainer />

      {/* ─── Main graph ─── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
          background: 'rgba(247,243,238,0.9)', backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E8E2DA',
        }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A' }}>关系网</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {['全部', '好友', '暧昧', '挚友'].map((f, i) => (
              <button key={f} style={{
                border: i === 0 ? '1px solid #07C160' : '1px solid #D5CFC8',
                background: i === 0 ? 'rgba(7,193,96,0.1)' : 'transparent',
                color: i === 0 ? '#07C160' : '#888',
                borderRadius: 20, padding: '4px 14px', fontSize: 12, cursor: 'pointer',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* SVG */}
        <svg
          viewBox="0 0 800 560"
          style={{ width: '100%', height: '100%' }}
          onClick={closePanel}
        >
          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodeMap[edge.from]
            const to = nodeMap[edge.to]
            const { path, cx, cy } = getBezierPath(from, to)
            const strokeW = 1.5 + (edge.intimacy / 100) * 3
            const isHovered = hoveredEdge === i
            const isSelected = selectedEdgeIdx === i

            return (
              <g key={i}>
                {/* Hover hit area */}
                <path
                  d={path}
                  stroke="transparent"
                  strokeWidth={16}
                  fill="none"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredEdge(i)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  onClick={e => { e.stopPropagation(); openEdge(i) }}
                />
                <path
                  d={path}
                  stroke={edge.color}
                  strokeWidth={isSelected ? strokeW + 2 : isHovered ? strokeW + 1 : strokeW}
                  strokeOpacity={isSelected || isHovered ? 0.85 : 0.4}
                  fill="none"
                  strokeLinecap="round"
                  style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s', pointerEvents: 'none' }}
                />
                {/* Label at curve midpoint */}
                {(isHovered || isSelected) && (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect
                      x={cx - 20} y={cy - 10} width={40} height={18}
                      rx={6} fill="rgba(255,255,255,0.92)"
                    />
                    <text
                      x={cx} y={cy + 4}
                      textAnchor="middle"
                      fontSize="10"
                      fill={edge.color}
                      fontWeight="600"
                    >
                      {edgeRelations[i] || edge.relation}
                    </text>
                  </g>
                )}
                {/* Always-visible small label */}
                {!isHovered && !isSelected && (
                  <text
                    x={cx} y={cy}
                    textAnchor="middle"
                    fontSize="9"
                    fill={edge.color}
                    opacity="0.6"
                    style={{ pointerEvents: 'none' }}
                  >
                    {edgeRelations[i] || edge.relation}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isSelected = selectedNode === node.id || (selectedEdge && (selectedEdge.from === node.id || selectedEdge.to === node.id))
            const isHovered = hoveredNode === node.id
            const scale = isHovered || isSelected ? 1.12 : 1
            const r = node.isUser ? 30 : 26

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y}) scale(${scale})`}
                onClick={e => { e.stopPropagation(); openNode(node.id) }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: node.isUser ? 'default' : 'pointer', transition: 'transform 0.15s' }}
              >
                {/* Selection ring */}
                {isSelected && !node.isUser && (
                  <circle r={r + 7} fill="none" stroke="#07C160" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
                )}

                {/* Shadow */}
                <circle r={r} cx={1} cy={2} fill="rgba(0,0,0,0.08)" />

                {/* White bg */}
                <circle r={r} fill="#FFFFFF" stroke={node.isUser ? '#07C160' : '#E5E5E5'} strokeWidth={node.isUser ? 2.5 : 1.5} />

                {/* Green ring for user */}
                {node.isUser && <circle r={r + 4} fill="none" stroke="#07C160" strokeWidth="1" opacity="0.3" />}

                {/* Avatar content */}
                {node.isUser ? (
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#1A1A1A">
                    我
                  </text>
                ) : (
                  // Use foreignObject to embed CharacterAvatar SVG scaled to fit
                  <foreignObject x={-r} y={-r} width={r * 2} height={r * 2} style={{ overflow: 'visible', clipPath: `circle(${r}px)` }}>
                    <div style={{ width: r * 2, height: r * 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CharacterAvatar avatarId={node.avatarId!} size={r * 2} />
                    </div>
                  </foreignObject>
                )}

                {/* Online indicator dot */}
                {!node.isUser && (
                  <circle
                    cx={r - 5} cy={r - 5}
                    r={4.5}
                    fill={node.id === '4' ? '#AAAAAA' : '#07C160'}
                    stroke="#FFFFFF" strokeWidth="1.5"
                  />
                )}

                {/* Label below */}
                <text
                  y={r + 14}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#333"
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: 24, left: 24,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 10, padding: '10px 14px',
          border: '1px solid #E8E2DA',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>关系类型</div>
          {[
            { label: '好友', color: '#6B9EFF' },
            { label: '挚友', color: '#FF8DB4' },
            { label: '暧昧', color: '#FFB347' },
            { label: '普通朋友', color: '#AAAAAA' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 22, height: 2.5, background: item.color, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#555' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right panel ─── */}
      {panelMode && (
        <div style={{
          width: 300, background: '#FFFFFF',
          borderLeft: '1px solid #E8E2DA',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '-2px 0 10px rgba(0,0,0,0.05)',
          transform: 'translateX(0)',
          transition: 'transform 0.2s ease',
        }}>
          {/* Close */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end',
            padding: '12px 16px', borderBottom: '1px solid #F0F0F0',
          }}>
            <button onClick={closePanel} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', fontSize: 18 }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {/* ── Node panel ── */}
            {panelMode === 'node' && selectedChar && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                  <CharacterAvatar avatarId={selectedChar.avatarId} size={64} />
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A', marginTop: 10 }}>{selectedChar.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{selectedChar.status}</div>
                </div>

                {/* Intimacy */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#888' }}>
                    <span>亲密度</span>
                    <span style={{ fontWeight: 600, color: '#1A1A1A' }}>{selectedChar.intimacy}/100</span>
                  </div>
                  <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${selectedChar.intimacy}%`,
                      background: '#07C160', borderRadius: 3,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  {selectedChar.intimacyChange > 0 && (
                    <div style={{ fontSize: 11, color: '#07C160', marginTop: 4 }}>
                      本周 +{selectedChar.intimacyChange}
                    </div>
                  )}
                </div>

                {/* Info rows */}
                {[
                  { label: '最近互动', value: selectedChar.lastSeen },
                  { label: '关系', value: selectedChar.relationship },
                  {
                    label: '共同朋友',
                    value: selectedChar.knowsCharacters.map(id => mockCharacters.find(c => c.id === id)?.name).filter(Boolean).join('、') || '暂无',
                  },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: '1px solid #F5F5F5', fontSize: 13,
                  }}>
                    <span style={{ color: '#888' }}>{item.label}</span>
                    <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button
                    onClick={() => router.push('/messages')}
                    style={{
                      flex: 1, background: '#07C160', color: '#fff',
                      border: 'none', borderRadius: 10, padding: '10px',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    发消息
                  </button>
                  <button
                    onClick={() => router.push('/contacts')}
                    style={{
                      flex: 1, background: '#F5F5F5', color: '#1A1A1A',
                      border: '1px solid #E5E5E5', borderRadius: 10, padding: '10px',
                      fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    查看资料
                  </button>
                </div>
              </>
            )}

            {/* ── Edge panel ── */}
            {panelMode === 'edge' && selectedEdge && selectedEdgeIdx !== null && (
              <>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1A1A1A', marginBottom: 16, textAlign: 'center' }}>
                  我 ↔ {otherChar?.name || '?'} 的关系
                </div>

                {/* Relation type */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>关系类型</div>
                  <select
                    value={edgeRelations[selectedEdgeIdx] || selectedEdge.relation}
                    onChange={e => setEdgeRelations(prev => {
                      const next = [...prev]
                      next[selectedEdgeIdx] = e.target.value
                      return next
                    })}
                    style={{
                      width: '100%', border: '1px solid #E5E5E5', borderRadius: 8,
                      padding: '8px 12px', fontSize: 14, outline: 'none',
                      background: '#FAFAFA', cursor: 'pointer', color: '#1A1A1A',
                    }}
                  >
                    {RELATION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Intimacy slider */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#888' }}>亲密度</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{selectedEdge.intimacy}</span>
                    {selectedEdge.weekChange > 0 && (
                      <span style={{ fontSize: 11, color: '#07C160' }}>+{selectedEdge.weekChange} 本周</span>
                    )}
                  </div>
                  <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${selectedEdge.intimacy}%`,
                      background: selectedEdge.color, borderRadius: 3,
                    }} />
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>关系备注</div>
                  <textarea
                    value={edgeNotes[selectedEdgeIdx] || ''}
                    onChange={e => setEdgeNotes(prev => ({ ...prev, [selectedEdgeIdx]: e.target.value }))}
                    placeholder="记录一些关于这段关系的想法..."
                    rows={2}
                    style={{
                      width: '100%', border: '1px solid #E5E5E5', borderRadius: 8,
                      padding: '8px 10px', fontSize: 13, outline: 'none',
                      resize: 'none', fontFamily: 'inherit', color: '#1A1A1A',
                      background: '#FAFAFA', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Relation logs */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>关系日志</div>
                  {(mockRelationLogs[otherNodeId || ''] || []).map((log, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      padding: '6px 0', borderBottom: '1px solid #F5F5F5', fontSize: 12,
                    }}>
                      <div>
                        <span style={{ color: '#888', marginRight: 6 }}>· {log.date}</span>
                        <span style={{ color: '#555' }}>{log.desc}</span>
                      </div>
                      {log.delta > 0 && (
                        <span style={{ color: '#07C160', flexShrink: 0, marginLeft: 8 }}>+{log.delta}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Save / Delete */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => { showToast('已保存'); closePanel() }}
                    style={{
                      flex: 1, background: '#07C160', color: '#fff',
                      border: 'none', borderRadius: 10, padding: '10px',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    保存
                  </button>
                  <button
                    onClick={() => showToast('删除关系功能开发中')}
                    style={{
                      flex: 1, background: '#FEF2F2', color: '#FF4444',
                      border: '1px solid #FECACA', borderRadius: 10, padding: '10px',
                      fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    删除关系
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
