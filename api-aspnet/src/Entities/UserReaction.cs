namespace api_aspnet.src.Entities;

public class UserReaction {
	public int Id { get; set; }
	public AppUser User { get; set; }
	public int UserId { get; set; }
	public ReactionType ReactionType { get; set; } // Enum: Like, Dislike
	public int? TrillReplyId { get; set; }
	public TrillReply TrillReply { get; set; }
}

public enum ReactionType {
	None,
	Like,
	Dislike
}