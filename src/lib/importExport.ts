import type { Task } from '../types.ts'
import { isValidTask } from './taskValidation.ts'

export interface TaskBackup {
  version: 1
  exportedAt: string
  tasks: readonly Task[]
  categories: readonly string[]
}

export type ImportMode = 'add' | 'replace'

export function createBackup(
  tasks: readonly Task[],
  categories: readonly string[],
): TaskBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks,
    categories: Array.from(
      new Set([...categories, ...tasks.map((task) => task.category)]),
    ).sort(),
  }
}

export function parseBackup(value: unknown): TaskBackup {
  if (typeof value !== 'object' || value === null) {
    throw new Error('The file must contain a JSON object.')
  }

  if (!('version' in value) || value.version !== 1) {
    throw new Error('This backup version is not supported.')
  }

  if (
    !('exportedAt' in value) ||
    typeof value.exportedAt !== 'string' ||
    Number.isNaN(Date.parse(value.exportedAt))
  ) {
    throw new Error('The backup timestamp is invalid.')
  }

  if (!('tasks' in value) || !Array.isArray(value.tasks) || !value.tasks.every(isValidTask)) {
    throw new Error('The backup contains invalid tasks.')
  }

  if (
    !('categories' in value) ||
    !Array.isArray(value.categories) ||
    !value.categories.every(
      (category: unknown) => typeof category === 'string' && category.trim() !== '',
    )
  ) {
    throw new Error('The backup contains invalid categories.')
  }

  const taskIds = new Set<string>()
  for (const task of value.tasks) {
    if (taskIds.has(task.id)) {
      throw new Error('The backup contains duplicate task IDs.')
    }
    taskIds.add(task.id)
  }

  const categorySet = new Set(value.categories)
  if (value.tasks.some((task) => !categorySet.has(task.category))) {
    throw new Error('A task uses a category missing from the backup.')
  }

  return {
    version: 1,
    exportedAt: value.exportedAt,
    tasks: value.tasks,
    categories: Array.from(new Set(value.categories)),
  }
}

export async function readBackupFile(file: File): Promise<TaskBackup> {
  let parsed: unknown
  try {
    parsed = JSON.parse(await file.text()) as unknown
  } catch {
    throw new Error('The selected file is not valid JSON.')
  }

  return parseBackup(parsed)
}