import { useCallback, useReducer } from 'react'
import { createId } from '../lib/id.ts'
import { todosReducer } from '../lib/todosReducer.ts'
import type { Todo } from '../types.ts'

export interface UseTodosResult {
  todos: readonly Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
}

export function useTodos(initialTodos: readonly Todo[] = []): UseTodosResult {
  const [todos, dispatch] = useReducer(todosReducer, initialTodos)

  // Trimming lives here so blank tasks can never reach the list, whichever
  // caller dispatches them.
  const addTodo = useCallback((text: string) => {
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
      },
    })
  }, [])

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'toggled', id })
  }, [])

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'deleted', id })
  }, [])

  return { todos, addTodo, toggleTodo, deleteTodo }
}

