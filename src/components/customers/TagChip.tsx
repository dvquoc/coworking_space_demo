import { X } from 'lucide-react'
import { useTags } from '../../hooks/useCustomers'

// Predefined tag colors for system tags
const TAG_COLORS: Record<string, string> = {
  vip: '#eab308',
  'long-term': '#22c55e',
  referral: '#3b82f6',
  new: '#06b6d4',
  premium: '#8b5cf6',
  'at-risk': '#ef4444',
}

// Get tag styles from color
function getTagStyles(color: string) {
  return {
    backgroundColor: color + '1A', // 10% opacity
    color: color,
  }
}

interface TagChipProps {
  tagName: string
  size?: 'sm' | 'md'
  onRemove?: () => void
  className?: string
}

export function TagChip({ tagName, size = 'md', onRemove, className = '' }: TagChipProps) {
  const { data: tags } = useTags()
  
  // Find tag info
  const tag = tags?.find(t => t.name === tagName)
  const color = tag?.color || TAG_COLORS[tagName] || '#64748b'
  const displayName = tag?.displayName || tagName.charAt(0).toUpperCase() + tagName.slice(1).replace(/-/g, ' ')
  
  const styles = getTagStyles(color)
  
  const sizeClasses = size === 'sm' 
    ? 'px-1.5 py-0.5 text-xs gap-0.5' 
    : 'px-2 py-0.5 text-xs gap-1'
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${className}`}
      style={styles}
    >
      <span 
        className={size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'}
        style={{ 
          backgroundColor: color,
          borderRadius: '50%',
        }} 
      />
      {displayName}
      {onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="p-0.5 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        </button>
      )}
    </span>
  )
}

interface TagSelectProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  className?: string
}

export function TagSelect({ selectedTags, onChange, className = '' }: TagSelectProps) {
  const { data: tags, isLoading } = useTags()
  
  const handleToggle = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onChange(selectedTags.filter(t => t !== tagName))
    } else {
      onChange([...selectedTags, tagName])
    }
  }
  
  if (isLoading) {
    return <div className="text-sm text-slate-500">Đang tải...</div>
  }
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags?.map((tag) => {
        const isSelected = selectedTags.includes(tag.name)
        const styles = getTagStyles(tag.color)
        
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleToggle(tag.name)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
              isSelected 
                ? 'ring-2 ring-offset-1' 
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              ...styles,
              ...(isSelected ? { ringColor: tag.color } : {}),
            }}
          >
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: tag.color }} 
            />
            {tag.displayName}
          </button>
        )
      })}
    </div>
  )
}
