using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

public class BookmarkController : BaseApiController {
	private readonly IUserRepository _userRepository;
	private readonly IBookmarkRepository _bookmarkRepository;
	private readonly ITrillRepository _trillRepository;
	private readonly IMapper _mapper;

	public BookmarkController(IUserRepository userRepository,
		IBookmarkRepository bookmarkRepository, ITrillRepository trillRepository,
		IMapper mapper) {

		_userRepository = userRepository;
		_bookmarkRepository = bookmarkRepository;
		_trillRepository = trillRepository;
		_mapper = mapper;
	}

	[HttpPost("add")] // /api/bookmark/add
	public async Task<ActionResult<TrillDTO>> AddBookmark(int trillId) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var trill = await _trillRepository.GetTrillById(trillId);
		if(trill == null) return BadRequest("trill not found");

		var bookmark = new Bookmark {
			User = user,
			UserId = user.Id,
			Trill = trill,
			TrillId = trillId,
			CreatedAt = DateTime.Now,
		};

		_bookmarkRepository.AddBookmark(bookmark);

		if(await _bookmarkRepository.SaveAllAsync())
			return _mapper.Map<TrillDTO>(bookmark.Trill);

		return BadRequest("Failed to add bookmark");
	}

	[HttpDelete("delete")] // /api/bookmark/delete
	public async Task<ActionResult> DeleteBookmark(int trillId) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var bookmark = await _bookmarkRepository.GetBookmarkByTrillId(trillId);
		if(bookmark == null) return BadRequest("Bookmark not found");

		_bookmarkRepository.RemoveBookmark(bookmark);

		if(await _bookmarkRepository.SaveAllAsync()) return Ok();

		return BadRequest("Failed to remove bookmark");
	}


	[HttpGet("user")] // /api/bookmark/user
	public async Task<ActionResult<IEnumerable<TrillDTO>>> GetUserBookmarks() {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var trills = await _bookmarkRepository.GetBookmarks(user.Id);
		var trillDtos = _mapper.Map<IEnumerable<TrillDTO>>(trills);
		return Ok(trillDtos);
	}

	[HttpGet] // /api/bookmark
	public async Task<ActionResult<bool>> GetBookmark(int trillId) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var bookmark = await _bookmarkRepository.GetBookmarkByTrillId(trillId);
		if(bookmark == null) return BadRequest("Bookmark not found");

		//var trillLike = trill.Likes.FirstOrDefault(t => t.UserId == user.Id);
		return Ok(bookmark != null);
	}
}
