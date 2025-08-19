'use client'

import { config } from '@/lib/config'

export default function EnvironmentBanner() {
  if (config.environment === 'production') {
    return null
  }

  const getBannerColor = () => {
    switch (config.environment) {
      case 'staging':
        return 'bg-yellow-500'
      case 'demo':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getBannerText = () => {
    switch (config.environment) {
      case 'staging':
        return '🚧 ステージング環境'
      case 'demo':
        return '🎯 デモ環境（営業用）'
      default:
        return '⚠️ 開発環境'
    }
  }

  return (
    <div className={`${getBannerColor()} text-white text-center py-2 text-sm font-medium`}>
      {getBannerText()}
      {config.environment === 'demo' && (
        <span className="ml-2">- モックデータを使用中</span>
      )}
    </div>
  )
}