using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Data;
using RealEstate.Api.DTOs;
using RealEstate.Api.Models;

namespace RealEstate.Api.Services;

public class PropertyService : IPropertyService
{
    private readonly AppDbContext _context;
    private readonly ILogger<PropertyService> _logger;

    public PropertyService(AppDbContext context, ILogger<PropertyService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PagedResultDto<Property>> GetAllAsync(int page, int pageSize, string? search)
    {
        var query = _context.Properties.AsNoTracking();

        // Search filter — Title or Location contains match
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p =>
                p.Title.Contains(search) ||
                p.PropertyType.Contains(search) ||
                p.Location.Contains(search));

        var totalCount = await query.CountAsync();

        var data = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResultDto<Property>
        {
            Data = data,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<Property?> GetByIdAsync(int id)
    {
        return await _context.Properties.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Property> CreateProperty(PropertyCreateDto dto, int userId)
    {
        try
        {
            var property = new Property
            {
                Title = dto.Title,
                Location = dto.Location,
                Price = dto.Price,
                PropertyType = dto.PropertyType,
                Description = dto.Description,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            return property;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error while creating property for User {UserId}", userId);
            throw new InvalidOperationException("An error occurred while creating the property. Please try again later.");
        }

    }

    public async Task<Property?> UpdateAsync(int id, PropertyUpdateDto dto, int userId)
    {
        try
        {
            var property = await _context.Properties.FirstOrDefaultAsync(p => p.Id == id);

            if (property is null)
            {
                _logger.LogWarning("Property {Id} not found for update by User {UserId}", id, userId);
                return null;
            }

            if (property.CreatedByUserId != userId)
            {
                _logger.LogWarning("Unauthorized update attempt on Property {Id} by User {UserId}", id, userId);
                throw new UnauthorizedAccessException("You are not allowed to update this property.");
            }

            property.Title = dto.Title;
            property.Location = dto.Location;
            property.Price = dto.Price;
            property.PropertyType = dto.PropertyType;
            property.Description = dto.Description;
            property.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Property {Id} updated by User {UserId}", id, userId);

            return property;
        }
        catch (UnauthorizedAccessException)
        {
            throw;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error while updating Property {Id}", id);
            throw new InvalidOperationException("Failed to update property. Please try again.");
        }
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        try
        {
            var property = await _context.Properties.FirstOrDefaultAsync(p => p.Id == id);

            if (property is null)
            {
                _logger.LogWarning("Property {Id} not found for deletion by User {UserId}", id, userId);
                return false;
            }

            if (property.CreatedByUserId != userId)
            {
                _logger.LogWarning("Unauthorized delete attempt on Property {Id} by User {UserId}", id, userId);
                throw new UnauthorizedAccessException("You are not allowed to delete this property.");
            }

            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Property {Id} deleted by User {UserId}", id, userId);

            return true;
        }
        catch (UnauthorizedAccessException)
        {
            throw;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error while deleting Property {Id}", id);
            throw new InvalidOperationException("Failed to delete property. Please try again.");
        }
    }
}


