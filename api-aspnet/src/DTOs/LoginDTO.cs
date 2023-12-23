using System.ComponentModel.DataAnnotations;

namespace api_aspnet.src.DTOs;

public class LoginDTO {
	[Required]
	public string Username { get; set; }

	[Required]
	public string Password { get; set; }
}
