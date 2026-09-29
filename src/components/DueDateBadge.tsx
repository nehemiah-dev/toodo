import { useMemo } from 'react'

interface DueDateBadgeProps {
  dueDate: number
  className?: string
}

function DueDateBadge({ dueDate, className = '' }: DueDateBadgeProps) {
  // Note: Date.now() is called inside useMemo. The result is stable per dueDate,
  // and recomputes only when dueDate changes. This is the intended behavior for
  // relative time display.
  const { status, label, fullDate } = useMemo(() => {
    const now = Date.now()
    const diffMs = dueDate - now
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    let status: 'overdue' | 'today' | 'soon' | 'future' = 'future'
    let label = ''

    if (diffDays < 0) {
      status = 'overdue'
      label = `${Math.abs(diffDays)}d overdue`
    } else if (diffDays === 0) {
      status = 'today'
      label = 'Due today'
    } else if (diffDays === 1) {
      status = 'soon'
      label = 'Due tomorrow'
    } else if (diffDays <= 7) {
      status = 'soon'
      label = `Due in ${diffDays}d`
    } else {
      status = 'future'
      const date = new Date(dueDate)
      label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }

    const fullDate = new Date(dueDate).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return { status, label, fullDate }
  }, [dueDate])

  return (
    <span
      className={`due-date-badge due-date-badge--${status} ${className}`.trim()}
      aria-label={label}
      title={fullDate}
    >
      📅 {label}
    </span>
  )
}

export default DueDateBadge
