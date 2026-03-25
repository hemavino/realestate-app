using RealEstate.Api.DTOs;
using RealEstate.Api.Models;

namespace RealEstate.Api.Services;

public interface IPropertyService
{
	Task<PagedResultDto<Property>> GetAllAsync(int page, int pageSize, string? search);
	Task<Property?> GetByIdAsync(int id);
	Task<Property> CreateProperty(PropertyCreateDto dto, int userId);
	Task<Property?> UpdateAsync(int id, PropertyUpdateDto dto, int userId);
	Task<bool> DeleteAsync(int id, int userId);
}