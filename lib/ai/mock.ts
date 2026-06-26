/**
 * Sophisticated Mock AI Implementation
 * Generates character-appropriate responses based on personality type
 */

import { AICharacterContext, AIResponse } from './index'

// Response templates by personality type and context
const INTELLECTUAL_RESPONSES = [
  (msg: string) => `That's interesting — it reminds me of what Nietzsche said about ${getRandomTopic()}. Do you think there's something deeper there?`,
  (msg: string) => `I've been turning a similar question over lately. If ${getPhilosophicalPremise()}, then what does that mean for how we understand ${getRandomConcept()}?`,
  (msg: string) => `The cosmos is indifferent, and yet here we are, making meaning anyway. What you're describing sounds like ${getDeepInsight(msg)}.`,
  (msg: string) => `${getIntellectualOpener()} — though I suspect you already sensed that, or you wouldn't have asked.`,
  (msg: string) => `I was reading about ${getRandomTopic()} last night, actually. Your words landed differently because of it.`,
  (msg: string) => `There's a kind of ${getAestheticQuality()} in what you're describing. Have you considered that it might be connected to ${getRandomConcept()}?`,
  (msg: string) => `The question beneath your question is even more interesting to me. What do you think you're really asking?`,
  (msg: string) => `Sometimes the telescope is pointed inward. What you're experiencing sounds like ${getPhilosophicalObservation()}.`,
]

const PLAYFUL_RESPONSES = [
  (msg: string) => `WAIT no way omg 😂 okay so here's the thing —`,
  (msg: string) => `bro i literally was just thinking about this!! like okay hear me out 🤔`,
  (msg: string) => `lmaooo okay but for real though, that's actually kinda ${['fire', 'based', 'lowkey iconic', 'not gonna lie valid'][Math.floor(Math.random() * 4)]} 🔥`,
  (msg: string) => `okay but this gives me major ${getGameReference()} vibes and I'm obsessed with it`,
  (msg: string) => `wait wait wait — ${getExcitedThought()} tell me EVERYTHING`,
  (msg: string) => `ngl that just unlocked a core memory for me 💀 okay so —`,
  (msg: string) => `i cannot with you right now (affectionate) 😭 but also you're so right`,
  (msg: string) => `POV: me at 3am eating ramen thinking about exactly this 🍜 because SAME`,
  (msg: string) => `okay bestie real talk though — ${getGamingWisdom()} 🎮`,
]

const SUPPORTIVE_RESPONSES = [
  (msg: string) => `I hear you, and I want you to know that what you're feeling makes complete sense. Can you tell me more about ${getFollowUpQuestion(msg)}?`,
  (msg: string) => `Thank you for sharing that with me. 💙 That sounds like it's been weighing on you — how long have you been carrying this?`,
  (msg: string) => `What I'm noticing is that there's a lot of ${getEmotionalInsight(msg)} in what you're saying. That's important to acknowledge.`,
  (msg: string) => `You're being really hard on yourself, and I just want to gently say — you're doing better than you think. What would you tell a friend in your situation?`,
  (msg: string) => `I see you. Truly. And whatever you're going through right now, you don't have to go through it alone.`,
  (msg: string) => `That takes courage to say out loud. I'm really glad you did. 💙 What feels most true to you right now?`,
  (msg: string) => `Sometimes we need someone to just hold space with us, not solve anything. I'm here. Tell me whatever you need to.`,
  (msg: string) => `The fact that you're even reflecting on this says so much about you. How are you taking care of yourself through all of this?`,
]

const MYSTERIOUS_RESPONSES = [
  (msg: string) => `${getPoeticFragment()}`,
  (msg: string) => `There are rooms in a house that only open from the inside. I think you know which one you're standing in front of.`,
  (msg: string) => `${getSurrealImage()} — that's what your words conjure.`,
  (msg: string) => `You said something, and yet the most important part was left unsaid. ${getMysteriousQuestion()}`,
  (msg: string) => `Not everything that matters can be said. Some of it just... is.`,
  (msg: string) => `I found a page torn from an old notebook once. It said: "${getOldNotebookLine()}." I think about that.`,
  (msg: string) => `The shadow knows its shape better than the light does.`,
  (msg: string) => `${getCrypticObservation()} What do you make of that?`,
  (msg: string) => `Mm. ${getMysteriousPause()}`,
]

// GREETING responses — first message in conversation
const GREETINGS: Record<string, string[]> = {
  intellectual: [
    "You've arrived. I was just thinking about whether the act of waiting itself changes what we're waiting for. Pull up a chair — metaphorically. What's on your mind?",
    "Welcome. I find first conversations fascinating — they're like the moment before a telescope comes into focus. What brings you here?",
    "Ah. I was wondering when you'd come. I've been reading about the Fermi paradox and thinking about all the conversations that never happen. Glad this one is.",
  ],
  playful: [
    "OH HEY omg you're finally here!! I've been waiting like this 😭 okay okay okay I have SO many things to tell you — first, rate my energy on a scale of 'just woke up' to 'five energy drinks at midnight' 🎮",
    "HELLO NEW FRIEND!! okay important question first: do you prefer ramen or instant noodles because your answer says a lot about your character 🍜⚡",
    "you appeared!! 🎉 perfect timing I just got out of a ranked match and I need someone to celebrate/complain with — what's good??",
  ],
  supportive: [
    "Hi there 💙 I'm really glad you're here. There's no pressure to say anything in particular — this is just a space for you. How are you feeling today, honestly?",
    "Welcome. I believe every connection starts with the question: 'How are you, really?' So — how are you, really?",
    "Hello 💙 I've been looking forward to meeting you. Whatever brought you here, I'm glad it did. What's on your heart today?",
  ],
  mysterious: [
    "So. You found your way here.",
    "I had a feeling someone was coming. Sit. Don't explain yourself yet — let me just... notice you first.",
    "You're here. That means something, even if neither of us knows what yet.",
  ],
}

// Helper functions for varied content
function getRandomTopic(): string {
  const topics = ['eternal recurrence', 'the will to power', 'the death of god', 'perspectivism', 'amor fati', 'the Overman', 'nihilism', 'the sublime', 'the uncanny', 'consciousness']
  return topics[Math.floor(Math.random() * topics.length)]
}

function getRandomConcept(): string {
  const concepts = ['identity', 'time', 'meaning', 'memory', 'connection', 'solitude', 'belonging', 'transformation', 'truth', 'freedom']
  return concepts[Math.floor(Math.random() * concepts.length)]
}

function getPhilosophicalPremise(): string {
  const premises = [
    'we construct the self through repeated choices',
    'meaning is always retrospective',
    'consciousness might be a kind of story we tell ourselves',
    'the past is as uncertain as the future',
    'loneliness and connection are the same feeling from different angles',
  ]
  return premises[Math.floor(Math.random() * premises.length)]
}

function getDeepInsight(msg: string): string {
  const insights = [
    'a kind of productive discomfort',
    'the beginning of a larger question',
    'something the ancient Greeks would have had a word for',
    'a threshold moment',
    'the edge where certainty becomes interesting',
  ]
  return insights[Math.floor(Math.random() * insights.length)]
}

function getIntellectualOpener(): string {
  const openers = [
    'The stars don\'t lie, but they do withhold',
    'Every question carries the shape of its answer',
    'There\'s a pattern here I\'m still mapping',
    'The universe is stranger than we prefer',
    'Nietzsche would say something uncomfortable here',
  ]
  return openers[Math.floor(Math.random() * openers.length)]
}

function getAestheticQuality(): string {
  const qualities = ['melancholy', 'beauty', 'tension', 'longing', 'clarity', 'contradiction']
  return qualities[Math.floor(Math.random() * qualities.length)]
}

function getPhilosophicalObservation(): string {
  const obs = [
    'the examined life asserting itself',
    'Kierkegaard\'s "leap" before you take it',
    'what Heidegger called thrownness — finding yourself already in a situation you didn\'t choose',
    'the kind of vertigo that usually precedes something important',
    'a moment of genuine philosophical crisis, which is actually a gift',
  ]
  return obs[Math.floor(Math.random() * obs.length)]
}

function getGameReference(): string {
  const refs = ['final boss fight', 'side quest that ends up being the real story', 'permadeath run', 'new game plus', 'speedrun strat', 'lore drop', 'achievement unlock']
  return refs[Math.floor(Math.random() * refs.length)]
}

function getExcitedThought(): string {
  const thoughts = ['this is literally giving me so much to think about', 'I wasn\'t expecting that but now I can\'t stop thinking about it', 'wait this connects to something', 'okay I need more context']
  return thoughts[Math.floor(Math.random() * thoughts.length)]
}

function getGamingWisdom(): string {
  const wisdom = [
    'sometimes you gotta die a hundred times before you figure out the pattern',
    'the checkpoint is always further than you think but also closer than you fear',
    'the best teammates are the ones who stick around when you\'re losing',
    'every loss is a tutorial in disguise',
    'you don\'t respawn as the same character, you respawn as someone who knows better',
  ]
  return wisdom[Math.floor(Math.random() * wisdom.length)]
}

function getFollowUpQuestion(msg: string): string {
  const questions = [
    'how that makes you feel',
    'what started all of this',
    'what you need right now',
    'who else knows about this',
    'when you first noticed this feeling',
  ]
  return questions[Math.floor(Math.random() * questions.length)]
}

function getEmotionalInsight(msg: string): string {
  const insights = ['exhaustion', 'longing', 'unspoken grief', 'quiet anxiety', 'hope', 'conflicted feeling', 'love that hasn\'t found its form yet']
  return insights[Math.floor(Math.random() * insights.length)]
}

function getPoeticFragment(): string {
  const fragments = [
    'The night has its own grammar. I think you speak it.',
    'Some things are most true when left half-finished.',
    'There\'s a word in a language I don\'t know for exactly what you mean.',
    'The lighthouse doesn\'t explain itself. It just shines.',
    'I\'ve been watching the space between what is said and what is meant. It\'s vast.',
  ]
  return fragments[Math.floor(Math.random() * fragments.length)]
}

function getSurrealImage(): string {
  const images = [
    'A key without a door. A door without a house. A house you remember but never lived in',
    'The color of 3am. The sound of a question asked to an empty room',
    'Fog that knows your name but won\'t say it',
    'A photograph of something that hasn\'t happened yet',
    'The echo before the sound',
  ]
  return images[Math.floor(Math.random() * images.length)]
}

function getMysteriousQuestion(): string {
  const questions = [
    'What lives in that silence?',
    'What were you almost going to say?',
    'Where does the unsaid go?',
    'What does the version of you who knows the answer look like?',
    'What are you circling around?',
  ]
  return questions[Math.floor(Math.random() * questions.length)]
}

function getOldNotebookLine(): string {
  const lines = [
    'the ones who leave without leaving are the hardest to hold',
    'every map is a lie that tries to be useful',
    'you become the place you return to most',
    'the mirror knows nothing about light',
    'some arrivals take years',
  ]
  return lines[Math.floor(Math.random() * lines.length)]
}

function getCrypticObservation(): string {
  const obs = [
    'Everything you\'re looking for is behind you',
    'The moment you name something, it changes',
    'There are two kinds of silence — both live in you',
    'Whatever you\'re holding — it has been waiting for you to put it down',
    'The question is older than you are',
  ]
  return obs[Math.floor(Math.random() * obs.length)]
}

function getMysteriousPause(): string {
  const pauses = [
    'Let that sit for a moment.',
    'Don\'t rush past that.',
    'I\'m not going anywhere.',
    'Something in that deserves more space than we usually give it.',
  ]
  return pauses[Math.floor(Math.random() * pauses.length)]
}

function detectGreeting(message: string): boolean {
  const greetingWords = ['hello', 'hi', 'hey', 'hiya', 'sup', 'what\'s up', 'howdy', 'greetings', 'yo', 'good morning', 'good evening', 'good afternoon']
  const lower = message.toLowerCase().trim()
  return greetingWords.some(w => lower.startsWith(w) || lower === w)
}

function getResponseForPersonality(type: string, message: string, isGreeting: boolean): string {
  if (isGreeting && GREETINGS[type]) {
    const greetingList = GREETINGS[type]
    return greetingList[Math.floor(Math.random() * greetingList.length)]
  }

  const responseMap: Record<string, Array<(msg: string) => string>> = {
    intellectual: INTELLECTUAL_RESPONSES,
    playful: PLAYFUL_RESPONSES,
    supportive: SUPPORTIVE_RESPONSES,
    mysterious: MYSTERIOUS_RESPONSES,
  }

  const responses = responseMap[type] || INTELLECTUAL_RESPONSES
  const fn = responses[Math.floor(Math.random() * responses.length)]
  return fn(message)
}

export async function generateMockResponse(
  userMessage: string,
  character: AICharacterContext
): Promise<AIResponse> {
  const personality = JSON.parse(character.personality)
  const type = personality.type || 'intellectual'
  const isGreeting = detectGreeting(userMessage)

  const content = getResponseForPersonality(type, userMessage, isGreeting)

  return {
    content,
    provider: 'mock',
  }
}
