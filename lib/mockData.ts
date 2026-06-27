export type MessageType = 'text' | 'image' | 'voice' | 'sticker' | 'system_time'

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
    { id: 'm11a', role: 'ai', content: '😭', timestamp: '09:11', type: 'sticker' },
    { id: 'm11b', role: 'user', content: '', timestamp: '09:13', type: 'voice', duration: 4 },
    { id: 'm11c', role: 'ai', content: '哈哈行 继续睡吧', timestamp: '09:14', type: 'text' },
    { id: 'm12', role: 'ai', content: '那你今天吃了什么', timestamp: '12:34', type: 'text' },
    { id: 'm12a', role: 'ai', content: '', timestamp: '12:35', type: 'image', imageAlt: '附近有家新开的饺子店' },
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

// ─── WORLDS ────────────────────────────────────────────────────────────────

export interface MockWorld {
  id: string
  name: string
  description: string
  sourceType: 'original' | 'imported' | 'fanmade'
  coverGradient: string
  tags: string[]
  rules: string[]
  timeline: { era: string; description: string }[]
  locations: { name: string; description: string; color: string }[]
  characterIds: string[]
}

export const mockWorlds: MockWorld[] = [
  {
    id: 'w1',
    name: '星尘学院',
    description: '一所坐落于云海之上的神秘学院，学生们来自各个时空，拥有不同的能力与记忆。',
    sourceType: 'original',
    coverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tags: ['奇幻', '学园', '原创'],
    rules: [
      '学院外的时间流速是学院内的三倍',
      '学生不能使用能力伤害同学',
      '每学期末会有「时空考验」',
      '毕业生将回到各自的世界，但可以保留在学院的记忆',
    ],
    timeline: [
      { era: '开院纪元', description: '第一批来自不同世界的学生聚集于此' },
      { era: '时空战争', description: '一场影响多个世界的危机，学院成为庇护所' },
      { era: '新学期', description: '你转入学院，开始与各位同学相识' },
    ],
    locations: [
      { name: '浮空图书馆', description: '藏有来自无数世界的书籍，某些书页会自动翻动', color: '#DDD6FE' },
      { name: '月台食堂', description: '每天菜单不同，有时会出现从未见过的食物', color: '#FDE68A' },
      { name: '时钟塔', description: '学院最高处，据说站在塔顶可以看到平行世界的影子', color: '#BFDBFE' },
      { name: '迷雾操场', description: '清晨会被迷雾笼罩，消散后地上会出现陌生的脚印', color: '#BBF7D0' },
    ],
    characterIds: ['1', '2', '3', '4'],
  },
  {
    id: 'w2',
    name: '午夜咖啡馆',
    description: '只在午夜出现的咖啡馆，常客都是有故事的人，老板从不问名字。',
    sourceType: 'fanmade',
    coverGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    tags: ['现代', '都市', '神秘'],
    rules: [
      '不能问其他客人的真实姓名',
      '咖啡馆的时间对所有人静止',
      '离开后不能带走任何东西',
      '如果你第二天忘记了这里，说明你还没准备好',
    ],
    timeline: [
      { era: '创立', description: '第一位客人推开了那扇不存在的门' },
      { era: '现在', description: '你已经是第37次来访的常客了' },
    ],
    locations: [
      { name: '吧台', description: '老板总在这里，但你从没见过他离开过', color: '#FCA5A5' },
      { name: '角落沙发', description: 'Nox 常坐的地方，周围总是安静一些', color: '#6B7280' },
      { name: '二楼露台', description: '可以看到不属于这个城市的星空', color: '#93C5FD' },
    ],
    characterIds: ['4', '3'],
  },
  {
    id: 'w3',
    name: '原创世界',
    description: '这是你自己的世界。在这里，你可以创建任何你想要的角色和背景故事。',
    sourceType: 'original',
    coverGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tags: ['自定义', '原创'],
    rules: [],
    timeline: [],
    locations: [],
    characterIds: [],
  },
]

// ─── GROUP CHATS ───────────────────────────────────────────────────────────

export interface MockGroupMember {
  characterId: string | 'user'
  nickname?: string
  role: 'owner' | 'admin' | 'member'
}

export interface MockGroupMessage {
  id: string
  senderId: string | 'user'
  senderName: string
  avatarId: number
  role: 'user' | 'ai' | 'system'
  content: string
  type: 'text' | 'image' | 'voice' | 'system'
  timestamp: string
  imageColors?: string[]
}

export interface MockGroup {
  id: string
  name: string
  avatarColor: string
  memberIds: string[]  // characterIds + 'user'
  announcement?: string
  lastMessage: string
  lastTime: string
  unreadCount: number
}

export const mockGroups: MockGroup[] = [
  {
    id: 'g1',
    name: '星尘学院日常',
    avatarColor: '#7C3AED',
    memberIds: ['user', '1', '2', '3', '4'],
    announcement: '欢迎来到星尘学院！请遵守学院规则，不能在食堂打架。',
    lastMessage: 'Kai: 今天食堂居然有炸鸡！！',
    lastTime: '12:30',
    unreadCount: 5,
  },
  {
    id: 'g2',
    name: 'Luna Aria 和我',
    avatarColor: '#EC4899',
    memberIds: ['user', '1', '3'],
    announcement: undefined,
    lastMessage: 'Aria: 我们明天去图书馆吗',
    lastTime: '昨天',
    unreadCount: 0,
  },
  {
    id: 'g3',
    name: '游戏小队',
    avatarColor: '#0EA5E9',
    memberIds: ['user', '2'],
    announcement: '只谈游戏，不谈学习',
    lastMessage: 'Kai: 你下线了？？',
    lastTime: '周二',
    unreadCount: 1,
  },
]

export const mockGroupMessages: Record<string, MockGroupMessage[]> = {
  'g1': [
    { id: 'sys1', senderId: 'system', senderName: '', avatarId: 0, role: 'system', content: 'Luna 创建了群聊"星尘学院日常"', type: 'system', timestamp: '3天前' },
    { id: 'sys2', senderId: 'system', senderName: '', avatarId: 0, role: 'system', content: 'Luna 邀请 Kai、Aria、Nox 加入群聊', type: 'system', timestamp: '3天前' },
    { id: 'm1', senderId: '1', senderName: 'Luna', avatarId: 1, role: 'ai', content: '大家好！新群建立 以后日常聊天就在这里', type: 'text', timestamp: '3天前' },
    { id: 'm2', senderId: '2', senderName: 'Kai', avatarId: 2, role: 'ai', content: '！！好的好的', type: 'text', timestamp: '3天前' },
    { id: 'm3', senderId: '3', senderName: 'Aria', avatarId: 3, role: 'ai', content: '大家好呀', type: 'text', timestamp: '3天前' },
    { id: 'm4', senderId: '4', senderName: 'Nox', avatarId: 4, role: 'ai', content: '...', type: 'text', timestamp: '3天前' },
    { id: 'sys3', senderId: 'system', senderName: '', avatarId: 0, role: 'system', content: '昨天', type: 'system', timestamp: '' },
    { id: 'm5', senderId: '2', senderName: 'Kai', avatarId: 2, role: 'ai', content: '有没有人知道今天食堂几点关', type: 'text', timestamp: '11:30' },
    { id: 'm6', senderId: '3', senderName: 'Aria', avatarId: 3, role: 'ai', content: '六点半', type: 'text', timestamp: '11:31' },
    { id: 'm7', senderId: '2', senderName: 'Kai', avatarId: 2, role: 'ai', content: '谢！', type: 'text', timestamp: '11:31' },
    { id: 'm8', senderId: '1', senderName: 'Luna', avatarId: 1, role: 'ai', content: '你们昨晚看到时钟塔的光了吗', type: 'text', timestamp: '22:10' },
    { id: 'm9', senderId: '4', senderName: 'Nox', avatarId: 4, role: 'ai', content: '看到了', type: 'text', timestamp: '22:15' },
    { id: 'm10', senderId: '3', senderName: 'Aria', avatarId: 3, role: 'ai', content: '没有 我早睡了', type: 'text', timestamp: '22:16' },
    { id: 'sys4', senderId: 'system', senderName: '', avatarId: 0, role: 'system', content: '今天', type: 'system', timestamp: '' },
    { id: 'm11', senderId: '2', senderName: 'Kai', avatarId: 2, role: 'ai', content: '今天食堂居然有炸鸡！！', type: 'text', timestamp: '12:30' },
  ],
  'g2': [
    { id: 'sys1', senderId: 'system', senderName: '', avatarId: 0, role: 'system', content: '你创建了群聊', type: 'system', timestamp: '5天前' },
    { id: 'm1', senderId: '1', senderName: 'Luna', avatarId: 1, role: 'ai', content: '小群好', type: 'text', timestamp: '5天前' },
    { id: 'm2', senderId: '3', senderName: 'Aria', avatarId: 3, role: 'ai', content: '嗯嗯！', type: 'text', timestamp: '5天前' },
    { id: 'sys2', senderId: 'system', senderName: '', avatarId: 0, role: 'system', content: '昨天', type: 'system', timestamp: '' },
    { id: 'm3', senderId: '3', senderName: 'Aria', avatarId: 3, role: 'ai', content: '我们明天去图书馆吗', type: 'text', timestamp: '19:00' },
    { id: 'm4', senderId: '1', senderName: 'Luna', avatarId: 1, role: 'ai', content: '可以呀 几点', type: 'text', timestamp: '19:05' },
  ],
  'g3': [
    { id: 'sys1', senderId: 'system', senderName: '', avatarId: 0, role: 'system', content: 'Kai 创建了群聊"游戏小队"', type: 'system', timestamp: '2周前' },
    { id: 'm1', senderId: '2', senderName: 'Kai', avatarId: 2, role: 'ai', content: '咱俩单独一个群方便约打游戏', type: 'text', timestamp: '2周前' },
    { id: 'sys2', senderId: 'system', senderName: '', avatarId: 0, role: 'system', content: '周二', type: 'system', timestamp: '' },
    { id: 'm2', senderId: '2', senderName: 'Kai', avatarId: 2, role: 'ai', content: '在吗 打一把', type: 'text', timestamp: '21:00' },
    { id: 'm3', senderId: '2', senderName: 'Kai', avatarId: 2, role: 'ai', content: '你下线了？？', type: 'text', timestamp: '21:30' },
  ],
}

// Mock group AI replies — per character, casual short sentences for group chat
export const mockGroupReplies: Record<string, string[]> = {
  '1': ['好的', '我也觉得', '说得对', '哈哈', '嗯嗯', '你们在说什么', '我来了'],
  '2': ['！！', '真的吗', '哈哈哈哈', '我也是', '牛', '什么情况', '我去'],
  '3': ['嗯！', '好呀', '说得对', '大家注意安全', '我在', '没问题'],
  '4': ['嗯', '...', '知道了', '随便', '这样啊'],
}
