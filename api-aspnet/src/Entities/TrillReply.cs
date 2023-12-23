namespace api_aspnet.src.Entities;

public class TrillReply {
	public int Id { get; set; }
	public AppUser Author { get; set; }
	public int AuthorId { get; set; }
	public string Content { get; set; }
	public string Photo { get; set; }
	public TrillMedia Media { get; set; }
	public DateTime Timestamp { get; set; } = DateTime.Now;
	public Trill ParentTrill { get; set; }
	public int? ParentTrillId { get; set; }
	public List<UserReaction> Reactions { get; set; } = new();
}