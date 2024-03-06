using System.ComponentModel.DataAnnotations;

namespace api_aspnet.src.DTOs;

public record LoginDTO (
	[Required] string Username,
	[Required] string Password
	);