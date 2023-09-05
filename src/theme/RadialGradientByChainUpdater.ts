import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDarkModeManager } from 'state/user/hooks'

import { colorsDark, colorsLight } from './colors'

const initialStyles = {
  width: '200vw',
  height: '200vh',
  transform: 'translate(-50vw, -100vh)',
}
const backgroundResetStyles = {
  width: '100vw',
  height: '100vh',
  transform: 'unset',
}

type TargetBackgroundStyles = typeof initialStyles | typeof backgroundResetStyles

const backgroundRadialGradientElement = document.getElementById('background-radial-gradient')
const setBackground = (newValues: TargetBackgroundStyles) =>
  Object.entries(newValues).forEach(([key, value]) => {
    if (backgroundRadialGradientElement) {
      backgroundRadialGradientElement.style[key as keyof typeof backgroundResetStyles] = value
    }
  })
export default function RadialGradientByChainUpdater(): null {
  const { chainId } = useWeb3React()
  const [darkMode] = useDarkModeManager()
  const { pathname } = useLocation()
  const isNftPage = pathname.startsWith('/nfts') || pathname.startsWith('/profile')

  // manage background color
  useEffect(() => {
    if (!backgroundRadialGradientElement) {
      return
    }

    if (isNftPage) {
      setBackground(initialStyles)
      backgroundRadialGradientElement.style.background = darkMode
        ? colorsDark.backgroundBackdrop
        : colorsLight.backgroundBackdrop
      return
    }

    setBackground(initialStyles)
    const defaultLightGradient =
      'radial-gradient(100% 100% at 50% 0%, rgba(255, 184, 226, 0.51) 0%, rgba(255, 255, 255, 0) 100%), #FFFFFF'
    const defaultDarkGradient = 'linear-gradient(180deg, #202738 0%, #070816 100%)'
    backgroundRadialGradientElement.style.background = darkMode ? defaultDarkGradient : defaultLightGradient
  }, [darkMode, chainId, isNftPage])
  return null
}
