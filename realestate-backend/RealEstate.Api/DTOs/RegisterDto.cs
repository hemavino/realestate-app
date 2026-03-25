using System.ComponentModel.DataAnnotations;
using RealEstate.Api.Validation;

namespace RealEstate.Api.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [StrongPassword]
    public string Password { get; set; } = string.Empty;
}