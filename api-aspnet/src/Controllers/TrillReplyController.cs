using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Extensions;
using api_aspnet.src.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

public class TrillReplyController(IUnitOfWork uow, IMediaService mediaService, IMapper mapper) : BaseApiController {
	private readonly IUnitOfWork _uow = uow;
	private readonly IMediaService _mediaService = mediaService;
	private readonly IMapper _mapper = mapper;

    [HttpGet("id/")]
	public async Task<ActionResult<TrillReplyDTO>> GetReply(int replyId) {
		var reply = await _uow.TrillReplyRepository.GetTrillReplyById(replyId);
		if(reply == null) return NotFound("Reply not found");

		return Ok(_mapper.Map<TrillReplyDTO>(reply));
	}

	[HttpPost("like/")]
	public async Task<ActionResult> Like(int trillReplyId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var reactionType = await _uow.TrillReplyRepository.UserReaction(trillReplyId, user.Id);

		// Check if the user has already disliked the trill reply
		if(reactionType == ReactionType.Dislike) {
			// If the user has already disliked the trill reply, remove the dislike
			var trillReplyToRemoveDislike = await _uow.TrillReplyRepository.GetTrillReplyById(trillReplyId);
			if(trillReplyToRemoveDislike == null) return NotFound("Trill reply not found.");

			var existingDislike = trillReplyToRemoveDislike.Reactions
				.FirstOrDefault(r => r.UserId == user.Id && r.ReactionType == ReactionType.Dislike);
			if(existingDislike != null)
				trillReplyToRemoveDislike.Reactions.Remove(existingDislike);

			await _uow.Complete();
		}

		// Continue with the like logic
		var trillReplyToAddLike = await _uow.TrillReplyRepository.GetTrillReplyById(trillReplyId);
		if(trillReplyToAddLike == null) return NotFound("Trill reply not found.");

		var existingLike = trillReplyToAddLike.Reactions
			.FirstOrDefault(r => r.UserId == user.Id && r.ReactionType == ReactionType.Like);

		if(existingLike != null) {
			// If user has already liked the reply, remove the like
			trillReplyToAddLike.Reactions.Remove(existingLike);
			if(await _uow.Complete())
				return Ok();
		} else {
			// If user hasn't liked the trill reply, add the like
			var like = new UserReaction {
				User = user,
				UserId = user.Id,
				ReactionType = ReactionType.Like,
				TrillReply = trillReplyToAddLike,
				TrillReplyId = trillReplyToAddLike.Id
			};

			trillReplyToAddLike.Reactions.Add(like);

			if(await _uow.Complete())
				return Ok();
		}

		return BadRequest("Failed to process like for the trill reply.");
	}

	[HttpPost("dislike/")]
	public async Task<ActionResult> Dislike(int trillReplyId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var reactionType = await _uow.TrillReplyRepository.UserReaction(trillReplyId, user.Id);

		// Check if the user has already liked the trill reply
		if(reactionType == ReactionType.Like) {
			// If user has already liked the trill reply, remove the like
			var trillReplyToRemoveLike = await _uow.TrillReplyRepository.GetTrillReplyById(trillReplyId);
			if(trillReplyToRemoveLike == null) return NotFound("Trill reply not found.");

			var existingLike = trillReplyToRemoveLike.Reactions
				.FirstOrDefault(r => r.UserId == user.Id && r.ReactionType == ReactionType.Like);
			if(existingLike != null)
				trillReplyToRemoveLike.Reactions.Remove(existingLike);

			await _uow.Complete();
		}

		// Continue with the dislike logic
		var trillReplyToAddDislike = await _uow.TrillReplyRepository.GetTrillReplyById(trillReplyId);
		if(trillReplyToAddDislike == null) return NotFound("Trill reply not found.");

		var existingDislike = trillReplyToAddDislike.Reactions
			.FirstOrDefault(r => r.UserId == user.Id && r.ReactionType == ReactionType.Dislike);

		if(existingDislike != null) {
			//If user has already disliked the trill reply, remove the dislike
			trillReplyToAddDislike.Reactions.Remove(existingDislike);
			if(await _uow.Complete())
				return Ok();
		} else {
			//If user hasn't disliked the trill reply, add the dislike
			var dislike = new UserReaction {
				User = user,
				UserId = user.Id,
				ReactionType = ReactionType.Dislike,
				TrillReply = trillReplyToAddDislike,
				TrillReplyId = trillReplyToAddDislike.Id
			};

			trillReplyToAddDislike.Reactions.Add(dislike);

			if(await _uow.Complete())
				return Ok();
		}

		return BadRequest("Failed to process dislike for the trill reply.");
	}


	[HttpGet("reaction/{trillReplyId}")]
	public async Task<ActionResult<bool?>> GetUserReaction(int trillReplyId) {
		var userId = User.GetUserId();
		var userReaction = await _uow.TrillReplyRepository.GetUserReaction(trillReplyId, userId);

		return Ok(userReaction);
	}

	[HttpDelete("remove")] // /api/trillreply/{trillId}
	public async Task<IActionResult> RemoveReply(int replyId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var reply = await _uow.TrillReplyRepository.GetTrillReplyById(replyId);
		if(reply == null) return BadRequest("trill not found");

		_uow.TrillRepository.RemoveTrillReply(reply);

		if(await _uow.Complete())
			return Ok(_mapper.Map<TrillReplyDTO>(reply));

		return BadRequest("Failed to reply");
	}

}