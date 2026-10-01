export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  category: string
  dueDate: string
  priority: Priority
  completed: boolean
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export type Todo = Task

export type Filter = 'all' | 'active' | 'completed'

export type SortBy = 'dueDate' | 'priority' | 'createdAt' | 'title'
