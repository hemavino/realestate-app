namespace RealEstate.Api.Models;

public class User
{
    public int Id { get; set; } // Primary key, Identity column, auto-incremented
    public string Name { get; set; } = string.Empty; //Required, max 100 chars
    public string Email { get; set; } = string.Empty; //Required, Unique
    public string PasswordHash { get; set; } = string.Empty; //Required
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; //Default to current time
}