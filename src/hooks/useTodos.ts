import { useCallback, useEffect, useReducer } from 'react'
import { createId } from '../lib/id.ts'
import { readTodos, writeTodos } from '../lib/storage.ts'
import { todosReducer } from '../lib/todosReducer.ts'
import type { Priority, Todo } from '../types.ts'

export interface UseTodosResult {
  todos: readonly Todo[]
  addTodo: (text: string, priority: Priority, category?: string, dueDate?: number) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, text: string, priority: Priority, category?: string, dueDate?: number) => void
  toggleAll: () => void
  clearCompleted: () => void
  exportTodos: () => void
  importTodos: (file: File) => Promise<void>
}

export function useTodos(): UseTodosResult {
  const [todos, dispatch] = useReducer(todosReducer, undefined, readTodos)

  useEffect(() => {
    writeTodos(todos)
  }, [todos])

  // Trimming lives here so blank tasks can never reach the list, whichever
  // caller dispatches them.
  const addTodo = useCallback((text: string, priority: Priority, category?: string, dueDate?: number) => {
    const trimmed = text.trim()
    if (trimmed === '') {
      return
    }

    dispatch({
      type: 'added',
      todo: {
        id: createId(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
        priority,
        category,
        dueDate,
      },
    })
  }, [])

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'toggled', id })
  }, [])

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'deleted', id })
  }, [])

  const editTodo = useCallback((id: string, text: string, priority: Priority, category?: string, dueDate?: number) => {
    const trimmed = text.trim()
    if (trimmed === '') {
      return
    }
    dispatch({ type: 'edited', id, text: trimmed, priority, category, dueDate })
  }, [])

  const toggleAll = useCallback(() => {
    dispatch({ type: 'toggledAll' })
  }, [])

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'clearedCompleted' })
  }, [])

  const exportTodos = useCallback(() => {
    const data = JSON.stringify(todos, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `toodo-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [todos])

  const importTodos = useCallback(async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      
      if (!Array.isArray(parsed)) {
        alert('Invalid file format: expected an array of todos')
        return
      }

      // Replace all todos with imported ones
      dispatch({ type: 'imported', todos: parsed })
    } catch (error) {
      alert('Failed to import todos: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }, [])

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleAll, clearCompleted, exportTodos, importTodos }
}


