import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TodoListComponent } from './components/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-todo-list></app-todo-list>`,
  styleUrl: './app.css'
})
export class App {}

