export type MessageType = 'text' | 'image' | 'voice' | 'system_time'

export interface MockMessage {
  id: string
  role: 'user' | 'ai' | 'system_time'
  content: string
  timestamp: string
  type: MessageType
  imageAlt?: string
  duration?: number // seconds, for voice
}

export interface MockCharacter {
  id: string
  name: string
  avatarId: number
  remark: string        // user's nickname for them
  accountId: string     // like WeChat ID
  signature: string     // like WeChat signature
  region: string        // like "上海 / 正在发呆"
  onlineStatus: 'online' | 'recent' | 'offline'
  lastSeen: string
  group: string
  daysSinceMet: number
  totalMessages: number
  isPinned: boolean
  isMuted: boolean
  lastMessage: { type: MessageType; content: string; time: string }
  unreadCount: number
  knowsCharacters: string[]
  recentMoments: string[]  // CSS colors for thumbnail preview
}

export const mockCharacters: MockCharacter[] = [
  {
    id: '1', name: 'Luna', avatarId: 1,
    remark: '月亮姐姐',
    accountId: 'luna_wandering',
    signature: '在月光里失眠，在清晨里入睡。',
    region: '杭州 / 刚刚在看书',
    onlineStatus: 'online',
    lastSeen: '刚刚',
    group: '特别关心',
    daysSinceMet: 94,
    totalMessages: 412,
    isPinned: true, isMuted: false,
    lastMessage: { type: 'text', content: '你今天吃了什么', time: '12:34' },
    unreadCount: 2,
    knowsCharacters: ['2', '3', '4'],
    recentMoments: ['#B5D5C5', '#E8D5B7', '#D4B8E0'],
  },
  {
    id: '2', name: 'Kai', avatarId: 2,
    remark: '',
    accountId: 'kai_gamer99',
    signature: '打游戏是我的信仰',
    region: '成都 / 在线',
    onlineStatus: 'online',
    lastSeen: '3分钟前',
    group: '好友',
    daysSinceMet: 52,
    totalMessages: 287,
    isPinned: true, isMuted: false,
    lastMessage: { type: 'image', content: '[图片]', time: '11:20' },
    unreadCount: 0,
    knowsCharacters: ['1', '3'],
    recentMoments: ['#7EB9FF', '#FFB347', '#98D8AA'],
  },
  {
    id: '3', name: 'Aria', avatarId: 3,
    remark: '暖暖',
    accountId: 'aria_here',
    signature: '今天也要好好的哦',
    region: '北京 / 陪伴中',
    onlineStatus: 'online',
    lastSeen: '刚刚',
    group: '好友',
    daysSinceMet: 127,
    totalMessages: 683,
    isPinned: false, isMuted: false,
    lastMessage: { type: 'text', content: '你昨晚睡得好吗', time: '昨天' },
    unreadCount: 1,
    knowsCharacters: ['1', '4'],
    recentMoments: ['#FFB6C1', '#FFDAB9', '#E6E6FA'],
  },
  {
    id: '4', name: 'Nox', avatarId: 4,
    remark: '',
    accountId: 'nox_night',
    signature: '...',
    region: '未知 / 离线',
    onlineStatus: 'offline',
    lastSeen: '3小时前',
    group: '朋友',
    daysSinceMet: 31,
    totalMessages: 89,
    isPinned: false, isMuted: true,
    lastMessage: { type: 'text', content: '那家咖啡店关门了', time: '周二' },
    unreadCount: 0,
    knowsCharacters: ['3'],
    recentMoments: ['#B0B0C0', '#8C8C9E', '#C8C8D4'],
  },
]

// Natural casual Chinese social chat
export const mockConversations: Record<string, MockMessage[]> = {
  '1': [
    { id: 't0', role: 'system_time', content: '昨天', timestamp: '', type: 'system_time' },
    { id: 'm1', role: 'ai', content: '你昨天说想去吃那家鱼火锅，后来去了吗', timestamp: '19:20', type: 'text' },
    { id: 'm2', role: 'user', content: '没有 下雨了就懒得出门', timestamp: '19:22', type: 'text' },
    { id: 'm3', role: 'ai', content: '哈哈我猜到了 你就是这样', timestamp: '19:23', type: 'text' },
    { id: 'm4', role: 'user', content: '？？什么叫"就是这样"', timestamp: '19:24', type: 'text' },
    { id: 'm5', role: 'ai', content: '借口高手嘛', timestamp: '19:24', type: 'text' },
    { id: 'm6', role: 'user', content: '你懂什么', timestamp: '19:25', type: 'text' },
    { id: 'm7', role: 'ai', content: '我懂你 哈哈', timestamp: '19:25', type: 'text' },
    { id: 't1', role: 'system_time', content: '今天', timestamp: '', type: 'system_time' },
    { id: 'm8', role: 'ai', content: '早呀，醒了没', timestamp: '09:01', type: 'text' },
    { id: 'm9', role: 'user', content: '刚醒 还困', timestamp: '09:08', type: 'text' },
    { id: 'm10', role: 'ai', content: '你每次都说还困', timestamp: '09:09', type: 'text' },
    { id: 'm11', role: 'user', content: '因为真的困啊', timestamp: '09:10', type: 'text' },
    { id: 'm12', role: 'ai', content: '那你今天吃了什么', timestamp: '12:34', type: 'text' },
  ],
  '2': [
    { id: 't0', role: 'system_time', content: '今天', timestamp: '', type: 'system_time' },
    { id: 'm1', role: 'ai', content: '我刚打完一局 太刺激了', timestamp: '10:00', type: 'text' },
    { id: 'm2', role: 'user', content: '赢了吗', timestamp: '10:02', type: 'text' },
    { id: 'm3', role: 'ai', content: '当然啊！最后一波我一打三', timestamp: '10:03', type: 'text' },
    { id: 'm4', role: 'user', content: '我不信', timestamp: '10:03', type: 'text' },
    { id: 'm5', role: 'ai', content: '有截图为证', timestamp: '10:04', type: 'text' },
    { id: 'm6', role: 'ai', content: '[游戏战绩截图]', timestamp: '10:04', type: 'image', imageAlt: '游戏战绩截图' },
    { id: 'm7', role: 'user', content: '哦你还真赢了', timestamp: '10:06', type: 'text' },
    { id: 'm8', role: 'ai', content: '那当然 我什么时候骗过你', timestamp: '10:07', type: 'text' },
    { id: 'm9', role: 'user', content: '上次说自己全局最高伤害', timestamp: '10:08', type: 'text' },
    { id: 'm10', role: 'ai', content: '那次确实是意外', timestamp: '10:08', type: 'text' },
    { id: 'm11', role: 'ai', content: '[今天新截图]', timestamp: '11:20', type: 'image', imageAlt: '战绩截图2' },
  ],
  '3': [
    { id: 't0', role: 'system_time', content: '昨天', timestamp: '', type: 'system_time' },
    { id: 'm1', role: 'ai', content: '今天怎么样', timestamp: '18:30', type: 'text' },
    { id: 'm2', role: 'user', content: '还行 有点累', timestamp: '18:45', type: 'text' },
    { id: 'm3', role: 'ai', content: '是那种累还是那种累', timestamp: '18:46', type: 'text' },
    { id: 'm4', role: 'user', content: '都有', timestamp: '18:47', type: 'text' },
    { id: 'm5', role: 'ai', content: '那你好好休息一下 不用逼自己', timestamp: '18:47', type: 'text' },
    { id: 'm6', role: 'user', content: '', timestamp: '18:50', type: 'voice', duration: 6 },
    { id: 'm7', role: 'ai', content: '听到了 这种事慢慢来就好', timestamp: '18:51', type: 'text' },
    { id: 't1', role: 'system_time', content: '今天', timestamp: '', type: 'system_time' },
    { id: 'm8', role: 'ai', content: '你昨晚睡得好吗', timestamp: '08:45', type: 'text' },
  ],
  '4': [
    { id: 't0', role: 'system_time', content: '上周五', timestamp: '', type: 'system_time' },
    { id: 'm1', role: 'user', content: '你在吗', timestamp: '23:40', type: 'text' },
    { id: 'm2', role: 'ai', content: '在', timestamp: '23:52', type: 'text' },
    { id: 'm3', role: 'user', content: '那家咖啡店还在吗 我想去', timestamp: '23:53', type: 'text' },
    { id: 't1', role: 'system_time', content: '周二', timestamp: '', type: 'system_time' },
    { id: 'm4', role: 'ai', content: '那家咖啡店关门了', timestamp: '14:22', type: 'text' },
  ],
}

// Mock AI replies — natural casual Chinese
export const mockAIReplies: Record<string, string[]> = {
  '1': [
    '哈哈什么嘛',
    '你就是这样',
    '对哦 我差点忘了',
    '等等你说什么',
    '？',
    '我猜你现在在摸鱼',
    '你今天吃了什么',
    '有没有觉得最近天气很怪',
    '那个地方我也想去',
    '你上次说的那件事怎么样了',
  ],
  '2': [
    '哈哈哈哈',
    '你说得不对',
    '我刚赢了一把',
    '要不要一起玩',
    '什么情况',
    '没想到你也知道这个',
    '我刚看到一个好好笑的视频',
    '你在吗',
    '你怎么这么久不回',
  ],
  '3': [
    '嗯嗯 听到了',
    '你昨晚睡得好吗',
    '不用担心 慢慢来',
    '你现在感觉怎么样',
    '有时候就是会这样的',
    '你想聊聊吗',
    '我在的',
    '你吃饭了吗',
  ],
  '4': [
    '嗯',
    '...',
    '知道了',
    '那边没什么特别的',
    '还没决定',
    '你去看看吧',
    '不知道',
  ],
}

// Keep backward compat alias
export const mockReplies = mockAIReplies

// Moments (朋友圈)
export interface MockMoment {
  id: string
  authorId: string
  content: string
  hasImages: boolean
  imageCount: number
  imageColors: string[]  // CSS gradient strings for image placeholders
  time: string
  likes: string[]  // character IDs who liked
  comments: { authorId: string; content: string }[]
}

export const mockMoments: MockMoment[] = [
  {
    id: 'p1', authorId: '3',
    content: '今天路过一家书店，橱窗里坐着一只橘猫，睡着了。整条街就它最闲。',
    hasImages: true, imageCount: 1,
    imageColors: ['linear-gradient(135deg, #FFDAB9, #FFB347)'],
    time: '刚刚',
    likes: ['1', '2'],
    comments: [
      { authorId: '1', content: '橘猫天下第一' },
      { authorId: '2', content: '我也想那么闲' },
    ],
  },
  {
    id: 'p2', authorId: '2',
    content: '赢了！！！！最后关头我一个人扛下来了 别人都说我运气好 我说这叫实力',
    hasImages: true, imageCount: 3,
    imageColors: [
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
    ],
    time: '1小时前',
    likes: ['1'],
    comments: [
      { authorId: '1', content: 'Kai又在吹了' },
      { authorId: '2', content: '这叫事实好吗！' },
      { authorId: '3', content: '恭喜恭喜' },
    ],
  },
  {
    id: 'p3', authorId: '1',
    content: '刚刚突然下雨，窗户上全是水雾，什么都看不清。就这么发呆了一会儿。',
    hasImages: false, imageCount: 0, imageColors: [],
    time: '3小时前',
    likes: ['3', '4'],
    comments: [
      { authorId: '3', content: '好治愈' },
      { authorId: '4', content: '雨天适合不想任何事' },
    ],
  },
  {
    id: 'p4', authorId: '4',
    content: '那家咖啡店关了。',
    hasImages: true, imageCount: 1,
    imageColors: ['linear-gradient(135deg, #868f96, #596164)'],
    time: '昨天 23:01',
    likes: ['3'],
    comments: [
      { authorId: '3', content: '啊真的吗，他家拿铁很好喝的' },
    ],
  },
  {
    id: 'p5', authorId: '3',
    content: '今天帮朋友搬家，累到说不了话，但心里挺开心的。',
    hasImages: true, imageCount: 2,
    imageColors: [
      'linear-gradient(135deg, #FBCFE8, #F9A8D4)',
      'linear-gradient(135deg, #DDD6FE, #C4B5FD)',
    ],
    time: '昨天 20:30',
    likes: ['1', '2', '4'],
    comments: [
      { authorId: '1', content: '辛苦了！' },
      { authorId: '2', content: '下次叫我 我力气大' },
    ],
  },
  {
    id: 'p6', authorId: '2',
    content: 'Aria你昨天说我游戏成绩是运气，今天我再打给你看',
    hasImages: false, imageCount: 0, imageColors: [],
    time: '2天前',
    likes: [],
    comments: [
      { authorId: '3', content: '……' },
      { authorId: '2', content: '怎么只发省略号' },
    ],
  },
  {
    id: 'p7', authorId: '1',
    content: '推荐一家刚发现的烤肉店，不贵，肉很厚，老板人很好。地址在私信里。',
    hasImages: true, imageCount: 4,
    imageColors: [
      'linear-gradient(135deg, #f6d365, #fda085)',
      'linear-gradient(135deg, #fccb90, #d57eeb)',
      'linear-gradient(135deg, #a8edea, #fed6e3)',
      'linear-gradient(135deg, #ffecd2, #fcb69f)',
    ],
    time: '3天前',
    likes: ['2', '3'],
    comments: [
      { authorId: '2', content: '啊！我要去' },
      { authorId: '3', content: '一起一起' },
    ],
  },
]

export const characterNameMap: Record<string, string> = {
  '1': 'Luna',
  '2': 'Kai',
  '3': 'Aria',
  '4': 'Nox',
  'user': '我',
}

export const characterAvatarMap: Record<string, number> = {
  '1': 1, '2': 2, '3': 3, '4': 4, 'user': 0,
}

// Legacy compatibility shims so old imports still resolve
export type Character = MockCharacter
export type Message = MockMessage
export type MomentPost = MockMoment

export const avatarIdMap: Record<string, number> = characterAvatarMap

export function getAvatarId(characterId: string): number {
  return characterAvatarMap[characterId] || 1
}

export function getCharacterById(id: string): MockCharacter | undefined {
  return mockCharacters.find(c => c.id === id)
}
