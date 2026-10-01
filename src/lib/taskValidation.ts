import type { Task } from '../types.ts'

function isDateOnly(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function isValidTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (
    !('id' in value) ||
    !('title' in value) ||
    !('category' in value) ||
    !('dueDate' in value) ||
    !('completed' in value) ||
    !('createdAt' in value) ||
    !('updatedAt' in value) ||
    !('priority' in value)
  ) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    value.id.trim() !== '' &&
    typeof value.title === 'string' &&
    value.title.trim() !== '' &&
    typeof value.category === 'string' &&
    value.category.trim() !== '' &&
    isDateOnly(value.dueDate) &&
    typeof value.completed === 'boolean' &&
    (value.priority === 'low' || value.priority === 'medium' || value.priority === 'high') &&
    typeof value.createdAt === 'string' &&
    !Number.isNaN(Date.parse(value.createdAt)) &&
    typeof value.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(value.updatedAt)) &&
    (!('description' in value) || typeof value.description === 'string')
  )
}