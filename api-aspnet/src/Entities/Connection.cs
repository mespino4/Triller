namespace api_aspnet.src.Entities;

public class Connection {
	public int ConnectionId { get; set; }

	// Source user (follower)
	public int SourceUserId { get; set; }
	public AppUser SourceUser { get; set; }

	// Target user (following)
	public int TargetUserId { get; set; }
	public AppUser TargetUser { get; set; }
}
