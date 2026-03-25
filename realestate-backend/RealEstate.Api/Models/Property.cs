namespace RealEstate.Api.Models;

public class Property
{
    public int Id { get; set; } // Primary key, Identity column, auto-incremented
    public string Title { get; set; } = string.Empty; // Required, max 200 chars
    public string Location { get; set; } = string.Empty; // Required, max 300 chars
    public decimal Price { get; set; } // Required, must be > 0
    public string PropertyType { get; set; } = string.Empty; // Required, max 50 chars (Apartment/Villa/Land)
    public string? Description { get; set; } // Optional, max 2000 chars
    public int CreatedByUserId { get; set; } // Foreign key to Users table
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Default to current time
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // Default to current time
}
