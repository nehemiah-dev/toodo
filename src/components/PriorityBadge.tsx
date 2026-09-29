import type { Priority } from '../types.ts'

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const label = {
    low: 'Low',
    medium: 'Med',
    high: 'High',
  }[priority]

  return (
    <span
      className={`priority-badge priority-badge--${priority} ${className}`.trim()}
      aria-label={`Priority: ${label}`}
    >
      {label}
    </span>
  )
}

export default PriorityBadge
