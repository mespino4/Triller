namespace api_aspnet.src.Entities;

public class Message {
	public int Id { get; set; }
	public int SenderId { get; set; }
	public string SenderUsername { get; set; }
	public AppUser Sender { get; set; }
	public int RecipientId { get; set; }
	public string RecipientUsername { get; set; }
	public AppUser Recipient { get; set; }
	public string Content { get; set; }
	public DateTime? DateRead { get; set; }
	public DateTime Timestamp { get; set; } = DateTime.UtcNow;
	public bool SenderDeleted { get; set; }
	public bool RecipientDeleted { get; set; }

	// Navigation properties
	public int ChatCardId { get; set; }
	public ChatCard ChatCard { get; set; }

}