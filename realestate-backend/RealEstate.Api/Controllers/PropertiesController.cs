using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Api.DTOs;
using RealEstate.Api.Services;
using System.Security.Claims;
using RealEstate.Api.Middleware;

namespace RealEstate.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/properties")]
public class PropertiesController : ControllerBase
{
    readonly IPropertyService _propertyService;
    readonly ILogger<PropertiesController> _logger;

    public PropertiesController(IPropertyService propertyService, ILogger<PropertiesController> logger)
    {
        _propertyService = propertyService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string? search = null)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 5;

        var result = await _propertyService.GetAllAsync(page, pageSize, search);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property is null)
            return NotFound(new { message = "Property not found." });
        return Ok(property);
    }

    [HttpPost]
    public async Task<IActionResult> Create(PropertyCreateDto dto)
    {
        var userId = GetUserId();
        var property = await _propertyService.CreateProperty(dto, userId);
        _logger.LogInformation("Property {Id} created successfully by User {UserId}", property.Id, userId);
        return CreatedAtAction(nameof(GetById), new { id = property.Id }, property);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, PropertyUpdateDto dto)
    {
        var userId = GetUserId();
        var property = await _propertyService.UpdateAsync(id, dto, userId);

        if (property is null)
            return NotFound(new { message = "Property not found." });

        return Ok(property);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var deleted = await _propertyService.DeleteAsync(id, userId);

        if (!deleted)
            return NotFound(new { message = "Property not found." });

        return NoContent();
    }
        
    private int GetUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException("User ID not found in token.");

        return int.Parse(sub);
    }
}