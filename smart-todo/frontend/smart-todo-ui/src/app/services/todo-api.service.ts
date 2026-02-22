import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoItem, CreateTodoPayload, UpdateTodoPayload } from '../models/todo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/todos'; // Adjust if backend is on different port

  /**
   * Fetch all todos
   */
  getAllTodos(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl);
  }

  /**
   * Fetch a single todo by id
   */
  getTodoById(id: string): Observable<TodoItem> {
    return this.http.get<TodoItem>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new todo
   * Backend will return the created TodoItem with id, timestamps, etc.
   */
  createTodo(payload: CreateTodoPayload): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.apiUrl, payload);
  }

  /**
   * Update an existing todo
   * Backend will validate all business rules
   */
  updateTodo(id: string, payload: UpdateTodoPayload): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.apiUrl}/${id}`, payload);
  }

  /**
   * Delete a todo
   */
  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
