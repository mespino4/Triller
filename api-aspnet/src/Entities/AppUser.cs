using Microsoft.AspNetCore.Identity;

namespace api_aspnet.src.Entities;

public class AppUser : IdentityUser<int>{
	public DateOnly DateOfBirth { get; set; }
	public string DisplayName { get; set; }
	public DateTime Created { get; set; } = DateTime.UtcNow;
	//public DateTime LastActive { get; set; } = DateTime.UtcNow;
	public string Language { get; set; }
	public string About { get; set; }
	public string Location { get; set; }
	public string ProfilePic { get; set; }
	public string BannerPic { get; set; }

	public List<UserPhoto> Media { get; set; } = new();

	public List<Connection> Followers { get; set; }
	public List<Connection> Following { get; set; }
	public List<Retrill> Retrills { get; set; }
	public List<Trill> Trills { get; set; } = new();
	public List<TrillLike> TrillsLiked { get; set; } = new();
	public List<TrillReply> Replies { get; set; } = new();

	public List<Bookmark> Bookmarks { get; set; } = new();
	public UserPhoto ProfilePicture { get; set; }
	public UserPhoto BannerPicture { get; set; }
	public List<UserReaction> UserReactions { get; set; } = new();

	public ICollection<AppUserRole> UserRoles { get; set; }

	public List<Message> MessagesSent { get; set; }
	public List<Message> MessagesReceived { get; set; }

	public List<Block> BlocksInitiated { get; set; } = new();
	public List<Block> BlocksReceived { get; set; } = new();
	public List<Notification> Notifications { get; set; } = new();
}