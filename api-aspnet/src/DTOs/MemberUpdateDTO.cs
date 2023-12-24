namespace api_aspnet.src.DTOs;

/*
public class MemberUpdateDTO {
	public string DisplayName { get; set; }
	public string About { get; set; }
	public string Location { get; set; }
	public string ProfilePic { get; set; }
}
*/

public record MemberUpdateDTO(
	string DisplayName,
	string About,
	string Location,
	string ProfilePic);