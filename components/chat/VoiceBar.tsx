'use client'

/**
 * VoiceBar — Reserved stub for ElevenLabs voice integration
 *
 * Future: Show a floating voice call UI with waveform visualization
 * and real-time voice chat with AI characters.
 */

interface VoiceBarProps {
  characterName: string
  onEnd: () => void
}

export function VoiceBar({ characterName, onEnd }: VoiceBarProps) {
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-background-secondary/95 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center gap-4">
      {/* Waveform placeholder */}
      <div className="flex-1 flex items-center gap-1 h-8">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-full bg-accent-purple/50"
            style={{
              height: `${Math.random() * 100}%`,
              animation: `pulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      <div className="text-xs text-white/50">
        Calling {characterName}...
      </div>

      <button
        onClick={onEnd}
        className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors"
      >
        <span className="text-white text-xs font-medium">End</span>
      </button>
    </div>
  )
}
