'use client'

import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface Character3DProps {
  character: 'luna' | 'aria' | 'zen'
  emotion?: 'happy' | 'excited' | 'calm' | 'concerned' | 'thinking' | 'celebrating'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  showVoiceWave?: boolean
  className?: string
}

const characters = {
  luna: {
    name: 'Luna',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899', 
    animalType: 'cat',
    personality: 'gentle'
  },
  aria: {
    name: 'Aria',
    primaryColor: '#3B82F6',
    secondaryColor: '#06B6D4',
    animalType: 'butterfly',
    personality: 'energetic'
  },
  zen: {
    name: 'Zen',
    primaryColor: '#10B981',
    secondaryColor: '#14B8A6',
    animalType: 'owl',
    personality: 'wise'
  }
}

const emotions = {
  happy: { scale: 1, speed: 1, bounce: 0.3 },
  excited: { scale: 1.1, speed: 2, bounce: 0.5 },
  calm: { scale: 0.95, speed: 0.5, bounce: 0.1 },
  concerned: { scale: 0.9, speed: 0.3, bounce: 0 },
  thinking: { scale: 1, speed: 0.7, bounce: 0.2 },
  celebrating: { scale: 1.2, speed: 3, bounce: 0.8 }
}

// 3D Cat Character Component
function Cat3D({ character, emotion, animated }: { 
  character: typeof characters.luna, 
  emotion: typeof emotions.happy,
  animated: boolean 
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const earLeftRef = useRef<THREE.Mesh>(null!)
  const earRightRef = useRef<THREE.Mesh>(null!)
  const tailRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (!animated) return
    
    const t = state.clock.getElapsedTime()
    
    // Main body floating
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * emotion.speed) * 0.3
      meshRef.current.position.y = Math.sin(t * emotion.speed * 2) * emotion.bounce * 0.1
    }
    
    // Ears wiggling
    if (earLeftRef.current && earRightRef.current) {
      earLeftRef.current.rotation.z = Math.sin(t * 2) * 0.2
      earRightRef.current.rotation.z = Math.sin(t * 2 + Math.PI) * 0.2
    }
    
    // Tail swaying
    if (tailRef.current) {
      tailRef.current.rotation.x = Math.sin(t * 1.5) * 0.5
    }
  })

  return (
    <group scale={emotion.scale}>
      {/* Main Body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.2, 0.3]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
      
      {/* Ears */}
      <mesh ref={earLeftRef} position={[-0.4, 1.7, 0.2]}>
        <coneGeometry args={[0.3, 0.6, 4]} />
        <meshStandardMaterial color={character.secondaryColor} />
      </mesh>
      <mesh ref={earRightRef} position={[0.4, 1.7, 0.2]}>
        <coneGeometry args={[0.3, 0.6, 4]} />
        <meshStandardMaterial color={character.secondaryColor} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.2, 1.3, 0.8]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, 1.3, 0.8]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 1.1, 0.9]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>
      
      {/* Tail */}
      <mesh ref={tailRef} position={[0, 0.5, -1.2]}>
        <cylinderGeometry args={[0.1, 0.05, 1.5, 8]} />
        <meshStandardMaterial color={character.secondaryColor} />
      </mesh>
      
      {/* Paws */}
      <mesh position={[-0.5, -0.8, 0.3]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
      <mesh position={[0.5, -0.8, 0.3]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
      <mesh position={[-0.3, -0.8, -0.5]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
      <mesh position={[0.3, -0.8, -0.5]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
    </group>
  )
}

// 3D Butterfly Character Component
function Butterfly3D({ character, emotion, animated }: { 
  character: typeof characters.aria, 
  emotion: typeof emotions.happy,
  animated: boolean 
}) {
  const wingLeftRef = useRef<THREE.Mesh>(null!)
  const wingRightRef = useRef<THREE.Mesh>(null!)
  const bodyRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (!animated) return
    
    const t = state.clock.getElapsedTime()
    
    // Wing flapping
    if (wingLeftRef.current && wingRightRef.current) {
      const flapSpeed = emotion.speed * 8
      wingLeftRef.current.rotation.z = Math.sin(t * flapSpeed) * 0.8
      wingRightRef.current.rotation.z = Math.sin(t * flapSpeed + Math.PI) * 0.8
    }
    
    // Body floating
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * emotion.speed) * emotion.bounce * 0.2
      bodyRef.current.rotation.z = Math.sin(t * emotion.speed * 0.5) * 0.1
    }
  })

  return (
    <group scale={emotion.scale}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.05, 1.5, 8]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
      
      {/* Wings */}
      <mesh ref={wingLeftRef} position={[-0.6, 0.2, 0]} rotation={[0, 0, Math.PI/4]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial 
          color={character.secondaryColor} 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wingRightRef} position={[0.6, 0.2, 0]} rotation={[0, 0, -Math.PI/4]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial 
          color={character.secondaryColor} 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Lower Wings */}
      <mesh position={[-0.4, -0.3, 0]} rotation={[0, 0, Math.PI/6]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial 
          color={character.primaryColor} 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0.4, -0.3, 0]} rotation={[0, 0, -Math.PI/6]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial 
          color={character.primaryColor} 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Antennae */}
      <mesh position={[-0.1, 1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.1, 1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

// 3D Owl Character Component
function Owl3D({ character, emotion, animated }: { 
  character: typeof characters.zen, 
  emotion: typeof emotions.happy,
  animated: boolean 
}) {
  const bodyRef = useRef<THREE.Mesh>(null!)
  const headRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (!animated) return
    
    const t = state.clock.getElapsedTime()
    
    // Gentle breathing motion
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(t * emotion.speed) * 0.05
    }
    
    // Head turning
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * emotion.speed * 0.5) * 0.3
    }
  })

  return (
    <group scale={emotion.scale}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={character.primaryColor} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.2, 0.6, 0.5]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.2, 0.6, 0.5]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Pupils */}
      <mesh position={[-0.2, 0.6, 0.6]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, 0.6, 0.6]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Beak */}
      <mesh position={[0, 0.3, 0.6]}>
        <coneGeometry args={[0.1, 0.2, 4]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI/6]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color={character.secondaryColor} />
      </mesh>
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, -Math.PI/6]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color={character.secondaryColor} />
      </mesh>
      
      {/* Ear tufts */}
      <mesh position={[-0.3, 1, 0]}>
        <coneGeometry args={[0.1, 0.3, 4]} />
        <meshStandardMaterial color={character.secondaryColor} />
      </mesh>
      <mesh position={[0.3, 1, 0]}>
        <coneGeometry args={[0.1, 0.3, 4]} />
        <meshStandardMaterial color={character.secondaryColor} />
      </mesh>
    </group>
  )
}

// Main Scene Component
function Character3DScene({ character, emotion, animated }: {
  character: keyof typeof characters
  emotion: keyof typeof emotions
  animated: boolean
}) {
  const charData = characters[character]
  const emotionData = emotions[emotion]

  const CharacterComponent = charData.animalType === 'cat' ? Cat3D :
                           charData.animalType === 'butterfly' ? Butterfly3D : Owl3D

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color={charData.secondaryColor} />
      
      {/* Character */}
      <Float speed={emotionData.speed} rotationIntensity={0.3} floatIntensity={emotionData.bounce}>
        <CharacterComponent 
          character={charData} 
          emotion={emotionData} 
          animated={animated}
        />
      </Float>
      
      {/* Sparkle effects */}
      {emotion === 'celebrating' && (
        <>
          <mesh position={[2, 2, 0]}>
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
          <mesh position={[-2, 1, 1]}>
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
          <mesh position={[1, -1, -2]}>
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        </>
      )}
    </>
  )
}

// Loading fallback component
function Character3DFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
}

export function Character3D({
  character = 'luna',
  emotion = 'happy',
  size = 'md',
  animated = true,
  showVoiceWave = false,
  className = ''
}: Character3DProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const sizeConfig = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 160, height: 160 },
    xl: { width: 200, height: 200 }
  }

  const config = sizeConfig[size]

  if (!isClient) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-full`}
        style={{ width: config.width, height: config.height }}
      >
        <Character3DFallback />
      </div>
    )
  }

  return (
    <div className={className}>
      <div 
        className="relative rounded-full overflow-hidden shadow-lg"
        style={{ width: config.width, height: config.height }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Character3DScene 
              character={character}
              emotion={emotion}
              animated={animated}
            />
          </Suspense>
        </Canvas>
        
        {/* Voice wave overlay */}
        {showVoiceWave && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full opacity-70"
                animate={{
                  height: [4, 12, 4],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
        
        {/* Character name tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {characters[character].name}
        </div>
      </div>
    </div>
  )
}