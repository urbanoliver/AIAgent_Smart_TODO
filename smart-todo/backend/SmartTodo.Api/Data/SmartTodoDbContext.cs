using Microsoft.EntityFrameworkCore;
using SmartTodo.Api.Models;

namespace SmartTodo.Api.Data;

public class SmartTodoDbContext : DbContext
{
    public SmartTodoDbContext(DbContextOptions<SmartTodoDbContext> options) : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(255);
            
            entity.Property(e => e.Description)
                .HasMaxLength(1000);
            
            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20);
            
            entity.Property(e => e.Priority)
                .IsRequired()
                .HasMaxLength(20);
            
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}
