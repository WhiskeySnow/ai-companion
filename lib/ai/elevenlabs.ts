/**
 * ElevenLabs Voice Provider — Reserved for future implementation
 * Set ELEVENLABS_API_KEY in .env.local to activate
 */

export interface VoiceOptions {
  voiceId: string
  text: string
  modelId?: string
  stability?: number
  similarityBoost?: number
}

export async function generateVoice(options: VoiceOptions): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not set')
  }

  const { voiceId, text, modelId = 'eleven_turbo_v2', stability = 0.5, similarityBoost = 0.8 } = options

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`)
  }

  return response.arrayBuffer()
}

export async function listVoices() {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not set')
  }

  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': apiKey,
    },
  })

  return response.json()
}
