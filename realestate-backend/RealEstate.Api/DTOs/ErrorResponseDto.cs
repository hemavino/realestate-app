namespace RealEstate.Api.DTOs;

public class ErrorResponseDto
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Detail { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}