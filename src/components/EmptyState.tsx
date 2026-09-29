const MESSAGES = {
  'no-todos': {
    title: 'Nothing here yet',
    hint: 'Add your first task above to get started.',
  },
  'no-matches': {
    title: 'No tasks match this filter',
    hint: 'Try a different filter to see your tasks.',
  },
} as const

export type EmptyStateVariant = keyof typeof MESSAGES

interface EmptyStateProps {
  variant: EmptyStateVariant
}

function EmptyState({ variant }: EmptyStateProps) {
  const { title, hint } = MESSAGES[variant]

  return (
    <p className="empty-state">
      <strong className="empty-state__title">{title}</strong>
      <span className="empty-state__hint">{hint}</span>
    </p>
  )
}

export default EmptyState
