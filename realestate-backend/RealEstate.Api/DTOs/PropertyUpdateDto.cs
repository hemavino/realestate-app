using System.ComponentModel.DataAnnotations;
using RealEstate.Api.Validation;

namespace RealEstate.Api.DTOs;

public class PropertyUpdateDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Location is required.")]
    [MaxLength(300, ErrorMessage = "Location cannot exceed 300 characters.")]
    public string Location { get; set; } = string.Empty;

    [Required(ErrorMessage = "Price is required.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "PropertyType is required.")]
    [RegularExpression("Apartment|Villa|Land", ErrorMessage = "PropertyType must be Apartment, Villa or Land.")]
    public string PropertyType { get; set; } = string.Empty;

    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
    public string? Description { get; set; }
}