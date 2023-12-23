namespace api_aspnet.src.Entities;

public class Retrill {
	public int Id { get; set; }

	public int UserId { get; set; }
	public AppUser User { get; set; }

	public int? TrillId { get; set; }
	public Trill Trill { get; set; }

	public int? ReplyId { get; set; }
	public TrillReply Reply { get; set; }

	public DateTime CreatedAt { get; set; } = DateTime.Now;
}