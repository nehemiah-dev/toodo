import { useEffect, useState } from 'react'

interface DueDateBadgeProps {
  dueDate: string
  completed: boolean
  className?: string
}

function DueDateBadge({ dueDate, completed, className = '' }: DueDateBadgeProps) {
  const [today, setToday] = useState('')

  useEffect(() => {
    function updateToday() {
      const now = new Date()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      setToday(`${now.getFullYear()}-${month}-${day}`)
    }

    updateToday()
    const interval = window.setInterval(updateToday, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const due = new Date(`${dueDate}T00:00:00`)
  const diffDays = today
    ? Math.round((Date.parse(`${dueDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000)
    : 8

  let status: 'overdue' | 'today' | 'soon' | 'future' = 'future'
  let label = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  if (!completed && diffDays < 0) {
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
  }

  const fullDate = due.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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
