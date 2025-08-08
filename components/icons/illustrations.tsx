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

export const MobileIcon = ({ size = 48, primaryColor = '#3b82f6', secondaryColor = '#93c5fd' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 電波 */}
    <path d="M 15 20 Q 15 15, 20 15 Q 25 15, 25 20" stroke={primaryColor} strokeWidth="2" fill="none" opacity="0.6"/>
    <path d="M 12 25 Q 12 18, 20 18 Q 28 18, 28 25" stroke={primaryColor} strokeWidth="2" fill="none" opacity="0.4"/>
    
    {/* スマホ本体 */}
    <rect x="35" y="20" width="30" height="50" rx="5" fill="#374151"/>
    <rect x="37" y="22" width="26" height="46" rx="3" fill="#111827"/>
    
    {/* 画面 */}
    <rect x="39" y="28" width="22" height="34" rx="2" fill={secondaryColor}/>
    <rect x="40" y="29" width="20" height="32" rx="1" fill="white"/>
    
    {/* ホームボタン */}
    <circle cx="50" cy="66" r="2" fill="#6b7280"/>
    
    {/* 画面の内容 */}
    <rect x="42" y="31" width="16" height="2" rx="1" fill={primaryColor}/>
    <rect x="42" y="35" width="12" height="1" rx="0.5" fill="#9ca3af"/>
    <rect x="42" y="38" width="14" height="1" rx="0.5" fill="#9ca3af"/>
    
    {/* アプリアイコン風 */}
    <rect x="42" y="42" width="4" height="4" rx="1" fill={primaryColor} opacity="0.8"/>
    <rect x="48" y="42" width="4" height="4" rx="1" fill="#10b981" opacity="0.8"/>
    <rect x="54" y="42" width="4" height="4" rx="1" fill="#f59e0b" opacity="0.8"/>
    
    {/* キラキラ */}
    <path d="M 70 35 L 71 37 L 73 36 L 71 38 L 72 40 L 70 38 L 68 40 L 69 38 L 67 36 L 69 37 Z" fill={primaryColor} opacity="0.6"/>
  </svg>
)

export const FireIcon = ({ size = 48, primaryColor = '#f59e0b', secondaryColor = '#fbbf24' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 炎の本体 */}
    <path d="M 50 85 Q 35 75, 35 60 Q 35 45, 45 35 Q 50 30, 55 35 Q 65 45, 65 60 Q 65 75, 50 85" fill="#dc2626"/>
    <path d="M 50 82 Q 38 72, 38 60 Q 38 48, 47 38 Q 50 35, 53 38 Q 62 48, 62 60 Q 62 72, 50 82" fill={primaryColor}/>
    <path d="M 50 78 Q 42 70, 42 60 Q 42 50, 48 42 Q 50 40, 52 42 Q 58 50, 58 60 Q 58 70, 50 78" fill={secondaryColor}/>
    
    {/* 内側の炎 */}
    <path d="M 50 70 Q 45 65, 45 55 Q 45 50, 48 47 Q 50 45, 52 47 Q 55 50, 55 55 Q 55 65, 50 70" fill="#fbbf24"/>
    <path d="M 50 65 Q 47 62, 47 55 Q 47 52, 49 50 Q 50 49, 51 50 Q 53 52, 53 55 Q 53 62, 50 65" fill="#fde047"/>
    
    {/* コア */}
    <ellipse cx="50" cy="58" rx="2" ry="4" fill="white" opacity="0.8"/>
    
    {/* 火花 */}
    <circle cx="35" cy="45" r="1.5" fill={primaryColor} opacity="0.8">
      <animate attributeName="r" from="1" to="3" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="65" cy="50" r="1" fill={secondaryColor} opacity="0.6">
      <animate attributeName="r" from="0.5" to="2" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

export const StarIcon = ({ size = 48, primaryColor = '#f59e0b', secondaryColor = '#fde047' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 星の光 */}
    <path d="M 50 10 L 52 25 L 50 40 L 48 25 Z" fill={primaryColor} opacity="0.4"/>
    <path d="M 10 50 L 25 48 L 40 50 L 25 52 Z" fill={primaryColor} opacity="0.4"/>
    <path d="M 60 50 L 75 48 L 90 50 L 75 52 Z" fill={primaryColor} opacity="0.4"/>
    <path d="M 50 60 L 52 75 L 50 90 L 48 75 Z" fill={primaryColor} opacity="0.4"/>
    
    {/* 星本体 */}
    <path d="M 50 20 L 55 40 L 75 40 L 60 52 L 65 72 L 50 60 L 35 72 L 40 52 L 25 40 L 45 40 Z" fill={primaryColor}/>
    <path d="M 50 25 L 54 42 L 70 42 L 58 52 L 62 69 L 50 59 L 38 69 L 42 52 L 30 42 L 46 42 Z" fill={secondaryColor}/>
    
    {/* ハイライト */}
    <path d="M 50 30 L 52 40 L 58 40 L 53 45 L 55 55 L 50 50 L 45 55 L 47 45 L 42 40 L 48 40 Z" fill="white" opacity="0.6"/>
    
    {/* 中心の輝き */}
    <circle cx="50" cy="50" r="3" fill="white" opacity="0.8"/>
    <circle cx="50" cy="50" r="1.5" fill="#fff7ed"/>
    
    {/* 周囲のキラキラ */}
    <path d="M 20 25 L 21 27 L 23 26 L 21 28 L 22 30 L 20 28 L 18 30 L 19 28 L 17 26 L 19 27 Z" fill={secondaryColor} opacity="0.7"/>
    <path d="M 78 30 L 79 31 L 80 30 L 79 32 L 80 33 L 78 32 L 77 33 L 78 32 L 76 30 L 78 31 Z" fill={primaryColor} opacity="0.6"/>
  </svg>
)

export const PenIcon = ({ size = 48, primaryColor = '#6366f1', secondaryColor = '#a5b4fc' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* ペン軸 */}
    <path d="M 25 75 L 70 30" stroke={primaryColor} strokeWidth="8" strokeLinecap="round"/>
    <path d="M 25 75 L 70 30" stroke={secondaryColor} strokeWidth="6" strokeLinecap="round"/>
    
    {/* ペン先 */}
    <path d="M 70 30 L 75 25 L 78 28 L 73 33 Z" fill="#374151"/>
    <path d="M 75 25 L 77 23 L 80 26 L 78 28 Z" fill="#6b7280"/>
    
    {/* グリップ */}
    <rect x="40" y="50" width="8" height="3" rx="1" fill="#e5e7eb" transform="rotate(-45 44 51.5)"/>
    <rect x="45" y="45" width="8" height="3" rx="1" fill="#e5e7eb" transform="rotate(-45 49 46.5)"/>
    
    {/* インクの滴 */}
    <circle cx="22" cy="78" r="2" fill={primaryColor} opacity="0.6"/>
    <ellipse cx="20" cy="82" rx="1.5" ry="2" fill={primaryColor} opacity="0.4"/>
    
    {/* 書いた線 */}
    <path d="M 15 85 Q 30 80, 40 85" stroke={primaryColor} strokeWidth="2" fill="none" opacity="0.5"/>
    
    {/* キラキラ */}
    <path d="M 80 20 L 81 22 L 83 21 L 81 23 L 82 25 L 80 23 L 78 25 L 79 23 L 77 21 L 79 22 Z" fill={secondaryColor} opacity="0.6"/>
  </svg>
)

export const BubbleIcon = ({ size = 48, primaryColor = '#06b6d4', secondaryColor = '#67e8f9' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* メインの泡 */}
    <ellipse cx="50" cy="40" rx="25" ry="20" fill={secondaryColor} opacity="0.3"/>
    <ellipse cx="50" cy="40" rx="23" ry="18" fill={primaryColor} opacity="0.4"/>
    <ellipse cx="50" cy="40" rx="21" ry="16" fill="white"/>
    
    {/* 泡の尻尾 */}
    <path d="M 40 55 Q 35 65, 30 70 Q 28 72, 30 74 Q 32 72, 35 68 Q 42 60, 45 55" fill="white"/>
    
    {/* 小さな泡 */}
    <circle cx="20" cy="65" r="5" fill={secondaryColor} opacity="0.6"/>
    <circle cx="20" cy="65" r="4" fill="white"/>
    <circle cx="15" cy="75" r="3" fill={secondaryColor} opacity="0.4"/>
    <circle cx="15" cy="75" r="2.5" fill="white"/>
    
    {/* 泡の中身（省略記号） */}
    <circle cx="40" cy="40" r="2" fill={primaryColor} opacity="0.8"/>
    <circle cx="50" cy="40" r="2" fill={primaryColor} opacity="0.8"/>
    <circle cx="60" cy="40" r="2" fill={primaryColor} opacity="0.8"/>
    
    {/* ハイライト */}
    <ellipse cx="45" cy="33" rx="8" ry="6" fill="white" opacity="0.7"/>
    <circle cx="18" cy="63" r="1.5" fill="white" opacity="0.8"/>
    
    {/* キラキラ */}
    <path d="M 75 25 L 76 27 L 78 26 L 76 28 L 77 30 L 75 28 L 73 30 L 74 28 L 72 26 L 74 27 Z" fill={primaryColor} opacity="0.6"/>
  </svg>
)

export const TargetIcon = ({ size = 48, primaryColor = '#ef4444', secondaryColor = '#fca5a5' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 外側の円 */}
    <circle cx="50" cy="50" r="35" fill="none" stroke={primaryColor} strokeWidth="3"/>
    <circle cx="50" cy="50" r="25" fill="none" stroke={primaryColor} strokeWidth="2.5"/>
    <circle cx="50" cy="50" r="15" fill="none" stroke={primaryColor} strokeWidth="2"/>
    
    {/* 中心 */}
    <circle cx="50" cy="50" r="8" fill={primaryColor}/>
    <circle cx="50" cy="50" r="5" fill={secondaryColor}/>
    <circle cx="50" cy="50" r="2" fill="white"/>
    
    {/* 矢印 */}
    <path d="M 15 50 L 25 45 L 25 48 L 35 48 L 35 52 L 25 52 L 25 55 Z" fill="#fbbf24"/>
    <path d="M 17 50 L 25 46 L 25 48 L 33 48 L 33 52 L 25 52 L 25 54 Z" fill="#f59e0b"/>
    
    {/* スコア表示 */}
    <circle cx="75" cy="25" r="12" fill="#10b981" opacity="0.9"/>
    <circle cx="75" cy="25" r="10" fill="#22c55e"/>
    <text x="75" y="28" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">100</text>
    
    {/* 動的効果 */}
    <circle cx="50" cy="50" r="40" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.3">
      <animate attributeName="r" from="35" to="45" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

export const ChartIcon = ({ size = 48, primaryColor = '#10b981', secondaryColor = '#86efac' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* グラフの背景 */}
    <rect x="20" y="20" width="60" height="60" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
    
    {/* グリッド線 */}
    <path d="M 20 35 L 80 35" stroke="#f3f4f6" strokeWidth="0.5"/>
    <path d="M 20 50 L 80 50" stroke="#f3f4f6" strokeWidth="0.5"/>
    <path d="M 20 65 L 80 65" stroke="#f3f4f6" strokeWidth="0.5"/>
    <path d="M 35 20 L 35 80" stroke="#f3f4f6" strokeWidth="0.5"/>
    <path d="M 50 20 L 50 80" stroke="#f3f4f6" strokeWidth="0.5"/>
    <path d="M 65 20 L 65 80" stroke="#f3f4f6" strokeWidth="0.5"/>
    
    {/* グラフ線 */}
    <path d="M 25 70 Q 30 60, 35 55 Q 45 45, 50 40 Q 60 30, 65 25 Q 70 20, 75 15" 
          stroke={primaryColor} strokeWidth="3" fill="none" strokeLinecap="round"/>
    
    {/* データポイント */}
    <circle cx="35" cy="55" r="3" fill={primaryColor}/>
    <circle cx="50" cy="40" r="3" fill={primaryColor}/>
    <circle cx="65" cy="25" r="3" fill={primaryColor}/>
    <circle cx="75" cy="15" r="3" fill={primaryColor}/>
    
    {/* グラフの下のエリア（グラデーション風） */}
    <path d="M 25 70 Q 30 60, 35 55 Q 45 45, 50 40 Q 60 30, 65 25 Q 70 20, 75 15 L 75 80 L 25 80 Z" 
          fill={secondaryColor} opacity="0.3"/>
    
    {/* 軸 */}
    <path d="M 20 80 L 80 80" stroke="#111827" strokeWidth="2"/>
    <path d="M 20 80 L 20 20" stroke="#111827" strokeWidth="2"/>
    
    {/* 矢印 */}
    <path d="M 78 82 L 82 80 L 78 78" fill="#111827"/>
    <path d="M 18 22 L 20 18 L 22 22" fill="#111827"/>
    
    {/* 上昇アイコン */}
    <circle cx="85" cy="15" r="8" fill={primaryColor}/>
    <path d="M 81 17 L 85 13 L 89 17" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M 85 13 L 85 19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const NoteIcon = ({ size = 48, primaryColor = '#6366f1', secondaryColor = '#a5b4fc' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* ノート本体 */}
    <rect x="25" y="15" width="50" height="70" rx="3" fill="white" stroke={primaryColor} strokeWidth="2"/>
    <rect x="25" y="15" width="50" height="10" rx="3" fill={secondaryColor}/>
    
    {/* スパイラル（リング） */}
    <circle cx="35" cy="20" r="2" fill="none" stroke={primaryColor} strokeWidth="1.5"/>
    <circle cx="45" cy="20" r="2" fill="none" stroke={primaryColor} strokeWidth="1.5"/>
    <circle cx="55" cy="20" r="2" fill="none" stroke={primaryColor} strokeWidth="1.5"/>
    <circle cx="65" cy="20" r="2" fill="none" stroke={primaryColor} strokeWidth="1.5"/>
    
    {/* 罫線 */}
    <path d="M 30 35 L 70 35" stroke="#e5e7eb" strokeWidth="1"/>
    <path d="M 30 45 L 70 45" stroke="#e5e7eb" strokeWidth="1"/>
    <path d="M 30 55 L 70 55" stroke="#e5e7eb" strokeWidth="1"/>
    <path d="M 30 65 L 70 65" stroke="#e5e7eb" strokeWidth="1"/>
    <path d="M 30 75 L 70 75" stroke="#e5e7eb" strokeWidth="1"/>
    
    {/* 書かれた文字（線で表現） */}
    <path d="M 32 35 L 50 35" stroke={primaryColor} strokeWidth="2" strokeLinecap="round"/>
    <path d="M 32 45 L 65 45" stroke={primaryColor} strokeWidth="2" strokeLinecap="round"/>
    <path d="M 32 55 L 45 55" stroke={primaryColor} strokeWidth="2" strokeLinecap="round"/>
    
    {/* ペン */}
    <path d="M 75 60 L 85 70" stroke="#374151" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="87" cy="72" r="1.5" fill="#374151"/>
    
    {/* キラキラ */}
    <path d="M 80 30 L 81 32 L 83 31 L 81 33 L 82 35 L 80 33 L 78 35 L 79 33 L 77 31 L 79 32 Z" fill={secondaryColor} opacity="0.6"/>
    
    {/* ページの影 */}
    <path d="M 75 17 L 75 85 Q 75 85, 73 83 L 73 19 Q 73 17, 75 17" fill="#d1d5db" opacity="0.5"/>
  </svg>
)

export const EnergyIcon = ({ size = 48, primaryColor = '#f59e0b', secondaryColor = '#fde047' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 稲妻の光 */}
    <path d="M 35 15 L 45 40 L 35 40 L 50 75 L 40 50 L 50 50 Z" fill={secondaryColor} opacity="0.3"/>
    
    {/* メインの稲妻 */}
    <path d="M 40 20 L 50 45 L 40 45 L 55 80 L 45 55 L 55 55 Z" fill={primaryColor}/>
    <path d="M 42 22 L 50 45 L 42 45 L 53 75 L 47 55 L 53 55 Z" fill={secondaryColor}/>
    
    {/* エネルギーのオーラ */}
    <circle cx="50" cy="50" r="35" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.2">
      <animate attributeName="r" from="30" to="40" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="50" cy="50" r="35" fill="none" stroke={secondaryColor} strokeWidth="1" opacity="0.2">
      <animate attributeName="r" from="25" to="35" dur="1.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite"/>
    </circle>
    
    {/* 小さな稲妻 */}
    <path d="M 20 30 L 25 40 L 20 40 L 30 55 L 25 45 L 30 45 Z" fill={primaryColor} opacity="0.6"/>
    <path d="M 70 35 L 75 45 L 70 45 L 80 60 L 75 50 L 80 50 Z" fill={primaryColor} opacity="0.6"/>
    
    {/* エネルギーパーティクル */}
    <circle cx="25" cy="60" r="2" fill={secondaryColor} opacity="0.8">
      <animate attributeName="cy" from="65" to="55" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0" to="1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="75" cy="70" r="1.5" fill={primaryColor} opacity="0.6">
      <animate attributeName="cy" from="75" to="65" dur="1.8s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0" to="0.8" dur="1.8s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

export const MoonIcon = ({ size = 48, primaryColor = '#fbbf24', secondaryColor = '#fde047' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 月のオーラ */}
    <circle cx="50" cy="50" r="40" fill={primaryColor} opacity="0.1"/>
    <circle cx="50" cy="50" r="35" fill={primaryColor} opacity="0.15"/>
    
    {/* 三日月 */}
    <path d="M 50 20 Q 35 25, 35 50 Q 35 75, 50 80 Q 45 75, 45 50 Q 45 25, 50 20" fill={primaryColor}/>
    <path d="M 50 22 Q 37 27, 37 50 Q 37 73, 50 78 Q 47 73, 47 50 Q 47 27, 50 22" fill={secondaryColor}/>
    
    {/* 月の表面（クレーター） */}
    <ellipse cx="45" cy="40" rx="2" ry="3" fill={primaryColor} opacity="0.3"/>
    <circle cx="42" cy="55" r="1.5" fill={primaryColor} opacity="0.2"/>
    <ellipse cx="46" cy="65" rx="1" ry="2" fill={primaryColor} opacity="0.3"/>
    
    {/* 顔 */}
    <circle cx="42" cy="45" r="1" fill="#374151"/>
    <circle cx="42" cy="55" r="1" fill="#374151"/>
    <path d="M 40 60 Q 42 62, 44 60" stroke="#374151" strokeWidth="0.8" fill="none"/>
    
    {/* 星 */}
    <path d="M 70 25 L 71 28 L 74 27 L 71 29 L 72 32 L 70 30 L 68 32 L 69 29 L 66 27 L 69 28 Z" fill={secondaryColor}/>
    <path d="M 20 40 L 21 42 L 23 41 L 21 43 L 22 45 L 20 43 L 18 45 L 19 43 L 17 41 L 19 42 Z" fill={secondaryColor} opacity="0.7"/>
    <path d="M 80 60 L 80.5 61 L 81.5 60.5 L 80.5 62 L 81 63 L 80 62 L 79 63 L 79.5 62 L 78.5 60.5 L 79.5 61 Z" fill={secondaryColor} opacity="0.5"/>
    
    {/* 夜の雲 */}
    <ellipse cx="25" cy="70" rx="8" ry="4" fill="#6b7280" opacity="0.4"/>
    <ellipse cx="75" cy="75" rx="6" ry="3" fill="#6b7280" opacity="0.3"/>
  </svg>
)

export const PartyIcon = ({ size = 48, primaryColor = '#f59e0b', secondaryColor = '#fde047' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* パーティーハット */}
    <path d="M 45 25 L 55 25 L 50 10 Z" fill="#ef4444"/>
    <circle cx="50" cy="10" r="3" fill="#fbbf24"/>
    
    {/* 紙吹雪 */}
    <rect x="20" y="30" width="3" height="3" fill="#ef4444" transform="rotate(45 21.5 31.5)"/>
    <rect x="75" y="25" width="2" height="2" fill="#10b981" transform="rotate(30 76 26)"/>
    <rect x="80" y="45" width="3" height="3" fill="#3b82f6" transform="rotate(60 81.5 46.5)"/>
    <rect x="25" y="50" width="2" height="2" fill="#f59e0b" transform="rotate(15 26 51)"/>
    <rect x="70" y="70" width="3" height="3" fill="#8b5cf6" transform="rotate(75 71.5 71.5)"/>
    <rect x="15" y="65" width="2" height="2" fill="#ef4444" transform="rotate(90 16 66)"/>
    
    {/* 風船 */}
    <ellipse cx="30" cy="40" rx="5" ry="7" fill="#ef4444"/>
    <path d="M 30 47 L 30 55" stroke="#374151" strokeWidth="1"/>
    
    <ellipse cx="70" cy="35" rx="5" ry="7" fill="#10b981"/>
    <path d="M 70 42 L 70 50" stroke="#374151" strokeWidth="1"/>
    
    <ellipse cx="25" cy="75" rx="4" ry="6" fill="#3b82f6"/>
    <path d="M 25 81 L 25 87" stroke="#374151" strokeWidth="1"/>
    
    {/* ストリーマー */}
    <path d="M 40 20 Q 35 30, 40 40 Q 45 35, 40 45" stroke="#f59e0b" strokeWidth="2" fill="none"/>
    <path d="M 60 20 Q 65 25, 60 35 Q 55 30, 60 40" stroke="#ef4444" strokeWidth="2" fill="none"/>
    
    {/* お祝いの星 */}
    <path d="M 50 50 L 52 55 L 57 55 L 53 58 L 55 63 L 50 60 L 45 63 L 47 58 L 43 55 L 48 55 Z" fill={secondaryColor}/>
    
    {/* キラキラ */}
    <path d="M 85 30 L 86 32 L 88 31 L 86 33 L 87 35 L 85 33 L 83 35 L 84 33 L 82 31 L 84 32 Z" fill={primaryColor}/>
    <path d="M 15 40 L 16 41 L 17 40 L 16 42 L 17 43 L 15 42 L 14 43 L 15 42 L 13 40 L 15 41 Z" fill="#f59e0b"/>
    
    {/* パーティーポッパー */}
    <rect x="80" y="55" width="8" height="15" rx="2" fill="#fbbf24" transform="rotate(-30 84 62.5)"/>
    <circle cx="84" cy="55" r="2" fill="#ef4444" transform="rotate(-30 84 62.5)"/>
  </svg>
)

export const ChatIcon = ({ size = 48, primaryColor = '#06b6d4', secondaryColor = '#67e8f9' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* メインの吹き出し */}
    <ellipse cx="50" cy="40" rx="30" ry="20" fill={secondaryColor}/>
    <ellipse cx="50" cy="40" rx="28" ry="18" fill="white"/>
    
    {/* 吹き出しの尻尾 */}
    <path d="M 35 55 Q 30 65, 25 70 Q 23 72, 25 74 Q 27 72, 32 68 Q 40 58, 42 55" fill="white"/>
    
    {/* 小さな吹き出し */}
    <ellipse cx="75" cy="60" rx="15" ry="10" fill={primaryColor} opacity="0.7"/>
    <ellipse cx="75" cy="60" rx="13" ry="8" fill="white"/>
    <path d="M 70 68 Q 68 72, 65 75 Q 64 76, 65 77 Q 66 76, 69 74 Q 72 70, 73 68" fill="white"/>
    
    {/* メッセージの内容（ハート） */}
    <path d="M 50 35 C 47 32, 43 32, 43 36 C 43 40, 50 47, 50 47 C 50 47, 57 40, 57 36 C 57 32, 53 32, 50 35 Z" fill="#f87171"/>
    
    {/* 小さな吹き出しの内容（絵文字風） */}
    <circle cx="73" cy="58" r="1" fill={primaryColor}/>
    <circle cx="77" cy="58" r="1" fill={primaryColor}/>
    <path d="M 72 62 Q 75 64, 78 62" stroke={primaryColor} strokeWidth="1" fill="none"/>
    
    {/* 通知ドット */}
    <circle cx="65" cy="25" r="4" fill="#ef4444"/>
    <circle cx="65" cy="25" r="3" fill="#fca5a5"/>
    <text x="65" y="28" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">3</text>
    
    {/* キラキラエフェクト */}
    <path d="M 20 50 L 21 52 L 23 51 L 21 53 L 22 55 L 20 53 L 18 55 L 19 53 L 17 51 L 19 52 Z" fill={primaryColor} opacity="0.6"/>
    <circle cx="85" cy="30" r="1" fill={secondaryColor}>
      <animate attributeName="r" from="0.5" to="2" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.8" to="0.2" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

export const TeamIcon = ({ size = 48, primaryColor = '#8b5cf6', secondaryColor = '#c4b5fd' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* チームの輪 */}
    <circle cx="50" cy="50" r="35" fill="none" stroke={secondaryColor} strokeWidth="2" opacity="0.3"/>
    
    {/* 人物1（前面） */}
    <circle cx="50" cy="40" r="8" fill="#fdbcb4"/>
    <rect x="42" y="48" width="16" height="20" rx="8" fill={primaryColor}/>
    <circle cx="46" cy="38" r="1" fill="#374151"/>
    <circle cx="54" cy="38" r="1" fill="#374151"/>
    <path d="M 47 42 Q 50 44, 53 42" stroke="#374151" strokeWidth="1" fill="none"/>
    
    {/* 人物2（左） */}
    <circle cx="30" cy="50" r="7" fill="#fdbcb4"/>
    <rect x="23" y="57" width="14" height="18" rx="7" fill="#10b981"/>
    <circle cx="27" cy="48" r="1" fill="#374151"/>
    <circle cx="33" cy="48" r="1" fill="#374151"/>
    <path d="M 28 52 Q 30 53, 32 52" stroke="#374151" strokeWidth="0.8" fill="none"/>
    
    {/* 人物3（右） */}
    <circle cx="70" cy="50" r="7" fill="#fdbcb4"/>
    <rect x="63" y="57" width="14" height="18" rx="7" fill="#f59e0b"/>
    <circle cx="67" cy="48" r="1" fill="#374151"/>
    <circle cx="73" cy="48" r="1" fill="#374151"/>
    <path d="M 68 52 Q 70 53, 72 52" stroke="#374151" strokeWidth="0.8" fill="none"/>
    
    {/* 人物4（後ろ左） */}
    <circle cx="35" cy="30" r="6" fill="#fdbcb4"/>
    <rect x="29" y="36" width="12" height="16" rx="6" fill="#ef4444"/>
    
    {/* 人物5（後ろ右） */}
    <circle cx="65" cy="30" r="6" fill="#fdbcb4"/>
    <rect x="59" y="36" width="12" height="16" rx="6" fill="#3b82f6"/>
    
    {/* 繋がりを示す線 */}
    <path d="M 42 55 Q 35 52, 37 58" stroke={secondaryColor} strokeWidth="1.5" opacity="0.5"/>
    <path d="M 58 55 Q 65 52, 63 58" stroke={secondaryColor} strokeWidth="1.5" opacity="0.5"/>
    <path d="M 40 45 Q 37 40, 41 35" stroke={secondaryColor} strokeWidth="1" opacity="0.4"/>
    <path d="M 60 45 Q 63 40, 59 35" stroke={secondaryColor} strokeWidth="1" opacity="0.4"/>
    
    {/* チームスピリット（上昇する星） */}
    <path d="M 50 20 L 51 23 L 54 22 L 51 24 L 52 27 L 50 25 L 48 27 L 49 24 L 46 22 L 49 23 Z" fill={primaryColor} opacity="0.8"/>
    
    {/* サポートの手 */}
    <ellipse cx="25" cy="65" rx="3" ry="2" fill="#fdbcb4" opacity="0.7"/>
    <ellipse cx="75" cy="65" rx="3" ry="2" fill="#fdbcb4" opacity="0.7"/>
  </svg>
)

export const LockIcon = ({ size = 48, primaryColor = '#6b7280', secondaryColor = '#9ca3af' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 鍵穴の背景 */}
    <rect x="30" y="45" width="40" height="35" rx="5" fill={primaryColor}/>
    <rect x="32" y="47" width="36" height="31" rx="3" fill={secondaryColor}/>
    
    {/* 南京錠のU字部分 */}
    <path d="M 40 45 L 40 35 Q 40 25, 50 25 Q 60 25, 60 35 L 60 45" 
          stroke={primaryColor} strokeWidth="4" fill="none"/>
    <path d="M 42 45 L 42 35 Q 42 27, 50 27 Q 58 27, 58 35 L 58 45" 
          stroke={secondaryColor} strokeWidth="3" fill="none"/>
    
    {/* 鍵穴 */}
    <circle cx="50" cy="58" r="4" fill={primaryColor}/>
    <rect x="48" y="62" width="4" height="8" rx="2" fill={primaryColor}/>
    
    {/* ハイライト */}
    <rect x="35" y="50" width="2" height="20" rx="1" fill="white" opacity="0.3"/>
    <ellipse cx="45" cy="30" rx="2" ry="3" fill="white" opacity="0.4"/>
    
    {/* セキュリティインジケーター */}
    <circle cx="75" cy="25" r="8" fill="#10b981"/>
    <path d="M 72 25 L 74 27 L 78 23" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
    
    {/* プライベート印 */}
    <circle cx="25" cy="75" r="6" fill="#ef4444" opacity="0.8"/>
    <text x="25" y="78" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">P</text>
  </svg>
)

export const BreathingIcon = ({ size = 48, primaryColor = '#60a5fa', secondaryColor = '#93c5fd' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 肺のシルエット */}
    <ellipse cx="35" cy="50" rx="12" ry="20" fill={secondaryColor} opacity="0.6"/>
    <ellipse cx="65" cy="50" rx="12" ry="20" fill={secondaryColor} opacity="0.6"/>
    <ellipse cx="35" cy="50" rx="10" ry="18" fill={primaryColor} opacity="0.8"/>
    <ellipse cx="65" cy="50" rx="10" ry="18" fill={primaryColor} opacity="0.8"/>
    
    {/* 気管 */}
    <rect x="48" y="30" width="4" height="15" rx="2" fill={primaryColor}/>
    <path d="M 50 42 Q 45 45, 35 50" stroke={primaryColor} strokeWidth="3" fill="none"/>
    <path d="M 50 42 Q 55 45, 65 50" stroke={primaryColor} strokeWidth="3" fill="none"/>
    
    {/* 空気の流れ */}
    <circle cx="50" cy="20" r="2" fill={secondaryColor} opacity="0.8">
      <animate attributeName="cy" from="20" to="30" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.8" to="0.2" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="45" cy="22" r="1.5" fill={secondaryColor} opacity="0.6">
      <animate attributeName="cy" from="22" to="32" dur="2.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.6" to="0.1" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="55" cy="18" r="1.5" fill={secondaryColor} opacity="0.6">
      <animate attributeName="cy" from="18" to="28" dur="1.8s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.6" to="0.1" dur="1.8s" repeatCount="indefinite"/>
    </circle>
    
    {/* 拡張収縮アニメーション */}
    <ellipse cx="35" cy="50" rx="10" ry="18" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.4">
      <animate attributeName="rx" from="10" to="13" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="ry" from="18" to="22" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.4" to="0.1" dur="2s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="65" cy="50" rx="10" ry="18" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.4">
      <animate attributeName="rx" from="10" to="13" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="ry" from="18" to="22" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.4" to="0.1" dur="2s" repeatCount="indefinite"/>
    </ellipse>
  </svg>
)

export const StretchIcon = ({ size = 48, primaryColor = '#a3e635', secondaryColor = '#d9f99d' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 体 */}
    <ellipse cx="50" cy="60" rx="12" ry="18" fill={primaryColor}/>
    
    {/* 頭 */}
    <circle cx="50" cy="35" r="10" fill="#fdbcb4"/>
    
    {/* 腕（上に伸ばす） */}
    <path d="M 38 50 Q 30 40, 25 30" stroke="#fdbcb4" strokeWidth="6" strokeLinecap="round"/>
    <path d="M 62 50 Q 70 40, 75 30" stroke="#fdbcb4" strokeWidth="6" strokeLinecap="round"/>
    <circle cx="25" cy="30" r="4" fill="#fdbcb4"/>
    <circle cx="75" cy="30" r="4" fill="#fdbcb4"/>
    
    {/* 脚 */}
    <rect x="42" y="75" width="6" height="15" rx="3" fill="#fdbcb4"/>
    <rect x="52" y="75" width="6" height="15" rx="3" fill="#fdbcb4"/>
    
    {/* 顔 */}
    <circle cx="46" cy="33" r="1" fill="#374151"/>
    <circle cx="54" cy="33" r="1" fill="#374151"/>
    <path d="M 46 38 Q 50 40, 54 38" stroke="#374151" strokeWidth="1" fill="none"/>
    
    {/* ストレッチ効果 */}
    <path d="M 20 25 Q 15 20, 10 15" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M 80 25 Q 85 20, 90 15" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M 25 20 Q 23 15, 20 10" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M 75 20 Q 77 15, 80 10" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    
    {/* エナジーライン */}
    <circle cx="50" cy="60" r="20" fill="none" stroke={secondaryColor} strokeWidth="1" opacity="0.3">
      <animate attributeName="r" from="15" to="25" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

export const ArtIcon = ({ size = 48, primaryColor = '#ec4899', secondaryColor = '#f9a8d4' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* パレット */}
    <ellipse cx="50" cy="50" rx="30" ry="25" fill="#8b7355"/>
    <ellipse cx="50" cy="50" rx="28" ry="23" fill="#f4e4c1"/>
    
    {/* 親指穴 */}
    <ellipse cx="65" cy="40" rx="8" ry="6" fill="white"/>
    
    {/* 絵の具 */}
    <circle cx="35" cy="35" r="5" fill="#ef4444"/>
    <circle cx="50" cy="35" r="5" fill="#3b82f6"/>
    <circle cx="35" cy="50" r="5" fill="#fbbf24"/>
    <circle cx="50" cy="50" r="5" fill="#10b981"/>
    <circle cx="35" cy="65" r="5" fill={primaryColor}/>
    <circle cx="50" cy="65" r="5" fill="#8b5cf6"/>
    
    {/* 筆 */}
    <rect x="70" y="55" width="4" height="20" rx="2" fill="#8b7355" transform="rotate(-30 72 65)"/>
    <path d="M 74 52 L 76 48 L 78 52" fill="#374151" transform="rotate(-30 76 50)"/>
    <circle cx="76" cy="48" r="2" fill={primaryColor} transform="rotate(-30 76 48)"/>
    
    {/* 絵の具の混ざり */}
    <ellipse cx="42" cy="42" rx="3" ry="2" fill="#f97316" opacity="0.7"/>
    <ellipse cx="42" cy="58" rx="3" ry="2" fill="#84cc16" opacity="0.7"/>
    
    {/* キラキラ */}
    <path d="M 20 20 L 21 22 L 23 21 L 21 23 L 22 25 L 20 23 L 18 25 L 19 23 L 17 21 L 19 22 Z" fill={secondaryColor} opacity="0.8"/>
    <path d="M 80 70 L 81 71 L 82 70 L 81 72 L 82 73 L 80 72 L 79 73 L 80 72 L 78 70 L 80 71 Z" fill={primaryColor} opacity="0.6"/>
  </svg>
)

export const NatureIcon = ({ size = 48, primaryColor = '#10b981', secondaryColor = '#86efac' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 木の幹 */}
    <rect x="47" y="60" width="6" height="25" fill="#8b7355"/>
    <rect x="45" y="60" width="10" height="3" fill="#6b5a45"/>
    
    {/* 木の葉 */}
    <circle cx="50" cy="40" r="18" fill={primaryColor}/>
    <circle cx="40" cy="45" r="12" fill={secondaryColor}/>
    <circle cx="60" cy="45" r="12" fill={secondaryColor}/>
    <circle cx="50" cy="35" r="10" fill={primaryColor}/>
    
    {/* 葉っぱディテール */}
    <ellipse cx="45" cy="38" rx="2" ry="4" fill="#059669" transform="rotate(-30 45 38)"/>
    <ellipse cx="55" cy="42" rx="2" ry="4" fill="#059669" transform="rotate(30 55 42)"/>
    <ellipse cx="50" cy="48" rx="2" ry="4" fill="#059669"/>
    
    {/* 草 */}
    <path d="M 20 85 Q 22 80, 24 85" fill={primaryColor} opacity="0.8"/>
    <path d="M 24 85 Q 26 78, 28 85" fill={secondaryColor} opacity="0.8"/>
    <path d="M 72 85 Q 74 80, 76 85" fill={primaryColor} opacity="0.8"/>
    <path d="M 76 85 Q 78 78, 80 85" fill={secondaryColor} opacity="0.8"/>
    
    {/* 太陽 */}
    <circle cx="80" cy="20" r="8" fill="#fbbf24"/>
    <path d="M 80 10 L 80 12" stroke="#fbbf24" strokeWidth="2"/>
    <path d="M 80 28 L 80 30" stroke="#fbbf24" strokeWidth="2"/>
    <path d="M 70 20 L 72 20" stroke="#fbbf24" strokeWidth="2"/>
    <path d="M 88 20 L 90 20" stroke="#fbbf24" strokeWidth="2"/>
    <path d="M 73 13 L 74 14" stroke="#fbbf24" strokeWidth="2"/>
    <path d="M 86 26 L 87 27" stroke="#fbbf24" strokeWidth="2"/>
    <path d="M 73 27 L 74 26" stroke="#fbbf24" strokeWidth="2"/>
    <path d="M 86 14 L 87 13" stroke="#fbbf24" strokeWidth="2"/>
    
    {/* 鳥 */}
    <path d="M 25 25 Q 28 23, 31 25" stroke="#374151" strokeWidth="1.5" fill="none"/>
    <path d="M 32 28 Q 35 26, 38 28" stroke="#374151" strokeWidth="1.5" fill="none"/>
  </svg>
)

export const WaterDropIcon = ({ size = 48, primaryColor = '#06b6d4', secondaryColor = '#67e8f9' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* メインの水滴 */}
    <path d="M 50 25 Q 35 40, 35 55 Q 35 70, 50 70 Q 65 70, 65 55 Q 65 40, 50 25" fill={primaryColor}/>
    <path d="M 50 28 Q 37 42, 37 55 Q 37 68, 50 68 Q 63 68, 63 55 Q 63 42, 50 28" fill={secondaryColor}/>
    
    {/* ハイライト */}
    <ellipse cx="45" cy="45" rx="8" ry="10" fill="white" opacity="0.6"/>
    <ellipse cx="43" cy="42" rx="4" ry="5" fill="white" opacity="0.8"/>
    
    {/* 小さな水滴 */}
    <path d="M 25 60 Q 20 65, 20 70 Q 20 75, 25 75 Q 30 75, 30 70 Q 30 65, 25 60" fill={secondaryColor} opacity="0.6"/>
    <path d="M 75 55 Q 72 58, 72 61 Q 72 64, 75 64 Q 78 64, 78 61 Q 78 58, 75 55" fill={primaryColor} opacity="0.5"/>
    
    {/* 波紋 */}
    <ellipse cx="50" cy="80" rx="20" ry="3" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.3">
      <animate attributeName="rx" from="10" to="25" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="ry" from="2" to="5" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="50" cy="80" rx="20" ry="3" fill="none" stroke={secondaryColor} strokeWidth="1" opacity="0.3">
      <animate attributeName="rx" from="10" to="25" dur="2s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="ry" from="2" to="5" dur="2s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
    </ellipse>
    
    {/* キラキラ */}
    <path d="M 60 35 L 61 37 L 63 36 L 61 38 L 62 40 L 60 38 L 58 40 L 59 38 L 57 36 L 59 37 Z" fill="white" opacity="0.8"/>
  </svg>
)

export const BrainIcon = ({ size = 48, primaryColor = '#8b5cf6', secondaryColor = '#c4b5fd' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 脳の左半球 */}
    <path d="M 50 30 Q 35 30, 30 40 Q 28 50, 35 55 Q 30 60, 35 65 Q 40 70, 45 68 Q 48 72, 50 70" 
          fill={primaryColor} opacity="0.9"/>
    
    {/* 脳の右半球 */}
    <path d="M 50 30 Q 65 30, 70 40 Q 72 50, 65 55 Q 70 60, 65 65 Q 60 70, 55 68 Q 52 72, 50 70" 
          fill={secondaryColor} opacity="0.9"/>
    
    {/* 脳のしわ */}
    <path d="M 35 40 Q 40 42, 45 40" stroke="#6b21a8" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M 55 40 Q 60 42, 65 40" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M 35 50 Q 42 52, 45 50" stroke="#6b21a8" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M 55 50 Q 58 52, 65 50" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M 38 60 Q 43 62, 48 60" stroke="#6b21a8" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M 52 60 Q 57 62, 62 60" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.5"/>
    
    {/* 神経接続 */}
    <circle cx="35" cy="45" r="2" fill="#fbbf24"/>
    <circle cx="65" cy="45" r="2" fill="#fbbf24"/>
    <circle cx="40" cy="55" r="2" fill="#fbbf24"/>
    <circle cx="60" cy="55" r="2" fill="#fbbf24"/>
    <path d="M 35 45 L 40 55" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6"/>
    <path d="M 65 45 L 60 55" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6"/>
    <path d="M 40 55 L 60 55" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6"/>
    
    {/* 思考の光 */}
    <circle cx="50" cy="50" r="30" fill="none" stroke={primaryColor} strokeWidth="0.5" opacity="0.3">
      <animate attributeName="r" from="25" to="35" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

export const MusclePowerIcon = ({ size = 48, primaryColor = '#ef4444', secondaryColor = '#fca5a5' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 上腕 */}
    <ellipse cx="40" cy="45" rx="8" ry="15" fill="#fdbcb4" transform="rotate(-30 40 45)"/>
    
    {/* 前腕 */}
    <ellipse cx="55" cy="55" rx="6" ry="12" fill="#fdbcb4" transform="rotate(-60 55 55)"/>
    
    {/* 筋肉の膨らみ */}
    <ellipse cx="42" cy="42" rx="10" ry="8" fill="#fdbcb4"/>
    <ellipse cx="40" cy="40" rx="9" ry="7" fill="#f9a8a0"/>
    
    {/* 手 */}
    <circle cx="65" cy="60" r="6" fill="#fdbcb4"/>
    <rect x="63" y="58" width="2" height="5" rx="1" fill="#e9967a"/>
    <rect x="66" y="58" width="2" height="5" rx="1" fill="#e9967a"/>
    <rect x="69" y="59" width="2" height="4" rx="1" fill="#e9967a"/>
    <rect x="60" y="59" width="2" height="4" rx="1" fill="#e9967a"/>
    
    {/* パワーエフェクト */}
    <path d="M 25 35 L 20 30" stroke={primaryColor} strokeWidth="3" strokeLinecap="round"/>
    <path d="M 30 30 L 25 25" stroke={primaryColor} strokeWidth="3" strokeLinecap="round"/>
    <path d="M 35 35 L 32 28" stroke={primaryColor} strokeWidth="3" strokeLinecap="round"/>
    
    <path d="M 55 45 L 60 40" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round"/>
    <path d="M 50 40 L 55 35" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round"/>
    
    {/* 光る星 */}
    <path d="M 70 35 L 72 40 L 77 38 L 73 42 L 75 47 L 70 44 L 65 47 L 67 42 L 63 38 L 68 40 Z" fill={primaryColor} opacity="0.8"/>
    
    {/* エネルギーリング */}
    <ellipse cx="45" cy="45" rx="25" ry="20" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.3">
      <animate attributeName="rx" from="20" to="30" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="ry" from="15" to="25" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
    </ellipse>
  </svg>
)

export const HandshakeIcon = ({ size = 48, primaryColor = '#10b981', secondaryColor = '#86efac' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 左の手 */}
    <path d="M 20 50 Q 25 48, 30 50 L 40 50 Q 45 48, 50 50" fill="#fdbcb4"/>
    <rect x="15" y="48" width="15" height="8" rx="4" fill="#fdbcb4"/>
    <rect x="10" y="50" width="8" height="3" rx="1.5" fill="#fdbcb4"/>
    
    {/* 右の手 */}
    <path d="M 80 50 Q 75 48, 70 50 L 60 50 Q 55 48, 50 50" fill="#f9a8a0"/>
    <rect x="70" y="48" width="15" height="8" rx="4" fill="#f9a8a0"/>
    <rect x="82" y="50" width="8" height="3" rx="1.5" fill="#f9a8a0"/>
    
    {/* 握手部分 */}
    <ellipse cx="50" cy="50" rx="8" ry="6" fill="#fdbcb4"/>
    <ellipse cx="50" cy="50" rx="6" ry="4" fill="#f9a8a0"/>
    
    {/* 親指 */}
    <ellipse cx="45" cy="45" rx="3" ry="5" fill="#fdbcb4" transform="rotate(-30 45 45)"/>
    <ellipse cx="55" cy="45" rx="3" ry="5" fill="#f9a8a0" transform="rotate(30 55 45)"/>
    
    {/* 協力の光 */}
    <circle cx="50" cy="50" r="15" fill={secondaryColor} opacity="0.2"/>
    <circle cx="50" cy="50" r="12" fill={primaryColor} opacity="0.15"/>
    
    {/* ハートマーク */}
    <path d="M 50 30 C 47 27, 43 27, 43 31 C 43 35, 50 42, 50 42 C 50 42, 57 35, 57 31 C 57 27, 53 27, 50 30 Z" fill="#ef4444" opacity="0.8"/>
    
    {/* キラキラ */}
    <path d="M 30 35 L 31 37 L 33 36 L 31 38 L 32 40 L 30 38 L 28 40 L 29 38 L 27 36 L 29 37 Z" fill={primaryColor} opacity="0.6"/>
    <path d="M 70 35 L 71 37 L 73 36 L 71 38 L 72 40 L 70 38 L 68 40 L 69 38 L 67 36 L 69 37 Z" fill={primaryColor} opacity="0.6"/>
  </svg>
)

export const LeafIcon = ({ size = 48, primaryColor = '#10b981', secondaryColor = '#86efac' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 葉っぱ本体 */}
    <path d="M 50 20 Q 30 30, 30 50 Q 30 70, 50 80 Q 70 70, 70 50 Q 70 30, 50 20" fill={primaryColor}/>
    <path d="M 50 25 Q 35 35, 35 50 Q 35 65, 50 75 Q 65 65, 65 50 Q 65 35, 50 25" fill={secondaryColor}/>
    
    {/* 葉脈 */}
    <path d="M 50 30 L 50 70" stroke={primaryColor} strokeWidth="2"/>
    <path d="M 50 40 L 40 35" stroke={primaryColor} strokeWidth="1" opacity="0.7"/>
    <path d="M 50 40 L 60 35" stroke={primaryColor} strokeWidth="1" opacity="0.7"/>
    <path d="M 50 50 L 40 48" stroke={primaryColor} strokeWidth="1" opacity="0.7"/>
    <path d="M 50 50 L 60 48" stroke={primaryColor} strokeWidth="1" opacity="0.7"/>
    <path d="M 50 60 L 40 62" stroke={primaryColor} strokeWidth="1" opacity="0.7"/>
    <path d="M 50 60 L 60 62" stroke={primaryColor} strokeWidth="1" opacity="0.7"/>
    
    {/* 露 */}
    <circle cx="45" cy="45" r="3" fill="#06b6d4" opacity="0.6"/>
    <circle cx="44" cy="44" r="1" fill="white" opacity="0.8"/>
    
    {/* 茎 */}
    <path d="M 50 75 Q 50 85, 52 90" stroke="#8b7355" strokeWidth="3" fill="none"/>
    
    {/* 輝き */}
    <ellipse cx="55" cy="40" rx="8" ry="12" fill="white" opacity="0.3"/>
  </svg>
)

export const CheckIcon = ({ size = 48, primaryColor = '#10b981', secondaryColor = '#86efac' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 背景円 */}
    <circle cx="50" cy="50" r="35" fill={secondaryColor}/>
    <circle cx="50" cy="50" r="32" fill="white"/>
    <circle cx="50" cy="50" r="30" fill={primaryColor}/>
    
    {/* チェックマーク */}
    <path d="M 35 50 L 45 60 L 65 40" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* キラキラエフェクト */}
    <path d="M 70 25 L 72 30 L 77 28 L 73 32 L 75 37 L 70 34 L 65 37 L 67 32 L 63 28 L 68 30 Z" fill={secondaryColor} opacity="0.8"/>
    
    {/* 光の輪 */}
    <circle cx="50" cy="50" r="38" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.3">
      <animate attributeName="r" from="35" to="42" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

export const ClockIcon = ({ size = 48, primaryColor = '#6366f1', secondaryColor = '#a5b4fc' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 時計の外枠 */}
    <circle cx="50" cy="50" r="35" fill={primaryColor}/>
    <circle cx="50" cy="50" r="32" fill="white"/>
    <circle cx="50" cy="50" r="30" fill="#f8f9fa"/>
    
    {/* 時間マーカー */}
    <rect x="49" y="22" width="2" height="6" fill={primaryColor}/>
    <rect x="49" y="72" width="2" height="6" fill={primaryColor}/>
    <rect x="22" y="49" width="6" height="2" fill={primaryColor}/>
    <rect x="72" y="49" width="6" height="2" fill={primaryColor}/>
    
    {/* 小さいマーカー */}
    <circle cx="65" cy="30" r="1" fill={secondaryColor}/>
    <circle cx="70" cy="35" r="1" fill={secondaryColor}/>
    <circle cx="70" cy="65" r="1" fill={secondaryColor}/>
    <circle cx="65" cy="70" r="1" fill={secondaryColor}/>
    <circle cx="35" cy="70" r="1" fill={secondaryColor}/>
    <circle cx="30" cy="65" r="1" fill={secondaryColor}/>
    <circle cx="30" cy="35" r="1" fill={secondaryColor}/>
    <circle cx="35" cy="30" r="1" fill={secondaryColor}/>
    
    {/* 針 */}
    <line x1="50" y1="50" x2="50" y2="35" stroke={primaryColor} strokeWidth="3" strokeLinecap="round"/>
    <line x1="50" y1="50" x2="60" y2="55" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round"/>
    
    {/* 中心 */}
    <circle cx="50" cy="50" r="3" fill={primaryColor}/>
    <circle cx="50" cy="50" r="1.5" fill="white"/>
    
    {/* アラームベル */}
    <path d="M 35 18 Q 35 15, 38 15 Q 41 15, 41 18" fill="none" stroke={primaryColor} strokeWidth="2" strokeLinecap="round"/>
    <path d="M 59 18 Q 59 15, 62 15 Q 65 15, 65 18" fill="none" stroke={primaryColor} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="38" cy="16" r="2" fill={secondaryColor}/>
    <circle cx="62" cy="16" r="2" fill={secondaryColor}/>
  </svg>
)

export const ProgressIcon = ({ size = 48, primaryColor = '#f59e0b', secondaryColor = '#fde047' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* 背景の円 */}
    <circle cx="50" cy="50" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
    
    {/* プログレスバー */}
    <circle cx="50" cy="50" r="35" fill="none" stroke={primaryColor} strokeWidth="6" 
            strokeDasharray="220" strokeDashoffset="55" strokeLinecap="round" 
            transform="rotate(-90 50 50)"/>
    
    {/* パーセンテージ背景 */}
    <circle cx="50" cy="50" r="25" fill="white"/>
    
    {/* パーセンテージテキスト */}
    <text x="50" y="50" fontSize="20" fill={primaryColor} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">75%</text>
    
    {/* 装飾的な点 */}
    <circle cx="50" cy="15" r="3" fill={secondaryColor}/>
    <circle cx="75" cy="30" r="2" fill={primaryColor} opacity="0.6"/>
    <circle cx="75" cy="70" r="2" fill={primaryColor} opacity="0.6"/>
    
    {/* 上昇矢印 */}
    <path d="M 70 45 L 75 40 L 80 45" stroke={primaryColor} strokeWidth="2" fill="none" strokeLinecap="round"/>
    <line x1="75" y1="40" x2="75" y2="50" stroke={primaryColor} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const DataExportIcon = ({ size = 48, primaryColor = '#6366f1', secondaryColor = '#a5b4fc' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* フォルダ */}
    <path d="M 20 30 L 80 30 L 80 75 L 20 75 Z" fill={secondaryColor}/>
    <path d="M 20 30 L 35 20 L 50 20 L 65 30" fill={primaryColor}/>
    <rect x="25" y="35" width="50" height="35" fill="white"/>
    
    {/* 矢印 */}
    <path d="M 45 55 L 45 45 L 40 45 L 50 35 L 60 45 L 55 45 L 55 55" fill={primaryColor}/>
    
    {/* データ点 */}
    <circle cx="30" cy="50" r="2" fill={primaryColor} opacity="0.6"/>
    <circle cx="70" cy="50" r="2" fill={primaryColor} opacity="0.6"/>
    <circle cx="50" cy="65" r="2" fill={primaryColor} opacity="0.6"/>
    
    {/* 光 */}
    <path d="M 50 25 L 52 20 L 54 25" fill={primaryColor} opacity="0.8"/>
    <path d="M 45 27 L 43 22 L 47 27" fill={primaryColor} opacity="0.6"/>
    <path d="M 55 27 L 53 22 L 57 27" fill={primaryColor} opacity="0.6"/>
  </svg>
)

export const DeleteAccountIcon = ({ size = 48, primaryColor = '#ef4444', secondaryColor = '#fca5a5' }: { size?: number, primaryColor?: string, secondaryColor?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* ゴミ箱の蓋 */}
    <rect x="30" y="25" width="40" height="5" rx="2" fill={primaryColor}/>
    <rect x="45" y="20" width="10" height="8" rx="2" fill={primaryColor}/>
    
    {/* ゴミ箱本体 */}
    <path d="M 35 30 L 37 75 Q 37 80, 42 80 L 58 80 Q 63 80, 63 75 L 65 30" fill={secondaryColor}/>
    <path d="M 37 32 L 39 73 Q 39 76, 42 76 L 58 76 Q 61 76, 61 73 L 63 32" fill={primaryColor}/>
    
    {/* 縦線 */}
    <rect x="44" y="40" width="2" height="25" rx="1" fill="white" opacity="0.6"/>
    <rect x="49" y="40" width="2" height="25" rx="1" fill="white" opacity="0.6"/>
    <rect x="54" y="40" width="2" height="25" rx="1" fill="white" opacity="0.6"/>
    
    {/* 警告マーク */}
    <circle cx="70" cy="70" r="10" fill={primaryColor}/>
    <text x="70" y="74" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">!</text>
  </svg>
)

// Unified Icon System - Filled style for consistency
export const CalendarWeekIcon = ({ size = 24, color = '#9ca3af' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="25" width="70" height="60" rx="8" fill={color} opacity="0.2"/>
    <rect x="15" y="25" width="70" height="15" rx="8" fill={color}/>
    <rect x="25" y="15" width="8" height="15" rx="2" fill={color}/>
    <rect x="67" y="15" width="8" height="15" rx="2" fill={color}/>
    <rect x="25" y="50" width="12" height="8" rx="2" fill={color} opacity="0.7"/>
    <rect x="44" y="50" width="12" height="8" rx="2" fill={color} opacity="0.7"/>
    <rect x="63" y="50" width="12" height="8" rx="2" fill={color} opacity="0.7"/>
    <rect x="25" y="65" width="12" height="8" rx="2" fill={color} opacity="0.5"/>
    <rect x="44" y="65" width="12" height="8" rx="2" fill={color} opacity="0.5"/>
  </svg>
)

export const CalendarMonthIcon = ({ size = 24, color = '#9ca3af' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="25" width="70" height="60" rx="8" fill={color} opacity="0.2"/>
    <rect x="15" y="25" width="70" height="15" rx="8" fill={color}/>
    <rect x="25" y="15" width="8" height="15" rx="2" fill={color}/>
    <rect x="67" y="15" width="8" height="15" rx="2" fill={color}/>
    <circle cx="30" cy="53" r="3" fill={color} opacity="0.7"/>
    <circle cx="43" cy="53" r="3" fill={color} opacity="0.7"/>
    <circle cx="57" cy="53" r="3" fill={color} opacity="0.7"/>
    <circle cx="70" cy="53" r="3" fill={color} opacity="0.7"/>
    <circle cx="30" cy="67" r="3" fill={color} opacity="0.5"/>
    <circle cx="43" cy="67" r="3" fill={color} opacity="0.5"/>
    <circle cx="57" cy="67" r="3" fill={color} opacity="0.5"/>
    <circle cx="70" cy="67" r="3" fill={color} opacity="0.5"/>
  </svg>
)

export const CalendarYearIcon = ({ size = 24, color = '#9ca3af' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="25" width="70" height="60" rx="8" fill={color} opacity="0.2"/>
    <rect x="15" y="25" width="70" height="15" rx="8" fill={color}/>
    <rect x="25" y="15" width="8" height="15" rx="2" fill={color}/>
    <rect x="67" y="15" width="8" height="15" rx="2" fill={color}/>
    <text x="50" y="60" fontSize="20" fill={color} textAnchor="middle" fontWeight="bold">2025</text>
    <rect x="20" y="70" width="15" height="10" rx="2" fill={color} opacity="0.3"/>
    <rect x="42" y="70" width="15" height="10" rx="2" fill={color} opacity="0.3"/>
    <rect x="65" y="70" width="15" height="10" rx="2" fill={color} opacity="0.3"/>
  </svg>
)

export const TrendUpIcon = ({ size = 24, color = '#a3e635' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="80" height="80" rx="8" fill={color} opacity="0.1"/>
    <path d="M 20 70 L 35 55 L 50 65 L 80 30" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M 65 30 L 80 30 L 80 45" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="70" r="4" fill={color}/>
    <circle cx="35" cy="55" r="4" fill={color}/>
    <circle cx="50" cy="65" r="4" fill={color}/>
    <circle cx="80" cy="30" r="4" fill={color}/>
  </svg>
)

export const TrophySimpleIcon = ({ size = 24, color = '#fbbf24' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M 30 25 L 30 45 Q 30 60, 50 60 Q 70 60, 70 45 L 70 25 Z" fill={color} opacity="0.3"/>
    <path d="M 35 30 L 35 45 Q 35 55, 50 55 Q 65 55, 65 45 L 65 30 Z" fill={color}/>
    <rect x="30" y="25" width="40" height="8" rx="2" fill={color}/>
    <path d="M 30 35 L 20 35 Q 15 35, 15 40 Q 15 45, 20 45 L 30 45" fill={color} opacity="0.6"/>
    <path d="M 70 35 L 80 35 Q 85 35, 85 40 Q 85 45, 80 45 L 70 45" fill={color} opacity="0.6"/>
    <rect x="47" y="55" width="6" height="20" fill={color} opacity="0.5"/>
    <rect x="35" y="75" width="30" height="6" rx="3" fill={color} opacity="0.7"/>
  </svg>
)

export const RunnerIcon = ({ size = 24, color = '#f87171' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="65" cy="25" r="8" fill={color}/>
    <path d="M 50 45 Q 45 40, 40 35 L 30 40" fill={color} opacity="0.8"/>
    <path d="M 50 45 Q 55 42, 60 35 L 75 40" fill={color} opacity="0.8"/>
    <path d="M 50 45 L 35 65 L 30 85" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
    <path d="M 50 45 L 65 65 L 70 85" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="45" rx="12" ry="18" fill={color}/>
    <path d="M 15 85 L 85 85" stroke={color} strokeWidth="2" opacity="0.3"/>
  </svg>
)

export const RocketIcon = ({ size = 24, color = '#a3e635' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50 15 Q 65 15, 65 35 L 65 65 L 60 70 L 40 70 L 35 65 L 35 35 Q 35 15, 50 15" fill={color} opacity="0.3"/>
    <path d="M 50 20 Q 60 20, 60 35 L 60 60 L 55 65 L 45 65 L 40 60 L 40 35 Q 40 20, 50 20" fill={color}/>
    <circle cx="50" cy="35" r="8" fill="white" opacity="0.8"/>
    <path d="M 40 65 L 35 75 L 30 85" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M 60 65 L 65 75 L 70 85" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M 50 65 L 50 80" stroke={color} strokeWidth="4" strokeLinecap="round"/>
    <circle cx="30" cy="75" r="8" fill={color} opacity="0.4"/>
    <circle cx="70" cy="75" r="8" fill={color} opacity="0.4"/>
  </svg>
)

export const SparkleIcon = ({ size = 24, color = '#a78bfa' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50 15 L 55 40 L 80 45 L 55 50 L 50 75 L 45 50 L 20 45 L 45 40 Z" fill={color} opacity="0.3"/>
    <path d="M 50 20 L 54 38 L 72 42 L 54 46 L 50 64 L 46 46 L 28 42 L 46 38 Z" fill={color}/>
    <path d="M 25 20 L 27 25 L 32 27 L 27 29 L 25 34 L 23 29 L 18 27 L 23 25 Z" fill={color} opacity="0.6"/>
    <path d="M 75 65 L 77 70 L 82 72 L 77 74 L 75 79 L 73 74 L 68 72 L 73 70 Z" fill={color} opacity="0.6"/>
  </svg>
)

export const ExportIcon = ({ size = 24, color = '#a3e635' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="45" width="60" height="40" rx="8" fill={color} opacity="0.2"/>
    <rect x="25" y="50" width="50" height="30" rx="6" fill={color} opacity="0.4"/>
    <path d="M 50 20 L 50 55" stroke={color} strokeWidth="5" strokeLinecap="round"/>
    <path d="M 35 35 L 50 20 L 65 35" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="40" y="60" width="20" height="3" rx="1.5" fill="white" opacity="0.6"/>
    <rect x="35" y="68" width="30" height="3" rx="1.5" fill="white" opacity="0.6"/>
  </svg>
)

export const MoodHappyIcon = ({ size = 24, color = '#a3e635' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="35" fill={color} opacity="0.2"/>
    <circle cx="50" cy="50" r="30" fill={color}/>
    <circle cx="38" cy="42" r="4" fill="white"/>
    <circle cx="62" cy="42" r="4" fill="white"/>
    <path d="M 35 58 Q 50 68 65 58" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
)

export const LightningIcon = ({ size = 24, color = '#fbbf24' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M 55 15 L 35 50 L 45 50 L 40 85 L 65 45 L 55 45 Z" fill={color} opacity="0.2"/>
    <path d="M 50 20 L 35 50 L 45 50 L 40 80 L 60 45 L 50 45 Z" fill={color}/>
  </svg>
)

export const StressIcon = ({ size = 24, color = '#f87171' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="35" fill={color} opacity="0.2"/>
    <circle cx="50" cy="50" r="30" fill={color}/>
    <path d="M 35 38 L 40 43 M 40 38 L 35 43" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <path d="M 60 38 L 65 43 M 65 38 L 60 43" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <path d="M 38 58 L 62 58" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

export const SleepIcon = ({ size = 24, color = '#60a5fa' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M 50 20 Q 35 25, 35 50 Q 35 75, 50 80 Q 45 75, 45 50 Q 45 25, 50 20" fill={color} opacity="0.3"/>
    <path d="M 50 25 Q 40 30, 40 50 Q 40 70, 50 75 Q 47 70, 47 50 Q 47 30, 50 25" fill={color}/>
    <circle cx="65" cy="30" r="2" fill={color} opacity="0.6"/>
    <circle cx="70" cy="40" r="1.5" fill={color} opacity="0.5"/>
    <circle cx="60" cy="35" r="1" fill={color} opacity="0.4"/>
  </svg>
)

export const CelebrationIcon = ({ size = 24, color = '#fbbf24' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="30" width="5" height="10" rx="2" fill={color} opacity="0.6" transform="rotate(-15 22.5 35)"/>
    <rect x="75" y="25" width="5" height="10" rx="2" fill={color} opacity="0.6" transform="rotate(15 77.5 30)"/>
    <rect x="40" y="20" width="5" height="10" rx="2" fill={color} opacity="0.8" transform="rotate(-10 42.5 25)"/>
    <rect x="55" y="22" width="5" height="10" rx="2" fill={color} opacity="0.8" transform="rotate(10 57.5 27)"/>
    <path d="M 50 35 L 45 25 L 55 25 Z" fill={color}/>
    <ellipse cx="30" cy="50" rx="8" ry="12" fill={color} opacity="0.7"/>
    <ellipse cx="70" cy="50" rx="8" ry="12" fill={color} opacity="0.7"/>
    <ellipse cx="50" cy="55" rx="10" ry="15" fill={color}/>
    <path d="M 30 65 Q 40 60, 50 65 Q 60 60, 70 65" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <circle cx="25" cy="75" r="3" fill={color} opacity="0.5"/>
    <circle cx="50" cy="80" r="3" fill={color} opacity="0.5"/>
    <circle cx="75" cy="75" r="3" fill={color} opacity="0.5"/>
  </svg>
)

export const RelaxIcon = ({ size = 24, color = '#a78bfa' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="35" fill={color} opacity="0.2"/>
    <circle cx="50" cy="50" r="30" fill={color}/>
    <path d="M 35 42 Q 38 40, 41 42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M 59 42 Q 62 40, 65 42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M 38 58 Q 50 62 62 58" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="1" opacity="0.2">
      <animate attributeName="r" from="35" to="42" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite"/>
    </circle>
  </svg>
)