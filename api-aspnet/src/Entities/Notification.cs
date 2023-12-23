namespace api_aspnet.src.Entities;

public class Notification {
	public int Id { get; set; }
	public int UserId { get; set; }
	public AppUser User { get; set; }

	public int MemberId { get; set; }
	public AppUser Member { get; set; }

	public string Type { get; set; } //Reply, Repost, Like, Follow
	public int? TrillId { get; set; }
	public DateTime Timestamp { get; set; }
}