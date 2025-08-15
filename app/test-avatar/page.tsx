'use client'

import { CharacterAvatar } from '@/components/CharacterAvatar'

export default function TestAvatar() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#111827', minHeight: '100vh' }}>
      <h1 style={{ color: 'white' }}>SVG Character Test</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ color: '#a3e635' }}>Luna - Normal</h2>
          <CharacterAvatar characterId="luna" mood="normal" size={100} />
        </div>
        
        <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ color: '#60a5fa' }}>Aria - Happy</h2>
          <CharacterAvatar characterId="aria" mood="happy" size={100} />
        </div>
        
        <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ color: '#f59e0b' }}>Zen - Sleeping</h2>
          <CharacterAvatar characterId="zen" mood="sleeping" size={100} />
        </div>
        
        <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ color: '#a3e635' }}>Luna - Sad</h2>
          <CharacterAvatar characterId="luna" mood="sad" size={100} />
        </div>
        
        <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ color: '#60a5fa' }}>Aria - Angry</h2>
          <CharacterAvatar characterId="aria" mood="angry" size={100} />
        </div>
        
        <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ color: '#f59e0b' }}>Zen - Worried</h2>
          <CharacterAvatar characterId="zen" mood="worried" size={100} />
        </div>
      </div>
    </div>
  )
}