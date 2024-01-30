namespace api_aspnet.src.DTOs;

public class NotificationDTO {
	public int Id { get; set; }
	public int UserId { get; set; }
	public string UserUsername { get; set; }
	public int MemberId { get; set; }
	public string MemberUsername { get; set; }
	public string Type { get; set; }
	public int? TrillId { get; set; }
	public DateTime Timestamp { get; set; }
}