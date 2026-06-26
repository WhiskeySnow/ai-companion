'use client'

export default function JournalPage() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F5F5F5',
      color: '#AAAAAA',
      gap: 12,
    }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5" width="56" height="56">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      <div style={{ fontSize: 18, fontWeight: 600, color: '#888888' }}>手帐</div>
      <div style={{ fontSize: 14 }}>记录你与AI伙伴的珍贵时刻</div>
      <div style={{
        marginTop: 8,
        background: '#EDEDED',
        borderRadius: 8,
        padding: '8px 20px',
        fontSize: 13,
        color: '#AAAAAA',
      }}>
        即将推出 · Coming Soon
      </div>
    </div>
  )
}
