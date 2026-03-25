using Microsoft.AspNetCore.Mvc;
using RealEstate.Api.DTOs;
using RealEstate.Api.Services;
using RealEstate.Api.Middleware;

namespace RealEstate.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        _logger.LogInformation("User registered successfully: {Email}", dto.Email);
        return Ok(new { message = result });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var token = await _authService.LoginAsync(dto);

        if (token is null)
        {
            _logger.LogWarning("Login failed for {Email}: Invalid credentials", dto.Email);
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(token);
    }
}