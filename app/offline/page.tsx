'use client'

export default function Offline() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <div className="text-4xl">📱</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">オフラインです</h1>
          <p className="text-gray-600 leading-relaxed">
            インターネット接続を確認してください。接続が復旧すると、自動的に同期されます。
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">オフライン機能</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• チェックインデータは一時保存されます</li>
              <li>• 過去の記録は閲覧可能です</li>
              <li>• 接続復旧時に自動同期されます</li>
            </ul>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            再接続を試す
          </button>
        </div>
      </div>
    </div>
  )
}