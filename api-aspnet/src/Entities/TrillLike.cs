namespace api_aspnet.src.Entities;

public class TrillLike {
	public AppUser User { get; set; }
	public int UserId { get; set; }
	public Trill Trill { get; set; }
	public int TrillId { get; set; }
}