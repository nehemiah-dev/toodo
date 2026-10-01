import { useEffect, useRef } from 'react'
import type { Priority } from '../types.ts'
import AddTodoForm from './AddTodoForm.tsx'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (
    title: string,
    description: string,
    category: string,
    dueDate: string,
    priority: Priority,
  ) => void
}

function TaskModal({ isOpen, onClose, onAdd }: TaskModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Sync open/close with the native dialog element
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
      // Small delay so the dialog is painted before we move focus
      window.setTimeout(() => titleInputRef.current?.focus(), 0)
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  // Sync the React state when the dialog is closed natively (e.g. Escape key)
  function handleDialogClose() {
    onClose()
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    // The dialog element fills the viewport; a click outside the inner panel
    // hits the <dialog> itself rather than its children.
    if (event.target === dialogRef.current) {
      onClose()
    }
  }

  function handleAdd(
    title: string,
    description: string,
    category: string,
    dueDate: string,
    priority: Priority,
  ) {
    onAdd(title, description, category, dueDate, priority)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="task-modal"
      aria-labelledby="task-modal-title"
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
    >
      <div className="task-modal__panel">
        <div className="task-modal__header">
          <h2 id="task-modal-title" className="task-modal__title">
            New task
          </h2>
          <button
            type="button"
            className="task-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <AddTodoForm onAdd={handleAdd} titleInputRef={titleInputRef} />
      </div>
    </dialog>
  )
}

export default TaskModal
