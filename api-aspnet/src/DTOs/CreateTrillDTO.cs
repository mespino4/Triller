using System.Diagnostics.CodeAnalysis;

namespace api_aspnet.src.DTOs;


public class CreateTrillDTO {
	public string Content { get; set; }

	[AllowNull] 
	public IFormFile File { get; set; }
}

/*
public record CreateTrillDTO(
	string Content,
	[AllowNull] IFormFile File
	);
*/