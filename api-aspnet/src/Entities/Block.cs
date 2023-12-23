namespace api_aspnet.src.Entities;

public class Block {
	public int Id { get; set; }

	public int UserId { get; set; }
	public AppUser User { get; set; }

	public int BlockedUserId { get; set; }
	public AppUser BlockedUser { get; set; }
}