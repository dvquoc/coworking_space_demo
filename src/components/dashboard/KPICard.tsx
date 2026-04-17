import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  change?: number
  changeLabel?: string
  badge?: {
    text: string
    color: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
  }
  onClick?: () => void
  tooltip?: string
}

const BADGE_COLORS = {
  green: 'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100 text-amber-700',
  red: 'bg-rose-100 text-rose-700',
  blue: 'bg-blue-100 text-blue-700',
  gray: 'bg-slate-100 text-slate-600',
}

export function KPICard({
  title,
  value,
  icon: Icon,
  iconBgColor = 'bg-slate-100',
  iconColor = 'text-slate-600',
  change,
  changeLabel = 'vs tháng trước',
  badge,
  onClick,
  tooltip,
}: KPICardProps) {
  const isPositiveChange = change !== undefined && change >= 0
  
  return (
    <div 
      className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-200 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
      title={tooltip}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-slate-900">
              {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
            </p>
            {badge && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${BADGE_COLORS[badge.color]}`}>
                {badge.text}
              </span>
            )}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositiveChange ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-500" />
              )}
              <span className={`text-sm font-medium ${isPositiveChange ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPositiveChange ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-slate-400">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

// Progress Bar KPI Card variant (for Sales target)
interface KPICardWithProgressProps extends Omit<KPICardProps, 'change' | 'badge'> {
  current: number
  target: number
  unit?: string
}

export function KPICardWithProgress({
  title,
  value,
  icon: Icon,
  iconBgColor = 'bg-slate-100',
  iconColor = 'text-slate-600',
  current,
  target,
  unit = '',
  onClick,
  tooltip,
}: KPICardWithProgressProps) {
  const percent = target > 0 ? Math.round((current / target) * 100) : 0
  
  const getProgressColor = () => {
    if (percent >= 100) return 'bg-emerald-500'
    if (percent >= 60) return 'bg-blue-500'
    if (percent >= 40) return 'bg-amber-500'
    return 'bg-rose-500'
  }
  
  return (
    <div 
      className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-200 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
      title={tooltip}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-slate-900">
            {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{current} / {target} {unit}</span>
          <span className={`font-medium ${percent >= 100 ? 'text-emerald-600' : 'text-slate-700'}`}>
            {percent}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
