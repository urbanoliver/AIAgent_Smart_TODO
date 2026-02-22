using Microsoft.AspNetCore.Mvc;
using SmartTodo.Api.Models;
using SmartTodo.Api.Services;

namespace SmartTodo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly ILogger<TodosController> _logger;

    public TodosController(ITodoService todoService, ILogger<TodosController> logger)
    {
        _todoService = todoService;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/todos - Return all TodoItems
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<TodoItem>>> GetAllTodos()
    {
        var todos = await _todoService.GetAllTodosAsync();
        return Ok(todos);
    }

    /// <summary>
    /// GET /api/todos/{id} - Return a specific TodoItem by id
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodoById(Guid id)
    {
        var todo = await _todoService.GetTodoByIdAsync(id);
        if (todo == null)
        {
            return NotFound($"TodoItem with id {id} not found.");
        }
        return Ok(todo);
    }

    /// <summary>
    /// POST /api/todos - Create a new TodoItem
    /// Enforces Business Rule 2: HIGH priority requires a DueDate
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodo([FromBody] CreateTodoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest("Title is required.");
        }

        var newTodo = new TodoItem
        {
            Title = request.Title,
            Description = request.Description,
            Status = request.Status ?? "OPEN",
            Priority = request.Priority ?? "LOW",
            DueDate = request.DueDate
        };

        try
        {
            var createdTodo = await _todoService.CreateTodoAsync(newTodo);
            return CreatedAtAction(nameof(GetTodoById), new { id = createdTodo.Id }, createdTodo);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// PUT /api/todos/{id} - Update an existing TodoItem
    /// Enforces Business Rule 1: DONE status TodoItem cannot be modified
    /// Enforces Business Rule 2: HIGH priority requires a DueDate
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TodoItem>> UpdateTodo(Guid id, [FromBody] UpdateTodoRequest request)
    {
        try
        {
            var updateTodo = new TodoItem
            {
                Title = request.Title ?? string.Empty,
                Description = request.Description,
                Status = request.Status ?? string.Empty,
                Priority = request.Priority ?? string.Empty,
                DueDate = request.DueDate
            };

            var updatedTodo = await _todoService.UpdateTodoAsync(id, updateTodo);
            return Ok(updatedTodo);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// DELETE /api/todos/{id} - Delete a TodoItem
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(Guid id)
    {
        var deleted = await _todoService.DeleteTodoAsync(id);
        if (!deleted)
        {
            return NotFound($"TodoItem with id {id} not found.");
        }
        return NoContent();
    }
}

/// <summary>
/// DTO for creating a new TodoItem
/// </summary>
public class CreateTodoRequest
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public DateOnly? DueDate { get; set; }
}

/// <summary>
/// DTO for updating an existing TodoItem
/// </summary>
public class UpdateTodoRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public DateOnly? DueDate { get; set; }
}
