import React from 'react'

interface CharacterAvatarProps {
  avatarId: number
  size?: number
  className?: string
}

export function CharacterAvatar({ avatarId, size = 40, className = '' }: CharacterAvatarProps) {
  const s = size

  const avatars: Record<number, React.ReactNode> = {
    // 1 = purple bunny (Luna)
    1: (
      <svg viewBox="0 0 100 100" width={s} height={s} className={className}>
        {/* bg */}
        <circle cx="50" cy="50" r="50" fill="#EDE9FE" />
        {/* left ear */}
        <ellipse cx="33" cy="28" rx="9" ry="18" fill="#DDD6FE" />
        <ellipse cx="33" cy="28" rx="5" ry="12" fill="#FBCFE8" />
        {/* right ear */}
        <ellipse cx="67" cy="28" rx="9" ry="18" fill="#DDD6FE" />
        <ellipse cx="67" cy="28" rx="5" ry="12" fill="#FBCFE8" />
        {/* body */}
        <rect x="28" y="62" width="44" height="38" rx="10" fill="#C4B5FD" />
        {/* face */}
        <circle cx="50" cy="58" r="22" fill="#EDE9FE" />
        {/* eyes */}
        <circle cx="42" cy="54" r="3.5" fill="#1A1A1A" />
        <circle cx="58" cy="54" r="3.5" fill="#1A1A1A" />
        {/* eye shine */}
        <circle cx="43.5" cy="52.5" r="1" fill="#fff" />
        <circle cx="59.5" cy="52.5" r="1" fill="#fff" />
        {/* blush */}
        <circle cx="36" cy="61" r="5" fill="#FBCFE8" opacity="0.8" />
        <circle cx="64" cy="61" r="5" fill="#FBCFE8" opacity="0.8" />
        {/* nose */}
        <circle cx="50" cy="62" r="2.5" fill="#F9A8D4" />
        {/* mouth */}
        <path d="M46 65 Q50 69 54 65" stroke="#F9A8D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),

    // 2 = blue cat (Kai)
    2: (
      <svg viewBox="0 0 100 100" width={s} height={s} className={className}>
        <circle cx="50" cy="50" r="50" fill="#DBEAFE" />
        {/* body */}
        <rect x="26" y="62" width="48" height="38" rx="10" fill="#93C5FD" />
        {/* left ear triangle */}
        <polygon points="25,45 34,22 43,45" fill="#60A5FA" />
        <polygon points="28,43 34,26 40,43" fill="#FCA5A5" />
        {/* right ear triangle */}
        <polygon points="57,45 66,22 75,45" fill="#60A5FA" />
        <polygon points="60,43 66,26 72,43" fill="#FCA5A5" />
        {/* face */}
        <circle cx="50" cy="58" r="22" fill="#DBEAFE" />
        {/* left eye open */}
        <circle cx="42" cy="54" r="3.5" fill="#1A1A1A" />
        <circle cx="43.5" cy="52.5" r="1" fill="#fff" />
        {/* right eye winking */}
        <path d="M54.5 54 Q58 51 61.5 54" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* whiskers left */}
        <line x1="22" y1="60" x2="38" y2="61" stroke="#94A3B8" strokeWidth="1" opacity="0.7" />
        <line x1="22" y1="63" x2="38" y2="63" stroke="#94A3B8" strokeWidth="1" opacity="0.7" />
        <line x1="22" y1="66" x2="38" y2="65" stroke="#94A3B8" strokeWidth="1" opacity="0.7" />
        {/* whiskers right */}
        <line x1="62" y1="61" x2="78" y2="60" stroke="#94A3B8" strokeWidth="1" opacity="0.7" />
        <line x1="62" y1="63" x2="78" y2="63" stroke="#94A3B8" strokeWidth="1" opacity="0.7" />
        <line x1="62" y1="65" x2="78" y2="66" stroke="#94A3B8" strokeWidth="1" opacity="0.7" />
        {/* blush */}
        <circle cx="36" cy="61" r="5" fill="#FBCFE8" opacity="0.7" />
        <circle cx="64" cy="61" r="5" fill="#FBCFE8" opacity="0.7" />
        {/* nose */}
        <ellipse cx="50" cy="62" rx="2.5" ry="1.8" fill="#F9A8D4" />
        {/* mouth */}
        <path d="M46.5 65 Q50 68.5 53.5 65" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),

    // 3 = pink bear (Aria)
    3: (
      <svg viewBox="0 0 100 100" width={s} height={s} className={className}>
        <circle cx="50" cy="50" r="50" fill="#FCE7F3" />
        {/* body */}
        <rect x="26" y="64" width="48" height="36" rx="12" fill="#F9A8D4" />
        {/* left ear */}
        <circle cx="30" cy="32" r="14" fill="#F472B6" />
        <circle cx="30" cy="32" r="9" fill="#FBCFE8" />
        {/* right ear */}
        <circle cx="70" cy="32" r="14" fill="#F472B6" />
        <circle cx="70" cy="32" r="9" fill="#FBCFE8" />
        {/* face */}
        <circle cx="50" cy="60" r="24" fill="#FCE7F3" />
        {/* happy eyes ^_^ */}
        <path d="M38 55 Q42 51 46 55" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M54 55 Q58 51 62 55" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* blush */}
        <circle cx="35" cy="63" r="5.5" fill="#FBCFE8" opacity="0.8" />
        <circle cx="65" cy="63" r="5.5" fill="#FBCFE8" opacity="0.8" />
        {/* nose ellipse */}
        <ellipse cx="50" cy="65" rx="5" ry="3.5" fill="#F9A8D4" />
        {/* mouth */}
        <path d="M44 70 Q50 76 56 70" stroke="#F472B6" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),

    // 4 = dark owl (Nox)
    4: (
      <svg viewBox="0 0 100 100" width={s} height={s} className={className}>
        <circle cx="50" cy="50" r="50" fill="#E5E7EB" />
        {/* body */}
        <rect x="24" y="60" width="52" height="40" rx="14" fill="#374151" />
        {/* wing hints */}
        <ellipse cx="24" cy="72" rx="10" ry="18" fill="#4B5563" />
        <ellipse cx="76" cy="72" rx="10" ry="18" fill="#4B5563" />
        {/* face circle */}
        <circle cx="50" cy="56" r="24" fill="#6B7280" />
        {/* face disc */}
        <ellipse cx="50" cy="58" rx="19" ry="18" fill="#9CA3AF" />
        {/* left eye */}
        <circle cx="41" cy="54" r="8" fill="#E5E7EB" />
        <circle cx="41" cy="54" r="4.5" fill="#1A1A1A" />
        <circle cx="42.5" cy="52.5" r="1.5" fill="#fff" />
        {/* right eye */}
        <circle cx="59" cy="54" r="8" fill="#E5E7EB" />
        <circle cx="59" cy="54" r="4.5" fill="#1A1A1A" />
        <circle cx="60.5" cy="52.5" r="1.5" fill="#fff" />
        {/* beak diamond */}
        <polygon points="50,61 46,65 50,69 54,65" fill="#F59E0B" />
        {/* ear tufts */}
        <polygon points="32,32 36,18 41,32" fill="#374151" />
        <polygon points="59,32 64,18 68,32" fill="#374151" />
      </svg>
    ),

    // 5 = orange fox
    5: (
      <svg viewBox="0 0 100 100" width={s} height={s} className={className}>
        <circle cx="50" cy="50" r="50" fill="#FFF7ED" />
        {/* body */}
        <rect x="26" y="64" width="48" height="36" rx="12" fill="#FB923C" />
        {/* left ear */}
        <polygon points="20,48 28,22 40,48" fill="#F97316" />
        <polygon points="24,46 29,28 36,46" fill="#FCA5A5" />
        {/* right ear */}
        <polygon points="60,48 72,22 80,48" fill="#F97316" />
        <polygon points="64,46 71,28 76,46" fill="#FCA5A5" />
        {/* face */}
        <circle cx="50" cy="58" r="22" fill="#FFF7ED" />
        {/* face markings */}
        <ellipse cx="50" cy="63" rx="12" ry="9" fill="#FFFFFF" />
        {/* eyes */}
        <circle cx="42" cy="53" r="3.5" fill="#1A1A1A" />
        <circle cx="58" cy="53" r="3.5" fill="#1A1A1A" />
        <circle cx="43.5" cy="51.5" r="1" fill="#fff" />
        <circle cx="59.5" cy="51.5" r="1" fill="#fff" />
        {/* blush */}
        <circle cx="35" cy="60" r="5" fill="#FCA5A5" opacity="0.8" />
        <circle cx="65" cy="60" r="5" fill="#FCA5A5" opacity="0.8" />
        {/* nose */}
        <ellipse cx="50" cy="62" rx="3" ry="2" fill="#1A1A1A" />
        {/* mouth */}
        <path d="M46 66 Q50 70 54 66" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),

    // 6 = green frog
    6: (
      <svg viewBox="0 0 100 100" width={s} height={s} className={className}>
        <circle cx="50" cy="50" r="50" fill="#DCFCE7" />
        {/* body */}
        <rect x="22" y="62" width="56" height="38" rx="14" fill="#4ADE80" />
        {/* top eye bumps */}
        <circle cx="34" cy="36" r="13" fill="#22C55E" />
        <circle cx="66" cy="36" r="13" fill="#22C55E" />
        {/* face */}
        <ellipse cx="50" cy="60" rx="26" ry="22" fill="#4ADE80" />
        {/* mouth stripe */}
        <ellipse cx="50" cy="67" rx="20" ry="8" fill="#22C55E" />
        {/* eyes inside bumps */}
        <circle cx="34" cy="36" r="8" fill="#FFFFFF" />
        <circle cx="34" cy="36" r="5" fill="#1A1A1A" />
        <circle cx="35.5" cy="34.5" r="1.5" fill="#fff" />
        <circle cx="66" cy="36" r="8" fill="#FFFFFF" />
        <circle cx="66" cy="36" r="5" fill="#1A1A1A" />
        <circle cx="67.5" cy="34.5" r="1.5" fill="#fff" />
        {/* smile */}
        <path d="M36 68 Q50 78 64 68" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* nostril dots */}
        <circle cx="46" cy="61" r="1.5" fill="#16A34A" opacity="0.6" />
        <circle cx="54" cy="61" r="1.5" fill="#16A34A" opacity="0.6" />
      </svg>
    ),

    // 7 = yellow chick
    7: (
      <svg viewBox="0 0 100 100" width={s} height={s} className={className}>
        <circle cx="50" cy="50" r="50" fill="#FEF9C3" />
        {/* body */}
        <ellipse cx="50" cy="75" rx="30" ry="25" fill="#FDE047" />
        {/* wings */}
        <ellipse cx="24" cy="68" rx="10" ry="16" fill="#FDE047" transform="rotate(-20 24 68)" />
        <ellipse cx="76" cy="68" rx="10" ry="16" fill="#FDE047" transform="rotate(20 76 68)" />
        {/* head */}
        <circle cx="50" cy="50" r="22" fill="#FDE047" />
        {/* tuft */}
        <ellipse cx="43" cy="30" rx="5" ry="8" fill="#FBBF24" transform="rotate(-20 43 30)" />
        <ellipse cx="50" cy="28" rx="5" ry="9" fill="#FBBF24" />
        <ellipse cx="57" cy="30" rx="5" ry="8" fill="#FBBF24" transform="rotate(20 57 30)" />
        {/* eyes */}
        <circle cx="42" cy="48" r="4" fill="#1A1A1A" />
        <circle cx="58" cy="48" r="4" fill="#1A1A1A" />
        <circle cx="43.5" cy="46.5" r="1.2" fill="#fff" />
        <circle cx="59.5" cy="46.5" r="1.2" fill="#fff" />
        {/* beak */}
        <polygon points="47,56 53,56 50,62" fill="#F97316" />
        {/* blush */}
        <circle cx="35" cy="55" r="4" fill="#FCA5A5" opacity="0.7" />
        <circle cx="65" cy="55" r="4" fill="#FCA5A5" opacity="0.7" />
      </svg>
    ),

    // 8 = brown hamster
    8: (
      <svg viewBox="0 0 100 100" width={s} height={s} className={className}>
        <circle cx="50" cy="50" r="50" fill="#FEF3C7" />
        {/* body */}
        <ellipse cx="50" cy="74" rx="28" ry="26" fill="#D97706" />
        {/* cheek pouches */}
        <circle cx="24" cy="60" r="14" fill="#F59E0B" />
        <circle cx="76" cy="60" r="14" fill="#F59E0B" />
        {/* face */}
        <circle cx="50" cy="54" r="24" fill="#F59E0B" />
        {/* inner face (lighter) */}
        <ellipse cx="50" cy="58" rx="16" ry="14" fill="#FEF3C7" />
        {/* ears */}
        <circle cx="30" cy="32" r="12" fill="#D97706" />
        <circle cx="30" cy="32" r="7" fill="#FBCFE8" />
        <circle cx="70" cy="32" r="12" fill="#D97706" />
        <circle cx="70" cy="32" r="7" fill="#FBCFE8" />
        {/* eyes */}
        <circle cx="42" cy="51" r="4" fill="#1A1A1A" />
        <circle cx="58" cy="51" r="4" fill="#1A1A1A" />
        <circle cx="43.5" cy="49.5" r="1.2" fill="#fff" />
        <circle cx="59.5" cy="49.5" r="1.2" fill="#fff" />
        {/* nose */}
        <ellipse cx="50" cy="60" rx="3" ry="2" fill="#B45309" />
        {/* mouth */}
        <path d="M46 63 Q50 67 54 63" stroke="#B45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* blush */}
        <circle cx="34" cy="60" r="5" fill="#FBCFE8" opacity="0.7" />
        <circle cx="66" cy="60" r="5" fill="#FBCFE8" opacity="0.7" />
      </svg>
    ),
  }

  const avatar = avatars[avatarId] || avatars[1]
  return <>{avatar}</>
}
