/**
 * TodoItem DTO - represents a todo item from the backend API
 * These fields should NOT be computed or modified in the frontend
 */
export interface TodoItem {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string | null; // ISO date string
  isOverdue: boolean; // Backend-computed flag, display only
  createdAt: string; // ISO date string
}

/**
 * Create todo payload - for POST /todos
 */
export interface CreateTodoPayload {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string | null;
}

/**
 * Update todo payload - for PUT /todos/{id}
 */
export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string | null;
}
