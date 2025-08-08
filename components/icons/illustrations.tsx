// リッチなイラスト風SVGアイコンコンポーネント

export const HappyFaceIcon = ({ size = 48, primaryColor = '#a3e635', secondaryColor = '#fbbf24' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 顔のベース */}
    <circle cx="50" cy="50" r="40" fill={secondaryColor} opacity="0.2"/>
    <circle cx="50" cy="50" r="38" fill={secondaryColor}/>
    <circle cx="50" cy="50" r="36" fill="#fff9e6"/>
    
    {/* ほっぺ */}
    <ellipse cx="25" cy="55" rx="8" ry="6" fill="#ffb3ba" opacity="0.6"/>
    <ellipse cx="75" cy="55" rx="8" ry="6" fill="#ffb3ba" opacity="0.6"/>
    
    {/* 目 */}
    <ellipse cx="35" cy="45" rx="8" ry="10" fill="#111827"/>
    <ellipse cx="65" cy="45" rx="8" ry="10" fill="#111827"/>
    <ellipse cx="37" cy="43" rx="3" ry="4" fill="white"/>
    <ellipse cx="67" cy="43" rx="3" ry="4" fill="white"/>
    
    {/* 口 */}
    <path d="M 35 60 Q 50 70 65 60" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round"/>
    
    {/* キラキラ */}
    <path d="M 15 20 L 17 25 L 22 23 L 17 27 L 19 32 L 15 28 L 11 32 L 13 27 L 8 23 L 13 25 Z" fill={primaryColor} opacity="0.8"/>
    <path d="M 78 15 L 79 17 L 81 16 L 79 18 L 80 20 L 78 18 L 76 20 L 77 18 L 75 16 L 77 17 Z" fill={primaryColor}/>
  </svg>
)

export const SadFaceIcon = ({ size = 48, primaryColor = '#60a5fa', secondaryColor = '#93c5fd' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill={primaryColor} opacity="0.2"/>
    <circle cx="50" cy="50" r="38" fill={primaryColor}/>
    <circle cx="50" cy="50" r="36" fill="#e6f3ff"/>
    
    {/* 涙 */}
    <ellipse cx="35" cy="58" rx="4" ry="8" fill="#60a5fa" opacity="0.6"/>
    <ellipse cx="65" cy="58" rx="4" ry="8" fill="#60a5fa" opacity="0.6"/>
    
    {/* 目 */}
    <path d="M 30 45 L 40 48" stroke="#111827" strokeWidth="3" strokeLinecap="round"/>
    <path d="M 40 45 L 30 48" stroke="#111827" strokeWidth="3" strokeLinecap="round"/>
    <path d="M 60 45 L 70 48" stroke="#111827" strokeWidth="3" strokeLinecap="round"/>
    <path d="M 70 45 L 60 48" stroke="#111827" strokeWidth="3" strokeLinecap="round"/>
    
    {/* 口 */}
    <path d="M 35 65 Q 50 60 65 65" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round"/>
    
    {/* 雨雲 */}
    <ellipse cx="50" cy="15" rx="15" ry="8" fill="#94a3b8" opacity="0.4"/>
    <circle cx="45" cy="13" r="6" fill="#94a3b8" opacity="0.4"/>
    <circle cx="55" cy="13" r="6" fill="#94a3b8" opacity="0.4"/>
  </svg>
)

export const HeartHandsIcon = ({ size = 48, primaryColor = '#ef4444', secondaryColor = '#fca5a5' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 手 */}
    <path d="M 25 60 Q 20 50 25 45 Q 30 42 35 45 L 35 55 Q 30 58 25 60" fill="#fdbcb4"/>
    <path d="M 75 60 Q 80 50 75 45 Q 70 42 65 45 L 65 55 Q 70 58 75 60" fill="#fdbcb4"/>
    
    {/* ハート */}
    <path d="M 50 35 C 45 25, 30 25, 30 38 C 30 50, 50 70, 50 70 C 50 70, 70 50, 70 38 C 70 25, 55 25, 50 35 Z" fill={primaryColor}/>
    <path d="M 50 35 C 47 30, 37 30, 37 38 C 37 45, 50 60, 50 60 C 50 60, 63 45, 63 38 C 63 30, 53 30, 50 35 Z" fill={secondaryColor}/>
    
    {/* ハイライト */}
    <ellipse cx="40" cy="38" rx="4" ry="5" fill="white" opacity="0.6"/>
    
    {/* 小さなハート */}
    <path d="M 20 25 C 18 22, 14 22, 14 25 C 14 28, 20 33, 20 33 C 20 33, 26 28, 26 25 C 26 22, 22 22, 20 25 Z" fill={secondaryColor} opacity="0.6"/>
    <path d="M 80 30 C 78 27, 74 27, 74 30 C 74 33, 80 38, 80 38 C 80 38, 86 33, 86 30 C 86 27, 82 27, 80 30 Z" fill={secondaryColor} opacity="0.6"/>
  </svg>
)

export const MeditationIcon = ({ size = 48, primaryColor = '#a3e635', secondaryColor = '#84cc16' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* オーラ */}
    <circle cx="50" cy="50" r="45" fill={primaryColor} opacity="0.1"/>
    <circle cx="50" cy="50" r="38" fill={primaryColor} opacity="0.15"/>
    <circle cx="50" cy="50" r="30" fill={primaryColor} opacity="0.2"/>
    
    {/* 体 */}
    <ellipse cx="50" cy="65" rx="20" ry="15" fill="#8b5cf6"/>
    
    {/* 頭 */}
    <circle cx="50" cy="35" r="15" fill="#fdbcb4"/>
    
    {/* 髪 */}
    <path d="M 35 30 Q 35 25, 40 25 Q 45 23, 50 23 Q 55 23, 60 25 Q 65 25, 65 30" fill="#4a5568"/>
    
    {/* 目（閉じている） */}
    <path d="M 42 35 Q 45 37, 48 35" stroke="#111827" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M 52 35 Q 55 37, 58 35" stroke="#111827" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    
    {/* 口（微笑み） */}
    <path d="M 45 40 Q 50 42, 55 40" stroke="#111827" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    
    {/* 手（合掌） */}
    <ellipse cx="50" cy="60" rx="8" ry="12" fill="#fdbcb4"/>
    <line x1="50" y1="55" x2="50" y2="65" stroke="#e9967a" strokeWidth="0.5"/>
    
    {/* 蓮の花 */}
    <ellipse cx="50" cy="85" rx="12" ry="4" fill={secondaryColor} opacity="0.4"/>
    <path d="M 45 85 Q 45 82, 47 82 Q 49 81, 50 81 Q 51 81, 53 82 Q 55 82, 55 85" fill="#fca5a5" opacity="0.8"/>
    <path d="M 43 85 Q 43 83, 45 83" fill="#fca5a5" opacity="0.6"/>
    <path d="M 57 85 Q 57 83, 55 83" fill="#fca5a5" opacity="0.6"/>
  </svg>
)

export const SleepingIcon = ({ size = 48, primaryColor = '#6366f1', secondaryColor = '#a5b4fc' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 月 */}
    <path d="M 70 20 Q 65 15, 65 25 Q 65 35, 70 30 Q 80 30, 80 25 Q 80 20, 70 20" fill="#fbbf24" opacity="0.8"/>
    
    {/* 星 */}
    <path d="M 20 15 L 21 18 L 24 17 L 21 19 L 22 22 L 20 20 L 18 22 L 19 19 L 16 17 L 19 18 Z" fill="#fbbf24" opacity="0.6"/>
    <path d="M 85 35 L 86 37 L 88 36 L 86 38 L 87 40 L 85 38 L 83 40 L 84 38 L 82 36 L 84 37 Z" fill="#fbbf24" opacity="0.6"/>
    
    {/* 枕 */}
    <ellipse cx="50" cy="70" rx="25" ry="8" fill={secondaryColor}/>
    
    {/* 顔 */}
    <circle cx="50" cy="50" r="20" fill="#fdbcb4"/>
    
    {/* 髪 */}
    <path d="M 30 45 Q 30 40, 35 40 Q 40 38, 50 38 Q 60 38, 65 40 Q 70 40, 70 45" fill="#8b5a2b"/>
    
    {/* 閉じた目 */}
    <path d="M 40 50 Q 43 52, 46 50" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M 54 50 Q 57 52, 60 50" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round"/>
    
    {/* 口 */}
    <circle cx="50" cy="56" r="2" fill="#111827" opacity="0.3"/>
    
    {/* Zzz */}
    <text x="72" y="45" fontSize="14" fill={primaryColor} fontWeight="bold" opacity="0.8">Z</text>
    <text x="78" y="38" fontSize="11" fill={primaryColor} fontWeight="bold" opacity="0.6">z</text>
    <text x="82" y="32" fontSize="8" fill={primaryColor} fontWeight="bold" opacity="0.4">z</text>
    
    {/* 布団 */}
    <path d="M 25 60 Q 25 55, 30 55 L 70 55 Q 75 55, 75 60 L 75 75 Q 75 80, 70 80 L 30 80 Q 25 80, 25 75 Z" fill={primaryColor} opacity="0.3"/>
    <rect x="25" y="65" width="50" height="2" fill="white" opacity="0.3"/>
  </svg>
)

export const StressedIcon = ({ size = 48, primaryColor = '#ef4444', secondaryColor = '#fca5a5' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 稲妻効果 */}
    <path d="M 20 10 L 25 25 L 20 25 L 30 40 L 22 28 L 27 28 Z" fill={primaryColor} opacity="0.6"/>
    <path d="M 75 15 L 78 25 L 75 25 L 82 35 L 77 28 L 80 28 Z" fill={primaryColor} opacity="0.6"/>
    
    {/* 顔 */}
    <circle cx="50" cy="50" r="25" fill={secondaryColor}/>
    <circle cx="50" cy="50" r="23" fill="#ffe0e0"/>
    
    {/* 汗 */}
    <ellipse cx="30" cy="40" rx="3" ry="5" fill="#60a5fa" opacity="0.6"/>
    <ellipse cx="70" cy="42" rx="3" ry="5" fill="#60a5fa" opacity="0.6"/>
    
    {/* 目 */}
    <path d="M 35 48 Q 40 45, 45 48" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M 55 48 Q 60 45, 65 48" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    
    {/* 口 */}
    <path d="M 40 60 L 60 60" stroke="#111827" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M 40 60 Q 45 58, 50 60 Q 55 58, 60 60" stroke="#111827" strokeWidth="2" fill="none"/>
    
    {/* ストレスマーク */}
    <text x="25" y="30" fontSize="10" fill={primaryColor} fontWeight="bold">!</text>
    <text x="70" y="30" fontSize="10" fill={primaryColor} fontWeight="bold">!</text>
  </svg>
)

export const CalmIcon = ({ size = 48, primaryColor = '#10b981', secondaryColor = '#86efac' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 水の波紋 */}
    <circle cx="50" cy="50" r="40" fill="none" stroke={primaryColor} strokeWidth="0.5" opacity="0.3">
      <animate attributeName="r" from="20" to="45" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.6" to="0" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="50" cy="50" r="40" fill="none" stroke={primaryColor} strokeWidth="0.5" opacity="0.3">
      <animate attributeName="r" from="20" to="45" dur="3s" begin="1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.6" to="0" dur="3s" begin="1s" repeatCount="indefinite"/>
    </circle>
    
    {/* 顔 */}
    <circle cx="50" cy="50" r="22" fill={secondaryColor}/>
    <circle cx="50" cy="50" r="20" fill="#e6fffa"/>
    
    {/* 閉じた目 */}
    <path d="M 38 48 Q 42 50, 46 48" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M 54 48 Q 58 50, 62 48" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round"/>
    
    {/* 穏やかな口 */}
    <path d="M 42 56 Q 50 58, 58 56" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round"/>
    
    {/* 葉っぱ */}
    <path d="M 25 70 Q 30 65, 35 70 Q 30 72, 25 70" fill={primaryColor} opacity="0.6"/>
    <path d="M 65 70 Q 70 65, 75 70 Q 70 72, 65 70" fill={primaryColor} opacity="0.6"/>
  </svg>
)

export const EnergeticIcon = ({ size = 48, primaryColor = '#f59e0b', secondaryColor = '#fcd34d' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 光線 */}
    <path d="M 50 20 L 52 10 L 54 20" fill={primaryColor} opacity="0.8"/>
    <path d="M 50 80 L 52 90 L 54 80" fill={primaryColor} opacity="0.8"/>
    <path d="M 20 50 L 10 52 L 20 54" fill={primaryColor} opacity="0.8"/>
    <path d="M 80 50 L 90 52 L 80 54" fill={primaryColor} opacity="0.8"/>
    <path d="M 30 30 L 23 23 L 30 32" fill={primaryColor} opacity="0.6"/>
    <path d="M 70 30 L 77 23 L 70 32" fill={primaryColor} opacity="0.6"/>
    <path d="M 30 70 L 23 77 L 32 70" fill={primaryColor} opacity="0.6"/>
    <path d="M 70 70 L 77 77 L 68 70" fill={primaryColor} opacity="0.6"/>
    
    {/* 顔 */}
    <circle cx="50" cy="50" r="25" fill={secondaryColor}/>
    <circle cx="50" cy="50" r="23" fill="#fff7ed"/>
    
    {/* キラキラ目 */}
    <circle cx="40" cy="45" r="5" fill="#111827"/>
    <circle cx="60" cy="45" r="5" fill="#111827"/>
    <circle cx="42" cy="43" r="2" fill="white"/>
    <circle cx="62" cy="43" r="2" fill="white"/>
    <path d="M 38 40 L 40 38 L 42 40" fill="none" stroke={primaryColor} strokeWidth="1.5"/>
    <path d="M 58 40 L 60 38 L 62 40" fill="none" stroke={primaryColor} strokeWidth="1.5"/>
    
    {/* 大きな笑顔 */}
    <path d="M 35 55 Q 50 65 65 55" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M 35 55 Q 50 68 65 55" fill={primaryColor} opacity="0.3"/>
    
    {/* ほっぺの赤み */}
    <circle cx="30" cy="52" r="4" fill="#ff6b6b" opacity="0.4"/>
    <circle cx="70" cy="52" r="4" fill="#ff6b6b" opacity="0.4"/>
  </svg>
)

export const ThinkingIcon = ({ size = 48, primaryColor = '#8b5cf6', secondaryColor = '#c4b5fd' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 思考の泡 */}
    <circle cx="70" cy="25" r="4" fill={primaryColor} opacity="0.3"/>
    <circle cx="75" cy="20" r="6" fill={primaryColor} opacity="0.4"/>
    <circle cx="80" cy="15" r="8" fill={primaryColor} opacity="0.5"/>
    
    {/* 顔 */}
    <circle cx="50" cy="50" r="25" fill={secondaryColor}/>
    <circle cx="50" cy="50" r="23" fill="#f3e8ff"/>
    
    {/* 考えている目 */}
    <circle cx="38" cy="45" r="3" fill="#111827"/>
    <path d="M 55 45 Q 60 43, 65 45" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    
    {/* 手（あごに） */}
    <ellipse cx="55" cy="65" rx="8" ry="6" fill="#fdbcb4"/>
    <circle cx="55" cy="63" r="1" fill="#e9967a"/>
    
    {/* 考えている口 */}
    <path d="M 40 55 L 48 55" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
    
    {/* ？マーク */}
    <text x="25" y="30" fontSize="14" fill={primaryColor} fontWeight="bold" opacity="0.6">?</text>
  </svg>
)