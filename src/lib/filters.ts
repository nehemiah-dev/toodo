import type { Filter, Priority, Todo } from '../types.ts'

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

export function filterTodos(
  todos: readonly Todo[],
  filter: Filter,
): readonly Todo[] {
  switch (filter) {
    case 'all':
      return todos

    case 'active':
      return todos.filter((todo) => !todo.completed)

    case 'completed':
      return todos.filter((todo) => todo.completed)
  }
}

export function searchTodos(
  todos: readonly Todo[],
  query: string,
): readonly Todo[] {
  if (query.trim() === '') {
    return todos
  }

  const lowerQuery = query.toLowerCase()
  return todos.filter(
    (todo) =>
      todo.text.toLowerCase().includes(lowerQuery) ||
      (todo.category && todo.category.toLowerCase().includes(lowerQuery)),
  )
}

export function filterByPriority(
  todos: readonly Todo[],
  priorities: Set<Priority>,
): readonly Todo[] {
  if (priorities.size === 0) {
    return todos
  }
  return todos.filter((todo) => priorities.has(todo.priority))
}

export function filterByCategory(
  todos: readonly Todo[],
  categories: Set<string>,
): readonly Todo[] {
  if (categories.size === 0) {
    return todos
  }
  return todos.filter((todo) => todo.category && categories.has(todo.category))
}

export function getUniqueCategories(todos: readonly Todo[]): readonly string[] {
  const categories = new Set<string>()
  for (const todo of todos) {
    if (todo.category) {
      categories.add(todo.category)
    }
  }
  return Array.from(categories).sort()
}
