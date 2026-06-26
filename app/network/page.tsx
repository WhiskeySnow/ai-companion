'use client'

import { useState } from 'react'
import Link from 'next/link'

const nodes = [
  { id: 'user', label: '我', x: 400, y: 280, size: 50, color: '#07C160' },
  { id: 'luna', label: 'Luna', x: 200, y: 130, size: 40, color: '#7C3AED' },
  { id: 'kai', label: 'Kai', x: 600, y: 130, size: 40, color: '#0EA5E9' },
  { id: 'aria', label: 'Aria', x: 200, y: 430, size: 40, color: '#EC4899' },
  { id: 'nox', label: 'Nox', x: 600, y: 430, size: 40, color: '#6B7280' },
]

const edges = [
  { from: 'user', to: 'luna', relation: '好友', intimacy: 80, color: '#7C3AED' },
  { from: 'user', to: 'kai', relation: '好友', intimacy: 70, color: '#0EA5E9' },
  { from: 'user', to: 'aria', relation: '挚友', intimacy: 90, color: '#EC4899' },
  { from: 'user', to: 'nox', relation: '普通朋友', intimacy: 50, color: '#6B7280' },
  { from: 'luna', to: 'aria', relation: '闺蜜', intimacy: 85, color: '#A855F7' },
  { from: 'aria', to: 'nox', relation: '暧昧', intimacy: 75, color: '#F59E0B' },
  { from: 'kai', to: 'luna', relation: '朋友', intimacy: 60, color: '#60A5FA' },
]

const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

const charInfo: Record<string, { status: string; lastChat: string }> = {
  luna: { status: '在思考宇宙的问题...', lastChat: '2天前聊过天' },
  kai: { status: '正在打游戏 🎮', lastChat: '3天前聊过天' },
  aria: { status: '在看你的消息呢', lastChat: '1天前聊过天' },
  nox: { status: '...', lastChat: '5天前聊过天' },
}

export default function NetworkPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null)

  const selected = selectedNode ? nodeMap[selectedNode] : null
  const selectedInfo = selectedNode ? charInfo[selectedNode] : null
  const selectedEdge = selectedNode
    ? edges.find(e => (e.from === selectedNode && e.to === 'user') || (e.to === selectedNode && e.from === 'user'))
    : null

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: '#1A1A2E' }}>
      {/* Main graph area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
          background: 'rgba(26,26,46,0.9)', backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16 }}>关系网</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['全部', '好友', '暧昧', '挚友'].map((f, i) => (
              <button key={f} style={{
                border: i === 0 ? '1px solid #07C160' : '1px solid rgba(255,255,255,0.15)',
                background: i === 0 ? 'rgba(7,193,96,0.15)' : 'transparent',
                color: i === 0 ? '#07C160' : 'rgba(255,255,255,0.5)',
                borderRadius: 20,
                padding: '4px 14px',
                fontSize: 12,
                cursor: 'pointer',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* SVG graph */}
        <svg
          viewBox="0 0 800 560"
          style={{ width: '100%', height: '100%' }}
          onClick={() => setSelectedNode(null)}
        >
          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodeMap[edge.from]
            const to = nodeMap[edge.to]
            const mx = (from.x + to.x) / 2
            const my = (from.y + to.y) / 2
            const strokeW = Math.max(1, edge.intimacy / 25)
            const isHovered = hoveredEdge === i

            return (
              <g key={i}>
                <line
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={edge.color}
                  strokeWidth={isHovered ? strokeW + 2 : strokeW}
                  strokeOpacity={isHovered ? 0.9 : 0.45}
                  style={{ cursor: 'pointer', transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
                  onMouseEnter={e => { e.stopPropagation(); setHoveredEdge(i) }}
                  onMouseLeave={() => setHoveredEdge(null)}
                />
                <text
                  x={mx} y={my - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isHovered ? edge.color : 'rgba(255,255,255,0.35)'}
                  style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}
                >
                  {edge.relation}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isSelected = selectedNode === node.id
            return (
              <g
                key={node.id}
                onClick={e => { e.stopPropagation(); setSelectedNode(node.id === 'user' ? null : node.id) }}
                style={{ cursor: node.id === 'user' ? 'default' : 'pointer' }}
              >
                {isSelected && (
                  <circle
                    cx={node.x} cy={node.y}
                    r={node.size + 8}
                    fill="none"
                    stroke={node.color}
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    opacity="0.7"
                  />
                )}
                <circle
                  cx={node.x} cy={node.y}
                  r={node.size}
                  fill={node.color}
                  fillOpacity={isSelected ? 1 : 0.85}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  style={{ transition: 'fill-opacity 0.2s, r 0.2s' }}
                />
                <text
                  x={node.x} y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={node.id === 'user' ? '14' : '13'}
                  fontWeight="700"
                  fill="#FFFFFF"
                  style={{ pointerEvents: 'none' }}
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
          background: 'rgba(26,26,46,0.85)',
          borderRadius: 8,
          padding: '10px 14px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>关系类型</div>
          {[
            { label: '好友', color: '#60A5FA' },
            { label: '挚友', color: '#EC4899' },
            { label: '暧昧', color: '#F59E0B' },
            { label: '闺蜜', color: '#A855F7' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 24, height: 2, background: item.color, borderRadius: 1 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side panel */}
      {selected && selectedNode !== 'user' && (
        <div style={{
          width: 280,
          background: '#FFFFFF',
          borderLeft: '1px solid #E5E5E5',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Close */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', padding: '12px 16px',
            borderBottom: '1px solid #F0F0F0',
          }}>
            <button
              onClick={() => setSelectedNode(null)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888888', fontSize: 18 }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: '20px 20px', flex: 1, overflowY: 'auto' }}>
            {/* Avatar + name */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                background: selected.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 24,
                marginBottom: 10,
              }}>
                {selected.label[0]}
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A', marginBottom: 4 }}>{selected.label}</div>
              {selectedInfo && (
                <div style={{ fontSize: 12, color: '#888888' }}>{selectedInfo.status}</div>
              )}
            </div>

            {/* Intimacy */}
            {selectedEdge && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#888888' }}>亲密度</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: selectedEdge.color }}>
                    {selectedEdge.intimacy}/100
                  </span>
                </div>
                <div style={{ height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${selectedEdge.intimacy}%`,
                    background: selectedEdge.color,
                    borderRadius: 3,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    background: selectedEdge.color + '22',
                    color: selectedEdge.color,
                    borderRadius: 12,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {selectedEdge.relation}
                  </span>
                </div>
              </div>
            )}

            {/* Last chat */}
            {selectedInfo && (
              <div style={{
                background: '#F8F8F8',
                borderRadius: 8,
                padding: '10px 12px',
                marginBottom: 20,
                fontSize: 13,
                color: '#888888',
              }}>
                🕐 {selectedInfo.lastChat}
              </div>
            )}

            {/* Actions */}
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
              <Link href="/contacts" style={{
                flex: 1,
                background: '#F5F5F5',
                color: '#1A1A1A',
                border: '1px solid #E5E5E5',
                borderRadius: 8,
                padding: '10px',
                fontSize: 13,
                cursor: 'pointer',
                textDecoration: 'none',
                textAlign: 'center',
              }}>
                查看资料
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
