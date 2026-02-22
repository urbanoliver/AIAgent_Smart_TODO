using SmartTodo.Api.Data;
using SmartTodo.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace SmartTodo.Api.Services;

public interface ITodoService
{
    Task<List<TodoItem>> GetAllTodosAsync();
    Task<TodoItem?> GetTodoByIdAsync(Guid id);
    Task<TodoItem> CreateTodoAsync(TodoItem todo);
    Task<TodoItem> UpdateTodoAsync(Guid id, TodoItem updates);
    Task<bool> DeleteTodoAsync(Guid id);
}

public class TodoService : ITodoService
{
    private readonly SmartTodoDbContext _context;

    public TodoService(SmartTodoDbContext context)
    {
        _context = context;
    }

    public async Task<List<TodoItem>> GetAllTodosAsync()
    {
        return await _context.TodoItems.ToListAsync();
    }

    public async Task<TodoItem?> GetTodoByIdAsync(Guid id)
    {
        return await _context.TodoItems.FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<TodoItem> CreateTodoAsync(TodoItem todo)
    {
        // Business Rule 2: HIGH priority requires a DueDate
        if (todo.Priority == "HIGH" && todo.DueDate == null)
        {
            throw new InvalidOperationException("HIGH priority TodoItem requires a DueDate.");
        }

        todo.Id = Guid.NewGuid();
        todo.CreatedAt = DateTime.UtcNow;
        todo.Status = "OPEN"; // Default status for new items
        
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();
        
        return todo;
    }

    public async Task<TodoItem> UpdateTodoAsync(Guid id, TodoItem updates)
    {
        var existingTodo = await _context.TodoItems.FirstOrDefaultAsync(t => t.Id == id);
        if (existingTodo == null)
        {
            throw new KeyNotFoundException($"TodoItem with id {id} not found.");
        }

        // Business Rule 1: DONE status TodoItem cannot be modified
        if (existingTodo.Status == "DONE")
        {
            throw new InvalidOperationException("Cannot modify a TodoItem that is already DONE.");
        }

        // Update fields if provided
        if (!string.IsNullOrWhiteSpace(updates.Title))
        {
            existingTodo.Title = updates.Title;
        }

        if (updates.Description != null)
        {
            existingTodo.Description = updates.Description;
        }

        if (!string.IsNullOrWhiteSpace(updates.Status))
        {
            existingTodo.Status = updates.Status;
        }

        if (!string.IsNullOrWhiteSpace(updates.Priority))
        {
            // Business Rule 2: HIGH priority requires a DueDate
            if (updates.Priority == "HIGH" && existingTodo.DueDate == null && updates.DueDate == null)
            {
                throw new InvalidOperationException("HIGH priority TodoItem requires a DueDate.");
            }
            existingTodo.Priority = updates.Priority;
        }

        if (updates.DueDate.HasValue)
        {
            existingTodo.DueDate = updates.DueDate;
        }

        _context.TodoItems.Update(existingTodo);
        await _context.SaveChangesAsync();
        
        return existingTodo;
    }

    public async Task<bool> DeleteTodoAsync(Guid id)
    {
        var todo = await _context.TodoItems.FirstOrDefaultAsync(t => t.Id == id);
        if (todo == null)
        {
            return false;
        }

        _context.TodoItems.Remove(todo);
        await _context.SaveChangesAsync();
        return true;
    }
}
