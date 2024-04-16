using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Extensions;
using api_aspnet.src.Helpers;
using api_aspnet.src.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

public class TrillController(IUnitOfWork uow, IMediaService mediaService, IMapper mapper) : BaseApiController {
	private readonly IUnitOfWork _uow = uow;
	private readonly IMediaService _mediaService = mediaService;
	private readonly IMapper _mapper = mapper;

    [HttpPost] ///api/trill/
	public async Task<ActionResult<TrillDTO>> CreateTrill(CreateTrillDTO createTrillDTO) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var trill = new Trill {
			Author = user,
			AuthorId = user.Id,
			Content = createTrillDTO.Content,
			Timestamp = DateTime.Now,
		};

		// Check if the File property is not null before handling it
		if(createTrillDTO.File != null) {
			var result = await _mediaService.AddPhotoAsync(createTrillDTO.File);
			if(result.Error != null) return BadRequest($"Error {result.Error.Message}");

			var trillMedia = new TrillMedia {
				Url = result.SecureUrl.AbsoluteUri,
				PublicId = result.PublicId,
				TrillId = trill.Id,
			};
			trill.Photo = trillMedia.Url;
		}

		_uow.TrillRepository.AddTrill(trill);

		if(await _uow.Complete())
			return Ok(_mapper.Map<TrillDTO>(trill));

		return BadRequest("Failed to create trill");
	}

	[HttpDelete] ///api/trill/
	public async Task<ActionResult<TrillDTO>> DeleteTrill(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(user == null) return BadRequest("trill not found");

		_uow.TrillRepository.DeleteTrill(trill);

		if(await _uow.Complete())
			return Ok(_mapper.Map<TrillDTO>(trill));

		return BadRequest("Failed to delete trill");
	}

	[HttpGet]
	public async Task<ActionResult<PagedList<TrillDTO>>> GetTrills([FromQuery] UserParams userParams) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var trills = await _uow.TrillRepository.GetTrillsAsync(user.Id, userParams);
		
		Response.AddPaginationHeader(new PaginationHeader(trills.CurrentPage, trills.PageSize,
		trills.TotalCount, trills.TotalPages));
		
		if(trills != null) return Ok(_mapper.Map<IEnumerable<TrillDTO>>(trills));

		return BadRequest("Failed to get Trills");
	}

	[HttpGet("for-you/")]
	public async Task<ActionResult<PagedList<TrillDTO>>> GetForYouTrills([FromQuery] UserParams userParams) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var trills = await _uow.TrillRepository
			.GetForYouTrillsAsync(user.Id, userParams);

		Response.AddPaginationHeader(new PaginationHeader(trills.CurrentPage, trills.PageSize,
		trills.TotalCount, trills.TotalPages));

		if(trills != null) return Ok(_mapper.Map<IEnumerable<TrillDTO>>(trills));

		return Ok(trills);
	}

	[HttpGet("following/")]
	public async Task<ActionResult<PagedList<TrillDTO>>> GetFollowingTrills([FromQuery] UserParams userParams) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var trills = await _uow.TrillRepository
			.GetFollowingTrillsAsync(user.Id, userParams);

		Response.AddPaginationHeader(new PaginationHeader(trills.CurrentPage, trills.PageSize,
		trills.TotalCount, trills.TotalPages));

		if(trills != null) return Ok(_mapper.Map<IEnumerable<TrillDTO>>(trills));

		return Ok(trills);
	}

	[HttpGet("id/")] // /api/trill/id/2
	public async Task<ActionResult<TrillDTO>> GetTrillsById(int trillId) {
		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("Trill not found");
		var trillDto = _mapper.Map<TrillDTO>(trill);
		return Ok(trillDto);
	}

	[HttpGet("replies/")]
	public async Task<ActionResult<IEnumerable<TrillReplyDTO>>> GetRepliesFromTrillId(int trillId) {
		var replies = await _uow.TrillRepository.GetRepliesFromTrillId(trillId);

		if(replies == null)
			return NotFound($"Replies for trill with ID {trillId} not found.");

		return Ok(_mapper.Map<IEnumerable<TrillReplyDTO>>(replies));
	}

	[HttpPost("reply/{trillId}")] // /api/trill/reply/{trillId}
	public async Task<IActionResult> ReplyToTrill(int trillId, CreateTrillDTO trillReplyDTO) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("trill not found");

		var trillReply = new TrillReply {
			Author = user,
			AuthorId = user.Id,
			Content = trillReplyDTO.Content,
			Timestamp = DateTime.Now,
			ParentTrill = trill,
			ParentTrillId = trillId,
		};

		// Check if the File property is not null before handling it
		if(trillReplyDTO.File != null) {
			var result = await _mediaService.AddPhotoAsync(trillReplyDTO.File);
			if(result.Error != null) return BadRequest($"Error {result.Error.Message}");

			var trillMedia = new TrillMedia {
				Url = result.SecureUrl.AbsoluteUri,
				PublicId = result.PublicId,
				TrillId = trill.Id,
			};
			trillReply.Photo = trillMedia.Url;
		}

		if(user.Id != trill.AuthorId) {
			var notification = new Notification {
				//User = user,
				UserId = trill.AuthorId,
				//Member, = null,
				MemberId = user.Id,
				Type = "Reply",
				//TrillId = trillId,
				Timestamp = DateTime.Now
			};
			_uow.NotificationRepository.AddNotification(notification);
			await _uow.Complete();
		}


		_uow.TrillRepository.AddTrillReply(trillReply);

		if(await _uow.Complete())
			return Ok(_mapper.Map<TrillReplyDTO>(trillReply));

		return BadRequest("Failed to reply");
	}

	[HttpPost("retrill/add")]
	public async Task<IActionResult> CreateRetrill(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("trill not found");

		// Create the retweet
		var retrill = new Retrill {
			User = user,
			UserId = user.Id,
			Trill = trill,
			TrillId = trillId,
			CreatedAt = DateTime.Now
		};

		if(user.Id != trill.AuthorId) {
			var notification = new Notification {
				//User = user,
				UserId = trill.AuthorId,
				//Member, = null,
				MemberId = user.Id,
				Type = "Repost",
				//TrillId = trillId,
				Timestamp = DateTime.Now
			};
			_uow.NotificationRepository.AddNotification(notification);
			await _uow.Complete();
		}

		//retrill.Trill.Timestamp = DateTime.UtcNow; // See explanation 1 below

		_uow.RetrillRepository.CreateRetrill(retrill);

		if(await _uow.Complete())
			return Ok(_mapper.Map<TrillDTO>(trill));

		return BadRequest("Unable to retrill");
	}

	[HttpGet("retrill/")] // /api/trill/retrill
	public async Task<ActionResult<bool>> GetRetrill(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("Trill not found");

		var retrill = trill.Retrills.FirstOrDefault(t => t.UserId == user.Id);
		//var trillLike = trill.Likes.FirstOrDefault(t => t.UserId == user.Id);
		return Ok(retrill != null);
	}

	[HttpDelete("retrill/delete")] // /api/trill/like/delete
	public async Task<ActionResult> DeleteRetrill(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("trill not found");

		var retrill = trill.Retrills.FirstOrDefault(t => t.TrillId == trillId);
		if(retrill == null) return BadRequest("Retrill not found");
		/*
		var trillLike = trill.Likes.FirstOrDefault(t => t.TrillId == trillId);
		if(trillLike == null) return BadRequest("trillLike not found");
		*/
		trill.Retrills.Remove(retrill);
		//trill.Likes.Remove(trillLike);

		if(await _uow.Complete()) return Ok();

		return BadRequest("Failed to remove retrill");
	}

	//Trill Likes
	[HttpPost("like/add")]
	public async Task<ActionResult> AddLike(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("Trill not found");

		// Check if the user already liked the trill
		var existingLike = trill.Likes.FirstOrDefault(tl => tl.UserId == user.Id);

		if(existingLike == null) {
			_uow.TrillRepository.AddLike(trill, user);

			if(user.Id != trill.AuthorId) {
				var notification = new Notification {
					UserId = trill.AuthorId,
					MemberId = user.Id,
					Type = "Like",
					TrillId = trillId,
					Timestamp = DateTime.Now
				};

				_uow.NotificationRepository.AddNotification(notification);
				//await _uow.Complete(); // Save trill and like changes

				await _uow.Complete(); // Save notification changes separately

				return Ok();
			}
			return await _uow.Complete() ? Ok() : BadRequest("Failed to add like");
		}
		return BadRequest("User already liked this trill");
	}


	[HttpDelete("like/delete")] // /api/trill/like/delete
	public async Task<ActionResult> DeleteLike(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("Trill not found");

		_uow.TrillRepository.RemoveLike(trill, user);

		return await _uow.Complete() ? Ok() : BadRequest("Failed to remove like");
	}

	[HttpGet("like")] // /api/trill/like
	public async Task<ActionResult<bool>> GetTrillLike(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("Trill not found");

		var trillLike = trill.Likes.FirstOrDefault(t => t.UserId == user.Id);
		return Ok(trillLike != null);
	}
}
