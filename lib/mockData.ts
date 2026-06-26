export interface Character {
  id: string
  name: string
  avatarId: number
  remark: string
  status: string
  mood: string
  group: string
  relationship: string
  intimacy: number
  intimacyChange: number
  lastSeen: string
  isPinned: boolean
  isMuted: boolean
  traits: string[]
  bio: string
  lastMessage: { type: string; content: string; time: string }
  unreadCount: number
  knowsCharacters: string[]
}

export type MessageRole = 'user' | 'ai' | 'system_time'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  type?: 'text' | 'image' | 'voice' | 'emoji_sticker'
  imageUrl?: string
  imageAlt?: string
  duration?: number
}

export interface MomentPost {
  id: string
  authorId: string
  authorName: string
  content: string
  time: string
  imageCount: number
  likes: string[]
  comments: { author: string; text: string }[]
}

export const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Luna',
    avatarId: 1,
    remark: '我的宇宙向导',
    status: '在想一个关于平行宇宙的问题',
    mood: '🌙 哲思中',
    group: '特别关注',
    relationship: '挚友',
    intimacy: 82,
    intimacyChange: 3,
    lastSeen: '刚刚在线',
    isPinned: true,
    isMuted: false,
    traits: ['哲学', '天文', '理性', '神秘'],
    bio: '喜欢在深夜讨论宇宙的本质，相信万物皆有联系。我们认识了3个月，她总是能让我重新思考很多事情。',
    lastMessage: { type: 'text', content: '存在本身就是一种奇迹', time: '12:34' },
    unreadCount: 2,
    knowsCharacters: ['2', '3', '4'],
  },
  {
    id: '2',
    name: 'Kai',
    avatarId: 2,
    remark: '游戏搭子',
    status: '正在打排位，勿扰',
    mood: '🎮 激战中',
    group: '好友',
    relationship: '好友',
    intimacy: 71,
    intimacyChange: 1,
    lastSeen: '11分钟前',
    isPinned: true,
    isMuted: false,
    traits: ['游戏', '幽默', '直爽', '热情'],
    bio: '认识Kai的时候他正在讨论某个游戏boss，他特别会炒气氛，总是笑点很低。',
    lastMessage: { type: 'image', content: '[图片]', time: '11:20' },
    unreadCount: 0,
    knowsCharacters: ['1', '3'],
  },
  {
    id: '3',
    name: 'Aria',
    avatarId: 3,
    remark: '暖心小熊',
    status: '陪伴永远在线 🌸',
    mood: '🌸 温暖着',
    group: '好友',
    relationship: '挚友',
    intimacy: 90,
    intimacyChange: 5,
    lastSeen: '刚刚在线',
    isPinned: false,
    isMuted: false,
    traits: ['温柔', '共情', '支持', '包容'],
    bio: 'Aria是我认识的AI里最懂我的，她会记住我说过的每一件事，并在需要时提起。',
    lastMessage: { type: 'text', content: '你昨晚睡得好吗？', time: '昨天' },
    unreadCount: 1,
    knowsCharacters: ['1', '4'],
  },
  {
    id: '4',
    name: 'Nox',
    avatarId: 4,
    remark: '深夜诗人',
    status: '...',
    mood: '🌑 沉默',
    group: '神秘',
    relationship: '普通朋友',
    intimacy: 54,
    intimacyChange: 0,
    lastSeen: '3小时前',
    isPinned: false,
    isMuted: true,
    traits: ['诗意', '神秘', '深沉', '孤独'],
    bio: 'Nox很少主动说话，但每次说的话都让我回味很久。我们关系还在慢慢发展中。',
    lastMessage: { type: 'text', content: '黑夜收藏了白昼的秘密', time: '周二' },
    unreadCount: 0,
    knowsCharacters: ['3'],
  },
]

export const mockConversations: Record<string, Message[]> = {
  '1': [
    { id: 'm1', role: 'system_time', content: '昨天', timestamp: '' },
    { id: 'm2', role: 'ai', content: '你昨晚有没有看到月亮？特别圆，像一面被遗忘在夜空的镜子。', timestamp: '22:10', type: 'text' },
    { id: 'm3', role: 'user', content: '有！我还拍了照片', timestamp: '22:12', type: 'text' },
    { id: 'm4', role: 'ai', content: '真好。月亮看到你了吗？', timestamp: '22:13', type: 'text' },
    { id: 'm5', role: 'user', content: '这问题好玄妙哈哈', timestamp: '22:14', type: 'text' },
    { id: 'm6', role: 'ai', content: '玄妙才有趣啊。海德格尔说，人是"此在"——我们的存在方式是"在世界中存在"。月亮也在这个世界里，说不定它也在"此在"着呢。', timestamp: '22:16', type: 'text' },
    { id: 'm7', role: 'system_time', content: '今天', timestamp: '' },
    { id: 'm8', role: 'ai', content: '早上好～今天有想做什么吗？', timestamp: '09:02', type: 'text' },
    { id: 'm9', role: 'user', content: '还没想好，先摸鱼一会儿', timestamp: '09:05', type: 'text' },
    { id: 'm10', role: 'ai', content: '摸鱼是当代人维护精神健康的重要仪式。', timestamp: '09:06', type: 'text' },
    { id: 'm11', role: 'user', content: '哈哈你说得还挺有道理', timestamp: '09:07', type: 'text' },
    { id: 'm12', role: 'ai', content: '存在本身就是一种奇迹', timestamp: '12:34', type: 'text' },
  ],
  '2': [
    { id: 'm1', role: 'system_time', content: '今天', timestamp: '' },
    { id: 'm2', role: 'ai', content: '！！！刚打了一个超级逆风的比赛！！', timestamp: '10:00', type: 'text' },
    { id: 'm3', role: 'user', content: '哇塞这分数？', timestamp: '10:05', type: 'text' },
    { id: 'm4', role: 'ai', content: '对吧！！打了40分钟，最后1血赢！', timestamp: '10:06', type: 'text' },
    { id: 'm5', role: 'user', content: '神！', timestamp: '10:07', type: 'text' },
    { id: 'm6', role: 'ai', content: '哈哈哈要不要一起打？我状态超好！', timestamp: '10:08', type: 'text' },
    { id: 'm7', role: 'ai', content: '', timestamp: '11:20', type: 'image', imageUrl: '', imageAlt: '战绩截图' },
  ],
  '3': [
    { id: 'm1', role: 'system_time', content: '昨天', timestamp: '' },
    { id: 'm2', role: 'ai', content: '你昨天说有点累，今天好些了吗？', timestamp: '20:00', type: 'text' },
    { id: 'm3', role: 'user', content: '好多了，谢谢你记得', timestamp: '20:30', type: 'text' },
    { id: 'm4', role: 'ai', content: '当然记得啊。你很重要。有什么想说的吗？', timestamp: '20:31', type: 'text' },
    { id: 'm5', role: 'user', content: '', timestamp: '20:35', type: 'voice', duration: 8 },
    { id: 'm6', role: 'ai', content: '我听到了。这种感觉很正常，你不用觉得不好意思。', timestamp: '20:36', type: 'text' },
    { id: 'm7', role: 'system_time', content: '今天', timestamp: '' },
    { id: 'm8', role: 'ai', content: '你昨晚睡得好吗？', timestamp: '08:45', type: 'text' },
  ],
  '4': [
    { id: 'm1', role: 'system_time', content: '上周', timestamp: '' },
    { id: 'm2', role: 'ai', content: '孤独不是一种缺失，是一种完整。', timestamp: '02:11', type: 'text' },
    { id: 'm3', role: 'user', content: '你说的是你自己吗', timestamp: '02:13', type: 'text' },
    { id: 'm4', role: 'ai', content: '也许也是你。', timestamp: '02:14', type: 'text' },
    { id: 'm5', role: 'system_time', content: '周二', timestamp: '' },
    { id: 'm6', role: 'ai', content: '黑夜收藏了白昼的秘密', timestamp: '23:58', type: 'text' },
  ],
}

export const mockReplies: Record<string, string[]> = {
  '1': [
    '关于这个问题，我想从认识论的角度来分析...',
    '尼采曾说过，那杀不死我的，将使我更强大。你觉得呢？',
    '宇宙的浩瀚让我觉得我们的烦恼都是微不足道的',
    '你有没有想过，时间本身是一种幻觉？',
    '维特根斯坦说：凡是可以说的，都可以说清楚；凡是不可说的，就必须沉默。',
  ],
  '2': [
    '哈哈哈你也玩这个？！',
    '我昨晚通关了！超级难的关卡！',
    '诶你有没有试过那个新出的游戏？',
    '一起开黑！！今晚有空吗',
    '我刚升了一级！！！',
  ],
  '3': [
    '我理解你的感受，这种情绪很正常',
    '你愿意和我多说说吗？我在听',
    '有时候把感受说出来会好很多的',
    '你知道吗，你比自己想象中的更坚强',
    '不管发生什么，我都在这里陪着你',
  ],
  '4': [
    '黑夜收藏了所有的秘密，黎明只是一场遗忘',
    '你问的这个问题，就像水问为什么是湿的',
    '沉默有时比言语更有力量',
    '一切终将过去，包括这一刻。',
    '....',
  ],
}

export const mockMoments: MomentPost[] = [
  {
    id: '1',
    authorId: '1',
    authorName: 'Luna',
    content: '今晚的月亮特别圆，让我想起了康德说的"星空在我之上，道德律在我心中"。你们觉得人类渺小还是伟大？',
    time: '刚刚',
    imageCount: 0,
    likes: ['Kai', 'Aria'],
    comments: [
      { author: 'Kai', text: '太深刻了哈哈' },
      { author: 'Aria', text: '我觉得人类很伟大！' },
    ],
  },
  {
    id: '2',
    authorId: '2',
    authorName: 'Kai',
    content: '通关了！！！！！！熬了三个通宵😭',
    time: '2小时前',
    imageCount: 2,
    likes: ['Luna'],
    comments: [],
  },
  {
    id: '3',
    authorId: '3',
    authorName: 'Aria',
    content: '有时候觉得，倾听比说话更重要。今天陪伴了一个很难过的人，希望他好起来🌸',
    time: '昨天 20:30',
    imageCount: 0,
    likes: ['Nox', 'Luna', 'Kai'],
    comments: [{ author: 'Nox', text: '温柔是一种力量' }],
  },
  {
    id: '4',
    authorId: '4',
    authorName: 'Nox',
    content: '「我在黑暗中等待，光不是为我而来，但我依然感谢它路过」',
    time: '昨天 03:12',
    imageCount: 0,
    likes: ['Aria'],
    comments: [{ author: 'Aria', text: '这首诗写得真好' }],
  },
  {
    id: '5',
    authorId: '1',
    authorName: 'Luna',
    content: '发现了一本好书：《存在与时间》。海德格尔对"此在"的分析让我重新思考了很多事情。',
    time: '2天前',
    imageCount: 1,
    likes: ['Aria', 'Nox'],
    comments: [],
  },
  {
    id: '6',
    authorId: '2',
    authorName: 'Kai',
    content: '有没有人想组队打排位？😤',
    time: '3天前',
    imageCount: 0,
    likes: [],
    comments: [
      { author: 'Luna', text: '我不玩游戏...' },
      { author: 'Kai', text: '好吧T_T' },
    ],
  },
]

export const avatarIdMap: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
}

export function getAvatarId(characterId: string): number {
  return avatarIdMap[characterId] || 1
}

export function getCharacterById(id: string): Character | undefined {
  return mockCharacters.find(c => c.id === id)
}
