namespace SmartTodo.Api.Models;

public class TodoItem
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    
    // Status: OPEN, IN_PROGRESS, DONE
    public required string Status { get; set; }
    
    // Priority: LOW, MEDIUM, HIGH
    public required string Priority { get; set; }
    
    public DateOnly? DueDate { get; set; }
    
    // IsOverdue is calculated: DueDate < today AND Status != DONE
    public bool IsOverdue
    {
        get
        {
            if (Status == "DONE") return false;
            if (DueDate == null) return false;
            return DueDate < DateOnly.FromDateTime(DateTime.UtcNow);
        }
    }
    
    public DateTime CreatedAt { get; set; }
}
