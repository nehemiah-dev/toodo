import type { Priority, Todo } from '../types.ts'

export interface TodoState {
  todos: readonly Todo[]
  categories: readonly string[]
}

export type TodoAction =
  | { type: 'added'; todo: Todo }
  | { type: 'toggled'; id: string; updatedAt: string }
  | { type: 'deleted'; id: string }
  | {
      type: 'edited'
      id: string
      title: string
      description?: string
      priority: Priority
      category: string
      dueDate: string
      updatedAt: string
    }
  | { type: 'toggledAll'; updatedAt: string }
  | { type: 'clearedCompleted' }
  | { type: 'categoryAdded'; category: string }
  | { type: 'imported'; todos: readonly Todo[]; categories: readonly string[] }
  | { type: 'addedImported'; todos: readonly Todo[]; categories: readonly string[] }

function includeCategories(
  categories: readonly string[],
  todos: readonly Todo[],
): readonly string[] {
  return Array.from(
    new Set([...categories, ...todos.map((todo) => todo.category)]),
  ).sort()
}

export function todosReducer(
  state: TodoState,
  action: TodoAction,
): TodoState {
  switch (action.type) {
    case 'added':
      return {
        todos: [action.todo, ...state.todos],
        categories: includeCategories(state.categories, [action.todo]),
      }

    case 'toggled':
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id !== action.id) return todo
          const completed = !todo.completed
          return {
            ...todo,
            completed,
            completedAt: completed ? action.updatedAt : undefined,
            updatedAt: action.updatedAt,
          }
        }),
      }

    case 'deleted':
      return { ...state, todos: state.todos.filter((todo) => todo.id !== action.id) }

    case 'edited':
      {
        const todos = state.todos.map((todo) =>
          todo.id === action.id
            ? {
                ...todo,
                title: action.title,
                description: action.description,
                priority: action.priority,
                category: action.category,
                dueDate: action.dueDate,
                updatedAt: action.updatedAt,
              }
            : todo,
        )
        return { todos, categories: includeCategories(state.categories, todos) }
      }

    case 'toggledAll': {
      const allDone = state.todos.every((todo) => todo.completed)
      return {
        ...state,
        todos: state.todos.map((todo) => ({
          ...todo,
          completed: !allDone,
          completedAt: allDone ? action.updatedAt : undefined,
          updatedAt: action.updatedAt,
        })),
      }
    }

    case 'clearedCompleted':
      return { ...state, todos: state.todos.filter((todo) => !todo.completed) }

    case 'categoryAdded':
      return {
        ...state,
        categories: includeCategories([...state.categories, action.category], []),
      }

    case 'imported':
      return {
        todos: action.todos,
        categories: includeCategories(action.categories, action.todos),
      }

    case 'addedImported':
      return {
        todos: [...action.todos, ...state.todos],
        categories: includeCategories(
          [...state.categories, ...action.categories],
          action.todos,
        ),
      }
  }
}

