'use client'

import { useState, useEffect } from 'react'

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

type Breakpoint = keyof typeof breakpoints

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  })

  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs')

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setWindowSize({ width, height })

      // Determine current breakpoint
      let breakpoint: Breakpoint = 'xs'
      for (const [key, value] of Object.entries(breakpoints)) {
        if (width >= value) {
          breakpoint = key as Breakpoint
        }
      }
      setCurrentBreakpoint(breakpoint)
    }

    // Call handler right away so state gets updated with initial window size
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowSize.width < breakpoints.sm
  const isTablet = windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.lg
  const isDesktop = windowSize.width >= breakpoints.lg
  const isLargeDesktop = windowSize.width >= breakpoints.xl

  const isAtLeast = (breakpoint: Breakpoint) => {
    return windowSize.width >= breakpoints[breakpoint]
  }

  const isAtMost = (breakpoint: Breakpoint) => {
    return windowSize.width <= breakpoints[breakpoint]
  }

  const isBetween = (min: Breakpoint, max: Breakpoint) => {
    return windowSize.width >= breakpoints[min] && windowSize.width <= breakpoints[max]
  }

  return {
    windowSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isAtLeast,
    isAtMost,
    isBetween,
    breakpoints
  }
}

// Hook for media queries
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    
    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [matches, query])

  return matches
}

// Hook for detecting touch devices
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    )
  }, [])

  return isTouchDevice
}

// Hook for detecting device orientation
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    function handleOrientationChange() {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      )
    }

    handleOrientationChange()

    window.addEventListener('resize', handleOrientationChange)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleOrientationChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return orientation
}