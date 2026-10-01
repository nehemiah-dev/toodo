const MESSAGES = {
  'no-todos': {
    title: 'Nothing here yet',
    hint: 'Add your first task to get started.',
  },
  'no-active': {
    title: 'No active tasks',
    hint: 'All tasks are complete. New tasks will appear here.',
  },
  'no-completed': {
    title: 'No completed tasks',
    hint: 'Tasks you complete will appear here.',
  },
  'no-search': {
    title: 'No tasks match your search',
    hint: 'Try another title, description, or category.',
  },
  'no-category': {
    title: 'No tasks in this category',
    hint: 'Tasks assigned to this category will appear here.',
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
