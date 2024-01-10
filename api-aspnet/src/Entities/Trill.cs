namespace api_aspnet.src.Entities;

public class Trill {
	public int Id { get; set; }
	public AppUser Author { get; set; }
	public int AuthorId { get; set; }
	public string Content { get; set; }
	public string Photo { get; set; }
	public TrillMedia Media { get; set; }
	public List<Retrill> Retrills { get; set; }
	public List<TrillLike> Likes { get; set; } //= new();
	public DateTime Timestamp { get; set; } = DateTime.Now;
	public List<Bookmark> BookmarkedByUsers { get; set; } //= new();

	public List<TrillReply> Replies { get; set; } //= new();
}