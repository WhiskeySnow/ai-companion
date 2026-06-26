'use client'

/**
 * RelationshipWeb — Reserved stub for interactive relationship graph
 *
 * Future: Show a force-directed graph of AI character relationships
 * with animated edges showing relationship types and intimacy levels.
 * Could use D3.js or similar visualization library.
 */

interface Relationship {
  characterAId: string
  characterBId: string
  relationship: string
  intimacy: number
  notes?: string | null
}

interface RelationshipWebProps {
  characterId: string
  relationships: Relationship[]
  characters: Array<{ id: string; name: string }>
}

const relationshipColors: Record<string, string> = {
  besties: '#ec4899',
  friends: '#8b5cf6',
  rivals: '#ef4444',
  crushes: '#f97316',
}

export function RelationshipWeb({ characterId, relationships, characters }: RelationshipWebProps) {
  if (relationships.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-white/30 text-sm">
        No relationships yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {relationships.map((rel) => {
        const otherId = rel.characterAId === characterId ? rel.characterBId : rel.characterAId
        const other = characters.find(c => c.id === otherId)
        if (!other) return null

        const color = relationshipColors[rel.relationship] || '#6b7280'

        return (
          <div
            key={`${rel.characterAId}-${rel.characterBId}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8"
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{other.name}</div>
              <div className="text-xs text-white/40 capitalize">{rel.relationship}</div>
            </div>
            {/* Intimacy bar */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${rel.intimacy}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-xs text-white/30">{rel.intimacy}</span>
            </div>
          </div>
        )
      })}

      <p className="text-xs text-white/20 text-center pt-2">
        Interactive graph visualization coming soon
      </p>
    </div>
  )
}
