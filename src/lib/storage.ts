import type { Todo } from '../types.ts'

export const STORAGE_KEY = 'toodo.todos.v1'
const STORAGE_VERSION = 1

interface StoredPayload {
  version: number
  todos: Todo[]
}

function getStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    // Accessing localStorage throws when storage is blocked by the browser.
    return null
  }
}

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (
    !('id' in value) ||
    !('text' in value) ||
    !('completed' in value) ||
    !('createdAt' in value)
  ) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.text === 'string' &&
    value.text.trim() !== '' &&
    typeof value.completed === 'boolean' &&
    typeof value.createdAt === 'number'
  )
}

/**
 * Reads the stored tasks. Anything unusable (unreadable storage, bad JSON,
 * unknown version, malformed entries) is discarded so a corrupted value can
 * never break the app.
 */
export function readTodos(
  storage: Storage | null = getStorage(),
): readonly Todo[] {
  if (storage === null) {
    return []
  }

  let raw: string | null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return []
  }

  if (raw === null) {
    return []
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('version' in parsed) ||
    !('todos' in parsed)
  ) {
    return []
  }

  if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.todos)) {
    return []
  }

  const entries: readonly unknown[] = parsed.todos
  return entries.filter(isTodo)
}

export function writeTodos(
  todos: readonly Todo[],
  storage: Storage | null = getStorage(),
): void {
  if (storage === null) {
    return
  }

  const payload: StoredPayload = { version: STORAGE_VERSION, todos: [...todos] }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Write failures (full quota, private mode) leave the app working in memory.
  }
}
