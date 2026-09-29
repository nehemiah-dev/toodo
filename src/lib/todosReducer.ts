import type { Todo } from '../types.ts'

export type TodoAction = { type: 'added'; todo: Todo }

export function todosReducer(
  todos: readonly Todo[],
  action: TodoAction,
): readonly Todo[] {
  switch (action.type) {
    case 'added':
      return [action.todo, ...todos]
  }
}
