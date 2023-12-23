namespace api_aspnet.src.DTOs;

public class TrillReplyDTO {
	public int Id { get; set; }
	public int AuthorId { get; set; }
	public string Content { get; set; }
	public string Photo { get; set; }
	public DateTime Timestamp { get; set; } = DateTime.Now;
	public int? ParentTrillId { get; set; }
	public int Likes { get; set; }
	public int Dislikes { get; set; }
}
