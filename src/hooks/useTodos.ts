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

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleAll, clearCompleted }
}


