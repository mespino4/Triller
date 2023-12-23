using System.ComponentModel.DataAnnotations;

namespace api_aspnet.src.DTOs;

public class RegisterDTO {
	[Required]
	public string Username { get; set; }

	[Required]
	public string Displayname { get; set; }

	[Required]
	public string Gender { get; set; }

	[Required]
	public DateOnly? DateOfBirth { get; set; } //optional to make required work

	[Required]
	public string Location { get; set; }

	[Required]
	[StringLength(8, MinimumLength = 4)]
	public string Password { get; set; }
}
