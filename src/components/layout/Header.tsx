import { UserMenu } from '../UserMenu'
import { LanguageSwitcher } from '../LanguageSwitcher'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
