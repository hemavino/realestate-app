using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace RealEstate.Api.Validation;

public class StrongPasswordAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is not string password)
            return new ValidationResult("Password is required.");

        var errors = new List<string>();

        if (password.Length < 6)
            errors.Add("at least 6 characters");
        if (!Regex.IsMatch(password, @"[A-Z]"))
            errors.Add("one uppercase letter");
        if (!Regex.IsMatch(password, @"[0-9]"))
            errors.Add("one number");
        if (!Regex.IsMatch(password, @"[a-z]"))
            errors.Add("one lowercase letter");

        if (errors.Count > 0)
            return new ValidationResult($"Password must contain {string.Join(", ", errors)}.");

        return ValidationResult.Success;
    }
}