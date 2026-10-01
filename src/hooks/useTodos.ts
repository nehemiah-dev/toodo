import { useCallback, useEffect, useReducer } from 'react'
import { createId } from '../lib/id.ts'
import { createBackup, readBackupFile, type ImportMode, type TaskBackup } from '../lib/importExport.ts'
import { readTodos, writeTodos } from '../lib/storage.ts'
import { todosReducer } from '../lib/todosReducer.ts'
import type { Priority, Todo } from '../types.ts'

export interface UseTodosResult {
  todos: readonly Todo[]
  addTodo: (title: string, description: string, category: string, dueDate: string, priority: Priority) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, title: string, description: string, category: string, dueDate: string, priority: Priority) => void
  toggleAll: () => void
  clearCompleted: () => void
  exportTodos: () => void
  readImportFile: (file: File) => Promise<TaskBackup>
  importTodos: (backup: TaskBackup, mode: ImportMode) => void
}

export function useTodos(): UseTodosResult {
  const [todos, dispatch] = useReducer(todosReducer, undefined, readTodos)

  useEffect(() => {
    writeTodos(todos)
  }, [todos])

  // Trimming lives here so blank tasks can never reach the list, whichever
  // caller dispatches them.
  const addTodo = useCallback((title: string, description: string, category: string, dueDate: string, priority: Priority) => {
    const trimmedTitle = title.trim()
    const trimmedCategory = category.trim()
    if (trimmedTitle === '' || trimmedCategory === '' || dueDate === '') {
      return
    }

    const now = new Date().toISOString()
    dispatch({
      type: 'added',
      todo: {
        id: createId(),
        title: trimmedTitle,
        description: description.trim() || undefined,
        category: trimmedCategory,
        dueDate,
        completed: false,
        createdAt: now,
        updatedAt: now,
        priority,
      },
    })
  }, [])

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'toggled', id, updatedAt: new Date().toISOString() })
  }, [])

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'deleted', id })
  }, [])

  const editTodo = useCallback((id: string, title: string, description: string, category: string, dueDate: string, priority: Priority) => {
    const trimmedTitle = title.trim()
    const trimmedCategory = category.trim()
    if (trimmedTitle === '' || trimmedCategory === '' || dueDate === '') {
      return
    }
    dispatch({
      type: 'edited',
      id,
      title: trimmedTitle,
      description: description.trim() || undefined,
      priority,
      category: trimmedCategory,
      dueDate,
      updatedAt: new Date().toISOString(),
    })
  }, [])

  const toggleAll = useCallback(() => {
    dispatch({ type: 'toggledAll', updatedAt: new Date().toISOString() })
  }, [])

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'clearedCompleted' })
  }, [])

  const exportTodos = useCallback(() => {
    const data = JSON.stringify(createBackup(todos), null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `toodo-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [todos])

  const readImportFile = (file: File) => readBackupFile(file)

  const importTodos = useCallback((backup: TaskBackup, mode: ImportMode) => {
    const existingIds = new Set(todos.map((todo) => todo.id))
    const importedTodos = backup.tasks.map((todo) => {
      if (mode === 'add' && existingIds.has(todo.id)) {
        return { ...todo, id: createId() }
      }
      return todo
    })

    dispatch(
      mode === 'replace'
        ? { type: 'imported', todos: importedTodos }
        : { type: 'addedImported', todos: importedTodos },
    )
  }, [todos])

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleAll, clearCompleted, exportTodos, readImportFile, importTodos }
}


