using RealEstate.Api.DTOs;
using System.Net;
using System.Text.Json;

namespace RealEstate.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception for {Method} {Path}", context.Request.Method, context.Request.Path);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";

        var response = ex switch
        {
            UnauthorizedAccessException => new ErrorResponseDto
            {
                StatusCode = (int)HttpStatusCode.Forbidden,
                Message = ex.Message
            },
            InvalidOperationException => new ErrorResponseDto
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                Message = ex.Message
            },
            KeyNotFoundException => new ErrorResponseDto
            {
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = ex.Message
            },
            _ => new ErrorResponseDto
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Message = "An unexpected error occurred. Please try again later.",
                Detail = _env.IsDevelopment() ? ex.ToString() : null
            }
        };

        context.Response.StatusCode = response.StatusCode;

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}