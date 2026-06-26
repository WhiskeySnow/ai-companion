'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, MessageCircle } from 'lucide-react'
import { CharacterAvatar } from '@/components/ui/CharacterAvatar'
import { useToast } from '@/components/ui/Toast'
import { mockCharacters, characterNameMap } from '@/lib/mockData'

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
  color: string
  strength: number // 0-1, controls line thickness
}

const nodes: NodeDef[] = [
  { id: 'user', label: '我', x: 400, y: 270, isUser: true },
  { id: '1', label: 'Luna', x: 190, y: 120, avatarId: 1 },
  { id: '2', label: 'Kai', x: 620, y: 120, avatarId: 2 },
  { id: '3', label: 'Aria', x: 190, y: 430, avatarId: 3 },
  { id: '4', label: 'Nox', x: 620, y: 430, avatarId: 4 },
]

const edges: EdgeDef[] = [
  { from: 'user', to: '1', relation: '挚友', color: '#FF8DB4', strength: 0.82 },
  { from: 'user', to: '2', relation: '好友', color: '#6B9EFF', strength: 0.71 },
  { from: 'user', to: '3', relation: '挚友', color: '#FF8DB4', strength: 0.90 },
  { from: 'user', to: '4', relation: '普通朋友', color: '#AAAAAA', strength: 0.54 },
  { from: '1', to: '3', relation: '好友', color: '#6B9EFF', strength: 0.80 },
  { from: '3', to: '4', relation: '朋友', color: '#FFB347', strength: 0.65 },
  { from: '2', to: '1', relation: '好友', color: '#6B9EFF', strength: 0.55 },
]

const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

// Simple recent interaction labels (no intimacy numbers)
const recentInteraction: Record<string, string> = {
  '1': '3天前 聊了天',
  '2': '今天 发来截图',
  '3': '今天 早上打招呼',
  '4': '周二 发了条消息',
}

const onlineDotColor: Record<string, string> = {
  '1': '#07C160',
  '2': '#07C160',
  '3': '#07C160',
  '4': '#AAAAAA',
}

const charRegion: Record<string, string> = {
  '1': '杭州',
  '2': '成都',
  '3': '北京',
  '4': '未知',
}

const RELATION_OPTIONS = ['好友', '挚友', '普通朋友', '朋友', '家人']

type PanelMode = 'node' | 'edge' | null

export default function NetworkPage() {
  const router = useRouter()
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedEdgeIdx, setSelectedEdgeIdx] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null)
  const [panelMode, setPanelMode] = useState<PanelMode>(null)
  const [edgeRelations, setEdgeRelations] = useState<string[]>(edges.map(e => e.relation))
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

  function getBezierPath(from: NodeDef, to: NodeDef) {
    const mx = (from.x + to.x) / 2
    const my = (from.y + to.y) / 2
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
            {['全部', '好友', '挚友', '普通朋友'].map((f, i) => (
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
            const strokeW = 1.5 + edge.strength * 3
            const isHovered = hoveredEdge === i
            const isSelected = selectedEdgeIdx === i

            return (
              <g key={i}>
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
                {(isHovered || isSelected) && (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect x={cx - 22} y={cy - 10} width={44} height={18} rx={6} fill="rgba(255,255,255,0.92)" />
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fill={edge.color} fontWeight="600">
                      {edgeRelations[i] || edge.relation}
                    </text>
                  </g>
                )}
                {!isHovered && !isSelected && (
                  <text x={cx} y={cy} textAnchor="middle" fontSize="9" fill={edge.color} opacity="0.6" style={{ pointerEvents: 'none' }}>
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
                {isSelected && !node.isUser && (
                  <circle r={r + 7} fill="none" stroke="#07C160" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
                )}
                <circle r={r} cx={1} cy={2} fill="rgba(0,0,0,0.08)" />
                <circle r={r} fill="#FFFFFF" stroke={node.isUser ? '#07C160' : '#E5E5E5'} strokeWidth={node.isUser ? 2.5 : 1.5} />
                {node.isUser && <circle r={r + 4} fill="none" stroke="#07C160" strokeWidth="1" opacity="0.3" />}

                {node.isUser ? (
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#1A1A1A">
                    我
                  </text>
                ) : (
                  <foreignObject x={-r} y={-r} width={r * 2} height={r * 2} style={{ overflow: 'visible', clipPath: `circle(${r}px)` }}>
                    <div style={{ width: r * 2, height: r * 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CharacterAvatar avatarId={node.avatarId!} size={r * 2} />
                    </div>
                  </foreignObject>
                )}

                {!node.isUser && (
                  <circle
                    cx={r - 5} cy={r - 5}
                    r={4.5}
                    fill={onlineDotColor[node.id] || '#CCCCCC'}
                    stroke="#FFFFFF" strokeWidth="1.5"
                  />
                )}

                <text y={r + 14} textAnchor="middle" fontSize="11" fontWeight="600" fill="#333">
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
            { label: '朋友', color: '#FFB347' },
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
        }}>
          {/* Close */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end',
            padding: '12px 16px', borderBottom: '1px solid #F0F0F0',
          }}>
            <button onClick={closePanel} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {/* ── Node panel ── */}
            {panelMode === 'node' && selectedChar && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                  <CharacterAvatar avatarId={selectedChar.avatarId} size={64} />
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A', marginTop: 10 }}>
                    {selectedChar.name}
                  </div>
                  {selectedChar.remark && (
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      {selectedChar.remark}
                    </div>
                  )}
                </div>

                {/* Info rows — no intimacy bar */}
                {[
                  { label: '关系', value: edges.find(e => (e.from === 'user' && e.to === selectedChar.id) || (e.to === 'user' && e.from === selectedChar.id))?.relation || '好友' },
                  { label: '地区', value: charRegion[selectedChar.id] || '未知' },
                  { label: '认识时间', value: `${selectedChar.daysSinceMet}天` },
                  {
                    label: '共同好友',
                    value: selectedChar.knowsCharacters.map(id => characterNameMap[id] ?? id).filter(Boolean).join('、') || '暂无',
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
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    }}
                  >
                    <MessageCircle size={15} /> 发消息
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
                  我 ↔ {otherChar?.name || '?'}
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

                {/* Recent interaction — replaces intimacy bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>最近互动</div>
                  <div style={{
                    background: '#F5F5F5', borderRadius: 8,
                    padding: '10px 14px', fontSize: 13, color: '#555',
                  }}>
                    {otherNodeId ? (recentInteraction[otherNodeId] || '暂无互动记录') : '—'}
                  </div>
                </div>

                {/* Save */}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
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
