import type { Todo } from '../types.ts'

export type TodoAction =
  | { type: 'added'; todo: Todo }
  | { type: 'toggled'; id: string }
  | { type: 'deleted'; id: string }

export function todosReducer(
  todos: readonly Todo[],
  action: TodoAction,
): readonly Todo[] {
  switch (action.type) {
    case 'added':
      return [action.todo, ...todos]

    case 'toggled':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      )

    case 'deleted':
      return todos.filter((todo) => todo.id !== action.id)
  }
}

