import type { Filter, Todo } from '../types.ts'

export interface FilterOption {
  readonly value: Filter
  readonly label: string
}

export const FILTERS: readonly FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export function countActive(todos: readonly Todo[]): number {
  return todos.reduce((count, todo) => (todo.completed ? count : count + 1), 0)
}

export function areAllCompleted(todos: readonly Todo[]): boolean {
  return todos.length > 0 && todos.every((todo) => todo.completed)
}
