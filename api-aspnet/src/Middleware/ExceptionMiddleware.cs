using api_aspnet.src.Errors;
using System.Net;
using System.Text.Json;

namespace api_aspnet.src.Middleware;

public class ExceptionMiddleware(
    RequestDelegate next,
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env) {
	private readonly RequestDelegate _next = next;
	private readonly ILogger<ExceptionMiddleware> _logger = logger;
	private readonly IHostEnvironment _env = env;

    // Middleware's main entry point
    public async Task InvokeAsync(HttpContext context) {
		try {
			// Call the next middleware in the pipeline
			await _next(context);
		} catch(Exception ex) {
			// Log the exception using the provided logger
			_logger.LogError(ex, ex.Message);

			// Set the response content type to JSON
			context.Response.ContentType = "application/json";

			// Set the HTTP status code to 500 (Internal Server Error)
			context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

			// Create an exception response object
			var response = _env.IsDevelopment()
				? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
				: new ApiException(context.Response.StatusCode, ex.Message, "Internal server error");

			// Configure JSON serialization options
			var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

			// Serialize the exception response object to JSON
			var json = JsonSerializer.Serialize(response, options);

			// Write the JSON response to the HTTP response
			await context.Response.WriteAsync(json);
		}
	}
}