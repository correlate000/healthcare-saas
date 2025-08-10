import React from 'react'

interface VoiceCharacterProps {
  isActive: boolean
  isSpeaking: boolean
  isListening: boolean
  size?: number
}

export const VoiceCharacter: React.FC<VoiceCharacterProps> = ({
  isActive,
  isSpeaking,
  isListening,
  size = 200
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{
        filter: isActive ? 'drop-shadow(0 0 20px rgba(240, 147, 251, 0.5))' : 'none'
      }}
    >
      {/* Face Circle */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill={isActive ? "#f093fb" : "#94a3b8"}
        opacity="0.9"
      />
      
      {/* Face Gradient */}
      <defs>
        <radialGradient id="faceGradient">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx="100"
        cy="100"
        r="75"
        fill="url(#faceGradient)"
      />
      
      {/* Eyes */}
      <g>
        {/* Left Eye */}
        <ellipse
          cx="75"
          cy="85"
          rx="12"
          ry={isListening ? "18" : "12"}
          fill="#333"
          style={{
            transition: 'all 0.3s ease'
          }}
        />
        <ellipse
          cx="77"
          cy="83"
          rx="4"
          ry="4"
          fill="#fff"
        />
        
        {/* Right Eye */}
        <ellipse
          cx="125"
          cy="85"
          rx="12"
          ry={isListening ? "18" : "12"}
          fill="#333"
          style={{
            transition: 'all 0.3s ease'
          }}
        />
        <ellipse
          cx="127"
          cy="83"
          rx="4"
          ry="4"
          fill="#fff"
        />
        
        {/* Blinking Animation */}
        {!isActive && (
          <>
            <rect
              x="60"
              y="75"
              width="30"
              height="20"
              fill={isActive ? "#f093fb" : "#94a3b8"}
              style={{
                animation: 'blink 4s infinite'
              }}
            />
            <rect
              x="110"
              y="75"
              width="30"
              height="20"
              fill={isActive ? "#f093fb" : "#94a3b8"}
              style={{
                animation: 'blink 4s infinite'
              }}
            />
          </>
        )}
      </g>
      
      {/* Mouth */}
      <g>
        {isSpeaking ? (
          // Speaking Animation
          <ellipse
            cx="100"
            cy="125"
            rx="25"
            ry="15"
            fill="#333"
            style={{
              animation: 'speak 0.3s infinite alternate'
            }}
          />
        ) : isListening ? (
          // Listening - Open mouth
          <ellipse
            cx="100"
            cy="125"
            rx="20"
            ry="12"
            fill="#333"
          />
        ) : isActive ? (
          // Active - Smile
          <path
            d="M 75 120 Q 100 135 125 120"
            stroke="#333"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          // Inactive - Neutral
          <line
            x1="85"
            y1="125"
            x2="115"
            y2="125"
            stroke="#333"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}
      </g>
      
      {/* Cheeks (when active) */}
      {isActive && (
        <>
          <circle
            cx="55"
            cy="100"
            r="8"
            fill="#ff6b6b"
            opacity="0.3"
          />
          <circle
            cx="145"
            cy="100"
            r="8"
            fill="#ff6b6b"
            opacity="0.3"
          />
        </>
      )}
      
      {/* Sound Waves when speaking */}
      {isSpeaking && (
        <g>
          <path
            d="M 30 100 Q 20 90 10 100 Q 20 110 30 100"
            stroke="#f093fb"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
            style={{
              animation: 'soundWave 1s infinite'
            }}
          />
          <path
            d="M 170 100 Q 180 90 190 100 Q 180 110 170 100"
            stroke="#f093fb"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
            style={{
              animation: 'soundWave 1s infinite 0.5s'
            }}
          />
        </g>
      )}
      
      {/* Antenna (optional tech element) */}
      <g>
        <line
          x1="100"
          y1="20"
          x2="100"
          y2="35"
          stroke={isActive ? "#f093fb" : "#94a3b8"}
          strokeWidth="3"
        />
        <circle
          cx="100"
          cy="18"
          r="5"
          fill={isActive ? "#10b981" : "#64748b"}
          style={{
            animation: isActive ? 'pulse 2s infinite' : 'none'
          }}
        />
      </g>
      
      <style jsx>{`
        @keyframes speak {
          0% {
            ry: 15;
          }
          100% {
            ry: 5;
          }
        }
        
        @keyframes blink {
          0%, 90%, 100% {
            opacity: 0;
          }
          95% {
            opacity: 1;
          }
        }
        
        @keyframes soundWave {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            r: 5;
            opacity: 1;
          }
          50% {
            r: 7;
            opacity: 0.7;
          }
        }
      `}</style>
    </svg>
  )
}