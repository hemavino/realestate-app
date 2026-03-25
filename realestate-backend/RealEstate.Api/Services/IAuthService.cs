using RealEstate.Api.DTOs;

namespace RealEstate.Api.Services;

public interface IAuthService
{
    Task<string> RegisterAsync(RegisterDto dto);
    Task<LoginResponse?> LoginAsync(LoginDto dto);
}