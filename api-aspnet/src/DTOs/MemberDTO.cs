namespace api_aspnet.src.DTOs;

public class MemberDTO {
	public int Id { get; set; }
	public string Username { get; set; }
	public string Displayname { get; set; }
	//public DateTime LastActive { get; set; }
	public string Language { get; set; }
	public string About { get; set; }
	public string Location { get; set; }
	public string ProfilePic { get; set; }
	public string BannerPic { get; set; }
	public int TrillCount { get; set; }
	public int FollowerCount { get; set; }
	public int FollowingCount { get; set; }
	//public List<TimelineTrillDto> Timeline { get; set; }
	//public List<TrillDto> Trills { get; set; }
	//public List<BookmarkDto> Bookmarks { get; set; }
}
