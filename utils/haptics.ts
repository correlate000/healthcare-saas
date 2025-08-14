// バイブレーション・触覚フィードバック機能

export class HapticsManager {
  private static isSupported: boolean = typeof window !== 'undefined' && 'vibrate' in navigator

  // 軽い触覚フィードバック
  static light() {
    if (!this.isSupported) return
    navigator.vibrate(10)
  }

  // 中程度の触覚フィードバック
  static medium() {
    if (!this.isSupported) return
    navigator.vibrate(20)
  }

  // 強い触覚フィードバック
  static heavy() {
    if (!this.isSupported) return
    navigator.vibrate(30)
  }

  // 成功時のフィードバック
  static success() {
    if (!this.isSupported) return
    navigator.vibrate([30, 50, 30])
  }

  // エラー時のフィードバック
  static error() {
    if (!this.isSupported) return
    navigator.vibrate([50, 100, 50])
  }

  // 警告時のフィードバック
  static warning() {
    if (!this.isSupported) return
    navigator.vibrate([20, 40, 20, 40, 20])
  }

  // レベルアップ時の特別なフィードバック
  static levelUp() {
    if (!this.isSupported) return
    navigator.vibrate([50, 100, 50, 100, 50, 100, 100])
  }

  // チャレンジ完了時のフィードバック
  static challengeComplete(difficulty: 'easy' | 'medium' | 'hard' | 'expert') {
    if (!this.isSupported) return
    
    const patterns = {
      easy: [30],
      medium: [30, 50, 30],
      hard: [50, 50, 50, 50],
      expert: [100, 50, 100, 50, 100]
    }
    
    navigator.vibrate(patterns[difficulty])
  }

  // ストリーク達成時のフィードバック
  static streakAchieved(days: number) {
    if (!this.isSupported) return
    
    if (days === 7) {
      // 1週間達成
      navigator.vibrate([100, 100, 100, 100, 200])
    } else if (days === 30) {
      // 1ヶ月達成
      navigator.vibrate([200, 100, 200, 100, 200, 100, 300])
    } else if (days === 100) {
      // 100日達成
      navigator.vibrate([300, 100, 300, 100, 300, 100, 500])
    } else {
      // 通常のストリーク
      navigator.vibrate([50, 50, 50])
    }
  }

  // カスタムパターン
  static custom(pattern: number[]) {
    if (!this.isSupported) return
    navigator.vibrate(pattern)
  }

  // 振動を停止
  static stop() {
    if (!this.isSupported) return
    navigator.vibrate(0)
  }

  // 振動が利用可能かチェック
  static checkSupport(): boolean {
    return this.isSupported
  }
}

// アニメーション効果と組み合わせるヘルパー関数
export function createRippleEffect(
  x: number,
  y: number,
  color: string = '#a3e635',
  duration: number = 600
): HTMLElement {
  const ripple = document.createElement('div')
  
  ripple.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: ${color};
    opacity: 0.6;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9999;
    animation: rippleEffect ${duration}ms ease-out forwards;
  `
  
  // アニメーションを追加
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style')
    style.id = 'ripple-styles'
    style.textContent = `
      @keyframes rippleEffect {
        to {
          width: 200px;
          height: 200px;
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
  
  document.body.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, duration)
  
  return ripple
}

// XP獲得時のパーティクル効果
export function createXpParticles(
  x: number,
  y: number,
  amount: number,
  color: string = '#fbbf24'
): void {
  const particleCount = 8
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    const angle = (Math.PI * 2 * i) / particleCount
    const velocity = 100 + Math.random() * 50
    
    particle.textContent = `+${Math.ceil(amount / particleCount)}`
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      color: ${color};
      font-size: 18px;
      font-weight: bold;
      pointer-events: none;
      z-index: 10000;
      animation: particleFly 1.5s ease-out forwards;
      --tx: ${Math.cos(angle) * velocity}px;
      --ty: ${Math.sin(angle) * velocity - 50}px;
    `
    
    document.body.appendChild(particle)
    
    setTimeout(() => {
      particle.remove()
    }, 1500)
  }
  
  // パーティクルアニメーションを追加
  if (!document.getElementById('particle-styles')) {
    const style = document.createElement('style')
    style.id = 'particle-styles'
    style.textContent = `
      @keyframes particleFly {
        0% {
          transform: translate(0, 0) scale(0);
          opacity: 1;
        }
        50% {
          transform: translate(var(--tx), var(--ty)) scale(1.2);
          opacity: 1;
        }
        100% {
          transform: translate(var(--tx), calc(var(--ty) + 30px)) scale(0.8);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
}

// レベルアップ時の特別な効果
export function createLevelUpEffect(newLevel: number): void {
  HapticsManager.levelUp()
  
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
    pointer-events: none;
    animation: levelUpPulse 2s ease-out forwards;
  `
  
  container.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: #111827;
      padding: 24px 48px;
      border-radius: 20px;
      font-size: 24px;
      font-weight: bold;
      box-shadow: 0 20px 60px rgba(251, 191, 36, 0.5);
      text-align: center;
    ">
      <div style="font-size: 48px; margin-bottom: 8px;">🎉</div>
      <div>LEVEL UP!</div>
      <div style="font-size: 32px; margin-top: 8px;">Lv.${newLevel}</div>
    </div>
  `
  
  document.body.appendChild(container)
  
  // 花火エフェクト
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const spark = document.createElement('div')
      const angle = (Math.PI * 2 * i) / 20
      const distance = 150 + Math.random() * 100
      
      spark.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 4px;
        background: ${['#fbbf24', '#f59e0b', '#a3e635', '#60a5fa'][Math.floor(Math.random() * 4)]};
        border-radius: 50%;
        animation: spark 1s ease-out forwards;
        --dx: ${Math.cos(angle) * distance}px;
        --dy: ${Math.sin(angle) * distance}px;
      `
      
      container.appendChild(spark)
    }, i * 50)
  }
  
  // アニメーションスタイルを追加
  if (!document.getElementById('levelup-styles')) {
    const style = document.createElement('style')
    style.id = 'levelup-styles'
    style.textContent = `
      @keyframes levelUpPulse {
        0% {
          transform: translate(-50%, -50%) scale(0) rotate(-180deg);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
          opacity: 0;
        }
      }
      
      @keyframes spark {
        0% {
          transform: translate(-50%, -50%);
          opacity: 1;
        }
        100% {
          transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)));
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
  
  setTimeout(() => {
    container.remove()
  }, 2000)
}