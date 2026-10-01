import type { Priority, Todo } from '../types.ts'

export type TodoAction =
  | { type: 'added'; todo: Todo }
  | { type: 'toggled'; id: string; updatedAt: string }
  | { type: 'deleted'; id: string }
  | {
      type: 'edited'
      id: string
      title: string
      description?: string
      priority: Priority
      category: string
      dueDate: string
      updatedAt: string
    }
  | { type: 'toggledAll'; updatedAt: string }
  | { type: 'clearedCompleted' }
  | { type: 'imported'; todos: readonly Todo[] }
  | { type: 'addedImported'; todos: readonly Todo[] }

export function todosReducer(
  todos: readonly Todo[],
  action: TodoAction,
): readonly Todo[] {
  switch (action.type) {
    case 'added':
      return [action.todo, ...todos]

    case 'toggled':
      return todos.map((todo) =>
        todo.id === action.id
          ? { ...todo, completed: !todo.completed, updatedAt: action.updatedAt }
          : todo,
      )

    case 'deleted':
      return todos.filter((todo) => todo.id !== action.id)

    case 'edited':
      return todos.map((todo) =>
        todo.id === action.id
          ? {
              ...todo,
              title: action.title,
              description: action.description,
              priority: action.priority,
              category: action.category,
              dueDate: action.dueDate,
              updatedAt: action.updatedAt,
            }
          : todo,
      )

    case 'toggledAll': {
      const allDone = todos.every((todo) => todo.completed)
      return todos.map((todo) => ({ ...todo, completed: !allDone, updatedAt: action.updatedAt }))
    }

    case 'clearedCompleted':
      return todos.filter((todo) => !todo.completed)

    case 'imported':
      return action.todos

    case 'addedImported':
      return [...action.todos, ...todos]
  }
}

