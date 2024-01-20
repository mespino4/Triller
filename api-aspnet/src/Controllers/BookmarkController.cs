using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

public class BookmarkController : BaseApiController {
	private readonly IUnitOfWork _uow;
	private readonly IMapper _mapper;

	public BookmarkController(IUnitOfWork uow, IMapper mapper) {
		_uow = uow;
		_mapper = mapper;
	}

	[HttpPost("add")] // /api/bookmark/add
	public async Task<ActionResult<TrillDTO>> AddBookmark(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var trill = await _uow.TrillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("trill not found");

		var bookmark = new Bookmark {
			User = user,
			UserId = user.Id,
			Trill = trill,
			TrillId = trillId,
			CreatedAt = DateTime.Now,
		};

		_uow.BookmarkRepository.AddBookmark(bookmark);

		if(await _uow.Complete())
			return _mapper.Map<TrillDTO>(bookmark.Trill);

		return BadRequest("Failed to add bookmark");
	}

	[HttpDelete("delete")] // /api/bookmark/delete
	public async Task<ActionResult> DeleteBookmark(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var bookmark = await _uow.BookmarkRepository.GetBookmarkByTrillId(trillId, user.Id);
		if(bookmark == null) return BadRequest("Bookmark not found");

		_uow.BookmarkRepository.RemoveBookmark(bookmark);
		if(await _uow.Complete()) return Ok();

		return BadRequest("Failed to remove bookmark");
	}


	[HttpGet("user")] // /api/bookmark/user
	public async Task<ActionResult<IEnumerable<TrillDTO>>> GetUserBookmarks() {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var trills = await _uow.BookmarkRepository.GetBookmarks(user.Id);
		var trillDtos = _mapper.Map<IEnumerable<TrillDTO>>(trills);
		return Ok(trillDtos);
	}

	[HttpGet] // /api/bookmark
	public async Task<ActionResult<bool>> GetBookmark(int trillId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var bookmark = await _uow.BookmarkRepository.GetBookmarkByTrillId(trillId, user.Id);
		if(bookmark != null) return Ok(true); else return Ok(false);
	}
}
