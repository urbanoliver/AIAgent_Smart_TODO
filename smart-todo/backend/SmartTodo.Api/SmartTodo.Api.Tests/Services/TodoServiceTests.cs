using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartTodo.Api.Data;
using SmartTodo.Api.Models;
using SmartTodo.Api.Services;
using Xunit;

namespace SmartTodo.Api.Tests.Services
{
    public class TodoServiceTests
    {
        private SmartTodoDbContext CreateContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<SmartTodoDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;

            return new SmartTodoDbContext(options);
        }

        [Fact]
        public async Task UpdateTodoAsync_WhenTodoIsDone_ThrowsInvalidOperationException()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);

            var todo = new TodoItem
            {
                Id = Guid.NewGuid(),
                Title = "existing",
                Status = "DONE",
                Priority = "LOW",
                CreatedAt = DateTime.UtcNow
            };

            context.TodoItems.Add(todo);
            await context.SaveChangesAsync();

            var svc = new TodoService(context);

            var ex = await Assert.ThrowsAsync<InvalidOperationException>(async () =>
                await svc.UpdateTodoAsync(todo.Id, new TodoItem { Title = "changed", Status = "OPEN", Priority = "LOW" }));

            Assert.Contains("Cannot modify a TodoItem that is already DONE", ex.Message);
        }

        [Fact]
        public async Task CreateTodoAsync_WhenHighPriorityWithoutDueDate_ThrowsInvalidOperationException()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);

            var svc = new TodoService(context);

            var todo = new TodoItem
            {
                Title = "high",
                Priority = "HIGH",
                Status = "OPEN"
            };

            var ex = await Assert.ThrowsAsync<InvalidOperationException>(async () =>
                await svc.CreateTodoAsync(todo));

            Assert.Contains("HIGH priority TodoItem requires a DueDate", ex.Message);
        }

        [Fact]
        public async Task UpdateTodoAsync_SetPriorityToHighWithoutDueDate_ThrowsInvalidOperationException()
        {
            var dbName = Guid.NewGuid().ToString();
            using var context = CreateContext(dbName);

            var existing = new TodoItem
            {
                Id = Guid.NewGuid(),
                Title = "existing",
                Status = "OPEN",
                Priority = "LOW",
                CreatedAt = DateTime.UtcNow
            };

            context.TodoItems.Add(existing);
            await context.SaveChangesAsync();

            var svc = new TodoService(context);

            var updates = new TodoItem { Title = existing.Title, Status = "OPEN", Priority = "HIGH" };

            var ex = await Assert.ThrowsAsync<InvalidOperationException>(async () =>
                await svc.UpdateTodoAsync(existing.Id, updates));

            Assert.Contains("HIGH priority TodoItem requires a DueDate", ex.Message);
        }
    }
}
