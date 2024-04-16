using System.ComponentModel.DataAnnotations;

namespace api_aspnet.src.DTOs;
public class UserDTO {
    public int UserId { get; set; }
    public string Username { get; set; }
    public string Token { get; set; }
    public string Displayname { get; set; }
    public string Language { get; set; }
    public string ProfilePic { get; set; }
    public string BannerPic { get; set; }
}

//with records
/*
public record UserDTO(
    int UserId,
    string Username,
    string Token,
    string Displayname,
    string Language,
    string ProfilePic,
    string BannerPic
    );
*/