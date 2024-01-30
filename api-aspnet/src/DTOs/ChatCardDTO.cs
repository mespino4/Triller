namespace api_aspnet.src.DTOs;

public class ChatCardDTO {
	public string ChatPartnerUsername { get; set; }
	public string RecentMessage { get; set; }
	public DateTime Timestamp { get; set; }
}