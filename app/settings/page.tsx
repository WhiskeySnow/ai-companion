'use client'

const settingsSections = [
  {
    title: '账号与安全',
    items: ['账号信息', '隐私设置', '登录设备管理'],
  },
  {
    title: '通知',
    items: ['消息通知', '动态通知', '系统通知'],
  },
  {
    title: '外观',
    items: ['主题', '字体大小', '聊天背景'],
  },
  {
    title: 'AI 设置',
    items: ['回复风格', '记忆管理', '语言偏好', 'API 设置'],
  },
  {
    title: '其他',
    items: ['关于 If', '帮助与反馈', '清除缓存'],
  },
]

export default function SettingsPage() {
  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#F5F5F5' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 0 40px' }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 12px',
          fontSize: 18,
          fontWeight: 700,
          color: '#1A1A1A',
          background: '#F5F5F5',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          设置
        </div>

        {/* Profile card */}
        <div style={{
          background: '#FFFFFF',
          padding: '16px 20px',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          cursor: 'pointer',
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 10,
            background: '#555555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 20,
          }}>
            我
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#1A1A1A', marginBottom: 2 }}>我的账号</div>
            <div style={{ fontSize: 12, color: '#888888' }}>点击查看个人资料</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2" width="16" height="16">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        {/* Settings sections */}
        {settingsSections.map(section => (
          <div key={section.title} style={{ marginBottom: 12 }}>
            <div style={{
              padding: '6px 20px',
              fontSize: 12,
              color: '#888888',
              background: '#F5F5F5',
            }}>
              {section.title}
            </div>
            <div style={{ background: '#FFFFFF' }}>
              {section.items.map((item, i) => (
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
                    borderBottom: i < section.items.length - 1 ? '1px solid #F0F0F0' : 'none',
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
          </div>
        ))}

        {/* Version */}
        <div style={{ textAlign: 'center', padding: '20px', fontSize: 12, color: '#CCCCCC' }}>
          If v0.1.0 · Made with ❤️
        </div>
      </div>
    </div>
  )
}
