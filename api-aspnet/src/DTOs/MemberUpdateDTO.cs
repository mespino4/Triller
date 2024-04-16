namespace api_aspnet.src.DTOs;

public record MemberUpdateDTO(
    string Displayname,
    string About,
    string Location
    //string ProfilePic
    );