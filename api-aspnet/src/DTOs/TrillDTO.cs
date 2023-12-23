namespace api_aspnet.src.DTOs;

public class TrillDTO {
	public int Id { get; set; }
	public int AuthorId { get; set; }
	public string Content { get; set; }
	public string Photo { get; set; }
	public int Retrills { get; set; }
	public int Likes { get; set; }
	public List<TrillReplyDTO> Replies { get; set; }
	public string Timestamp { get; set; }
}
