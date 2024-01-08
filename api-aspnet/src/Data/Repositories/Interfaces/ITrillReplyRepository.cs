using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface ITrillReplyRepository {
	public Task<TrillReply> GetTrillReplyById(int trillReplyId);
	public Task<ReactionType> UserReaction(int trillReplyId, int userId);
	Task<bool?> GetUserReaction(int trillReplyId, int userId);
	Task<bool> SaveAllAsync();
}