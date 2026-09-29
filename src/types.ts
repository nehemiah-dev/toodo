export type Priority = 'low' | 'medium' | 'high'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  dueDate?: number
  priority: Priority
  category?: string
}

export type Filter = 'all' | 'active' | 'completed'
