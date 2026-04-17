import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages, Check } from 'lucide-react'

const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation('common')
  const [open, setOpen] = useState(false)

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0]

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="px-3 py-2 rounded-xl hover:bg-slate-100 transition text-sm font-medium text-slate-700"
        title={i18n.t('language_switcher')}
      >
        <div className="flex items-center gap-1">
            <Languages className="w-4 h-4 text-slate-500" />
            <strong>{i18n.t('language_switcher')}</strong>
        </div>
        <div className="flex items-center gap-1">
            <span className="hidden sm:inline">{current.flag} {current.label}</span>
            <span className="sm:hidden">{current.flag}</span>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center justify-between gap-2 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span className={lang.code === i18n.language ? 'font-semibold text-[#b11e29]' : 'text-slate-700'}>
                    {lang.label}
                  </span>
                </span>
                {lang.code === i18n.language && (
                  <Check className="w-3.5 h-3.5 text-[#b11e29] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
