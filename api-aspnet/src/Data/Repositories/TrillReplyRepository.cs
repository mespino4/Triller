using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;
public class TrillReplyRepository(DataContext context, IMapper mapper) : ITrillReplyRepository {
	private readonly DataContext _context = context;
	private readonly IMapper _mapper = mapper;

    public async Task<TrillReply> GetTrillReplyById(int trillReplyId) {
		return await _context.TrillReplies
			.Include(tr => tr.Reactions) // Include the Reactions collection
			.FirstOrDefaultAsync(tr => tr.Id == trillReplyId);
	}

	public async Task<ReactionType> UserReaction(int trillReplyId, int userId) {
		var trillReply = await GetTrillReplyById(trillReplyId);
		if(trillReply == null) return ReactionType.None; // Reply not found

		var existingReaction = trillReply.Reactions
			.FirstOrDefault(reaction => reaction.UserId == userId);

		return existingReaction?.ReactionType ?? ReactionType.None;
	}

	public async Task<bool?> GetUserReaction(int trillReplyId, int userId) {
		var trillReply = await GetTrillReplyById(trillReplyId);
		if(trillReply == null) return null; // Reply not found

		var existingLike = trillReply.Reactions
			.FirstOrDefault(r => r.UserId == userId && r.ReactionType == ReactionType.Like);
		var existingDislike = trillReply.Reactions
			.FirstOrDefault(r => r.UserId == userId && r.ReactionType == ReactionType.Dislike);

		if(existingLike != null) return true;
		if(existingDislike != null) return false;

		return null; // User has neither liked nor disliked
	}
}
