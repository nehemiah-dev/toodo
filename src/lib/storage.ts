import type { Todo } from '../types.ts'
import { isValidTask } from './taskValidation.ts'

export const STORAGE_KEY = 'toodo.todos.v1'
const STORAGE_VERSION = 1

export interface TodoData {
  todos: readonly Todo[]
  categories: readonly string[]
}

interface StoredPayload {
  version: number
  todos: Todo[]
  categories?: string[]
}

function getStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    // Accessing localStorage throws when storage is blocked by the browser.
    return null
  }
}

/**
 * Reads the stored tasks. Anything unusable (unreadable storage, bad JSON,
 * unknown version, malformed entries) is discarded so a corrupted value can
 * never break the app.
 */
export function readTodoData(
  storage: Storage | null = getStorage(),
): TodoData {
  if (storage === null) {
    return { todos: [], categories: [] }
  }

  let raw: string | null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return { todos: [], categories: [] }
  }

  if (raw === null) {
    return { todos: [], categories: [] }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { todos: [], categories: [] }
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('version' in parsed) ||
    !('todos' in parsed)
  ) {
    return { todos: [], categories: [] }
  }

  if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.todos)) {
    return { todos: [], categories: [] }
  }

  const entries: readonly unknown[] = parsed.todos
  const todos = entries.filter(isValidTask)
  const storedCategories =
    'categories' in parsed && Array.isArray(parsed.categories)
      ? parsed.categories.filter(
          (category): category is string =>
            typeof category === 'string' && category.trim() !== '',
        )
      : []
  const categories = new Set([
    ...storedCategories,
    ...todos.map((todo) => todo.category),
  ])

  return { todos, categories: Array.from(categories).sort() }
}

export function writeTodoData(
  data: TodoData,
  storage: Storage | null = getStorage(),
): void {
  if (storage === null) {
    return
  }

  const payload: StoredPayload = {
    version: STORAGE_VERSION,
    todos: [...data.todos],
    categories: [...new Set(data.categories)].sort(),
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Write failures (full quota, private mode) leave the app working in memory.
  }
}
