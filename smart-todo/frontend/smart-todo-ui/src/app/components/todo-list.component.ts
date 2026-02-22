import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoApiService } from '../services/todo-api.service';
import { TodoItem } from '../models/todo.model';
import { TodoFormComponent } from './todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="todo-container">
      <div class="header">
        <h1>My Todos</h1>
        <button class="btn-primary" (click)="showCreateForm()" [disabled]="isCreating()">
          + New Todo
        </button>
      </div>

      @if (isCreating()) {
        <app-todo-form
          [todo]="null"
          (formSubmitted)="onTodoCreated($event)"
          (formCancelled)="hideCreateForm()"
        />
      }

      @if (isLoading()) {
        <div class="loading">Loading todos...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (todos().length === 0) {
        <div class="empty-state">
          <p>No todos yet. Create one to get started!</p>
        </div>
      } @else {
        <div class="todos-list">
          @for (todo of todos(); track todo.id) {
            <div class="todo-item" [class.overdue]="todo.isOverdue">
              @if (editingId() === todo.id) {
                <app-todo-form
                  [todo]="todo"
                  (formSubmitted)="onTodoUpdated($event)"
                  (formCancelled)="stopEditing()"
                />
              } @else {
                <div class="todo-display">
                  <div class="todo-header">
                    <h3 class="todo-title">{{ todo.title }}</h3>
                    <span class="status-badge" [class]="'status-' + todo.status.toLowerCase()">
                      {{ formatStatus(todo.status) }}
                    </span>
                    @if (todo.isOverdue) {
                      <span class="overdue-badge">Overdue</span>
                    }
                  </div>

                  @if (todo.description) {
                    <p class="todo-description">{{ todo.description }}</p>
                  }

                  <div class="todo-meta">
                    <span class="priority-badge" [class]="'priority-' + todo.priority.toLowerCase()">
                      {{ todo.priority }}
                    </span>
                    @if (todo.dueDate) {
                      <span class="due-date">Due: {{ formatDate(todo.dueDate) }}</span>
                    }
                  </div>

                  <div class="todo-actions">
                    <button class="btn-edit" (click)="startEditing(todo.id)">
                      Edit
                    </button>
                    <button class="btn-delete" (click)="deleteTodo(todo.id)" [disabled]="isDeleting() === todo.id">
                      {{ isDeleting() === todo.id ? 'Deleting...' : 'Delete' }}
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .todo-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      gap: 16px;
    }

    h1 {
      margin: 0;
      color: #333;
      flex: 1;
    }

    .btn-primary {
      padding: 10px 16px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1565c0;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading,
    .error,
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .loading {
      font-size: 16px;
    }

    .error {
      background: #ffebee;
      color: #d32f2f;
      padding: 16px;
      border-radius: 4px;
      border-left: 4px solid #d32f2f;
    }

    .empty-state {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 50px 20px;
    }

    .empty-state p {
      margin: 0;
      font-size: 16px;
    }

    .todos-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .todo-item {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background: white;
      transition: box-shadow 0.2s, border-color 0.2s;
    }

    .todo-item:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-color: #bbb;
    }

    .todo-item.overdue {
      border-left: 4px solid #ff9800;
      background: #fff8f5;
    }

    .todo-display {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .todo-header {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .todo-title {
      margin: 0;
      font-size: 18px;
      color: #333;
      flex: 1;
      min-width: 200px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }

    .status-open {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-in_progress {
      background: #fff3e0;
      color: #ff9800;
    }

    .status-done {
      background: #e8f5e9;
      color: #388e3c;
    }

    .overdue-badge {
      background: #ffebee;
      color: #d32f2f;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .todo-description {
      margin: 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }

    .todo-meta {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .priority-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .priority-low {
      background: #f0f4c3;
      color: #558b2f;
    }

    .priority-medium {
      background: #fff9c4;
      color: #f57f17;
    }

    .priority-high {
      background: #ffebee;
      color: #c62828;
    }

    .due-date {
      color: #666;
      font-size: 13px;
    }

    .todo-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .btn-edit,
    .btn-delete {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-edit {
      background: #e3f2fd;
      color: #1976d2;
    }

    .btn-edit:hover {
      background: #bbdefb;
    }

    .btn-delete {
      background: #ffebee;
      color: #d32f2f;
    }

    .btn-delete:hover:not(:disabled) {
      background: #ffcdd2;
    }

    .btn-delete:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
})
export class TodoListComponent implements OnInit {
  private readonly todoApi = inject(TodoApiService);

  // State signals
  todos = signal<TodoItem[]>([]);
  isLoading = signal(true);
  error = signal('');
  isCreating = signal(false);
  editingId = signal<string | null>(null);
  isDeleting = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.todoApi.getAllTodos().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load todos');
        this.isLoading.set(false);
      },
    });
  }

  showCreateForm(): void {
    this.isCreating.set(true);
  }

  hideCreateForm(): void {
    this.isCreating.set(false);
  }

  onTodoCreated(newTodo: TodoItem): void {
    this.todos.update((t) => [newTodo, ...t]);
    this.hideCreateForm();
  }

  startEditing(id: string): void {
    this.editingId.set(id);
  }

  stopEditing(): void {
    this.editingId.set(null);
  }

  onTodoUpdated(updatedTodo: TodoItem): void {
    this.todos.update((todos) =>
      todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
    );
    this.stopEditing();
  }

  deleteTodo(id: string): void {
    this.isDeleting.set(id);

    this.todoApi.deleteTodo(id).subscribe({
      next: () => {
        this.todos.update((todos) => todos.filter((t) => t.id !== id));
        this.isDeleting.set(null);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to delete todo');
        this.isDeleting.set(null);
      },
    });
  }

  formatStatus(status: string): string {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }
}
