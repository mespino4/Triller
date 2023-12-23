namespace api_aspnet.src.Entities;

public class ChatCard {
	public int Id { get; set; }

	public string User1Username { get; set; }
	public string User2Username { get; set; }

	public string RecentMessage { get; set; }
	public DateTime Timestamp { get; set; } = DateTime.UtcNow;

	// Navigation properties
	public ICollection<Message> Messages { get; set; }
}