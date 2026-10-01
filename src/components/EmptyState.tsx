const MESSAGES = {
  'no-todos': {
    title: 'Nothing here yet',
    hint: 'Add your first task above to get started.',
  },
  'no-matches': {
    title: 'No tasks match this filter',
    hint: 'Try adjusting your search or filters.',
  },
} as const

export type EmptyStateVariant = keyof typeof MESSAGES

interface EmptyStateProps {
  variant: EmptyStateVariant
}

function EmptyState({ variant }: EmptyStateProps) {
  const { title, hint } = MESSAGES[variant]

  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__hint">{hint}</p>
    </div>
  )
}

export default EmptyState
