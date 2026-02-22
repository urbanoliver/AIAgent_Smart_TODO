import { Component, input, output, effect, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoItem, CreateTodoPayload, UpdateTodoPayload } from '../models/todo.model';
import { TodoApiService } from '../services/todo-api.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-container">
      <h2>{{ isEditMode ? 'Edit Todo' : 'Create New Todo' }}</h2>

      @if (errorMessage()) {
        <div class="error-message">{{ errorMessage() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            type="text"
            formControlName="title"
            placeholder="Enter todo title"
            [disabled]="isSubmitting()"
          />
          @if (form.get('title')?.invalid && form.get('title')?.touched) {
            <span class="error">Title is required</span>
          }
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="Enter todo description"
            rows="4"
            [disabled]="isSubmitting()"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="priority">Priority</label>
          <select
            id="priority"
            formControlName="priority"
            [disabled]="isSubmitting()"
          >
            <option value="">Select priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            formControlName="dueDate"
            [disabled]="isSubmitting()"
          />
        </div>

        @if (isEditMode) {
          <div class="form-group">
            <label for="status">Status</label>
            <select
              id="status"
              formControlName="status"
              [disabled]="isSubmitting()"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        }

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid || isSubmitting()">
            {{ isSubmitting() ? 'Submitting...' : isEditMode ? 'Update Todo' : 'Create Todo' }}
          </button>
          <button type="button" (click)="onCancel()" [disabled]="isSubmitting()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    .form-container {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: #f9f9f9;
    }

    h2 {
      margin-top: 0;
      color: #333;
    }

    .error-message {
      color: #d32f2f;
      background: #ffebee;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      border-left: 4px solid #d32f2f;
    }

    .form-group {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 600;
      margin-bottom: 6px;
      color: #555;
    }

    input,
    textarea,
    select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
    }

    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    input:disabled,
    textarea:disabled,
    select:disabled {
      background: #f0f0f0;
      cursor: not-allowed;
    }

    .error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button[type="submit"] {
      background: #1976d2;
      color: white;
    }

    button[type="submit"]:hover:not(:disabled) {
      background: #1565c0;
    }

    button[type="button"] {
      background: #e0e0e0;
      color: #333;
    }

    button[type="button"]:hover:not(:disabled) {
      background: #d0d0d0;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
})
export class TodoFormComponent {
  private readonly fb = new FormBuilder();
  private readonly todoApi = inject(TodoApiService);

  // Inputs
  todo = input<TodoItem | null>(null);
  isEditMode = this.todo() !== null;

  // Outputs
  formSubmitted = output<TodoItem>();
  formCancelled = output<void>();

  // State
  form: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal('');

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['MEDIUM'],
      dueDate: [''],
    });

    // Load edit data if in edit mode
    effect(() => {
      const todo = this.todo();
      if (todo) {
        this.form.addControl('status', this.fb.control(todo.status));
        this.form.patchValue({
          title: todo.title,
          description: todo.description,
          priority: todo.priority,
          status: todo.status,
          dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formValue = this.form.value;
    const payload = {
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      dueDate: formValue.dueDate || null,
      ...(this.isEditMode ? { status: formValue.status } : {}),
    };

    const request = this.isEditMode
      ? this.todoApi.updateTodo(this.todo()!.id, payload as UpdateTodoPayload)
      : this.todoApi.createTodo(payload as CreateTodoPayload);

    // Note: In a real app, we'd use async pipe or proper subscription management
    // For now, using direct subscription with proper cleanup
    request.subscribe({
      next: (todo) => {
        this.formSubmitted.emit(todo);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.error?.message || 'An error occurred');
      },
    });
  }

  onCancel(): void {
    this.form.reset();
    this.errorMessage.set('');
    this.formCancelled.emit();
  }
}
