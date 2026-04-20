import { Outlet } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { useState, useEffect, useCallback } from 'react'

const HEADLINE_KEYS = ['layout_headline', 'layout_headline_2', 'layout_headline_3'] as const
const ROTATE_INTERVAL = 4000

export default function AuthLayout() {
  const { t } = useTranslation('auth')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const rotateHeadline = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % HEADLINE_KEYS.length)
      setIsVisible(true)
    }, 500)
  }, [])

  useEffect(() => {
    const timer = setInterval(rotateHeadline, ROTATE_INTERVAL)
    return () => clearInterval(timer)
  }, [rotateHeadline])

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#b11e29] p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-white">
            <Building2 className="w-10 h-10" />
            <span className="text-2xl font-bold">COBI TOWER</span> 
          </div>
        </div>

        <div className="text-white">
          <h1
            className={`text-4xl font-bold mb-4 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            {t(HEADLINE_KEYS[activeIndex])}
          </h1>
          <p className="text-lg text-white/90">
            {t('layout_subheadline')}
          </p>
        </div>

        <div className="text-white/70 text-sm">
          {t('layout_copyright')}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col bg-slate-100">
        <div className="flex justify-end p-4">
          <LanguageSwitcher />
        </div>
        <div className="flex-1 flex items-center justify-center px-8 pb-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
