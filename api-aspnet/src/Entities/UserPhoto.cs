using System.ComponentModel.DataAnnotations.Schema;

namespace api_aspnet.src.Entities;

public class UserPhoto {
	public int Id { get; set; }
	public string Url { get; set; }
	public string PublicId { get; set; }

	[ForeignKey("ProfilePicture")]
	public int? ProfilePictureId { get; set; }

	[ForeignKey("BannerPicture")]
	public int? BannerPictureId { get; set; }

	public AppUser ProfilePicture { get; set; }
	public AppUser BannerPicture { get; set; }
}