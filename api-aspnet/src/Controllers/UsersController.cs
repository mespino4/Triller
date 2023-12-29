using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Extensions;
using api_aspnet.src.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

[Authorize]
public class UsersController : BaseApiController {
	private readonly IUserRepository _userRepository;
	private readonly IMediaService _mediaService;
	private readonly IBookmarkRepository _bookmarkRepository;
	private readonly ITrillRepository _trillRepository;
	private readonly IBlockRepository _blockRepository;
	private readonly IMapper _mapper;

	public UsersController(IUserRepository userRepository, IMediaService mediaService,
		IBookmarkRepository bookmarkRepository, ITrillRepository trillRepository,
		IBlockRepository blockRepository, IMapper mapper) {
		_userRepository = userRepository;
		_mediaService = mediaService;
		_bookmarkRepository = bookmarkRepository;
		_trillRepository = trillRepository;
		_blockRepository = blockRepository;
		_mapper = mapper;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers() {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound();

		var members = await _userRepository.GetUsersAsync(user.Id);
		return Ok(_mapper.Map<IEnumerable<MemberDTO>>(members));
	}


	[HttpGet("username/{username}")] ///api/users/username
	public async Task<ActionResult<MemberDTO>> GetUser(string username) {
		var user =  await _userRepository.GetUserByUsernameAsync(username);
		return _mapper.Map<MemberDTO>(user);
	}

	[HttpGet("id/{id}")] ///api/users/id
	public async Task<ActionResult<MemberDTO>> GetUserById(int id) {
		var user = await _userRepository.GetUserByIdAsync(id);
		return _mapper.Map<MemberDTO>(user);
	}

	[HttpGet("timeline")]
	public async Task<ActionResult<IEnumerable<TrillDTO>>> GetUserTimeline(string username) {
		var user = await _userRepository.GetUserByUsernameAsync(username);
		if(user == null) return NotFound();

		var timeline = await _userRepository.GetUserTimeline(user.Id);
		if(timeline == null) return BadRequest("Timeline not found");

		return Ok(_mapper.Map<IEnumerable<TrillDTO>>(timeline));
	}

	[HttpPut("profile")]
	public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDto) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound();

		_mapper.Map(memberUpdateDto, user);

		if(await _userRepository.SaveAllAsync()) return NoContent();
		return BadRequest("Failed to update user");
	}

	//Profile Pic
	[HttpPut("profile-pic/update")] // /api/users/profile-pic
	public async Task<ActionResult> UpdateUserProfilePic(IFormFile file) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound();

		var result = await _mediaService.AddPhotoAsync(file);
		if(result.Error != null) return BadRequest($"Error {result.Error.Message}");

		var photo = new UserPhoto {
			Url = result.SecureUrl.AbsoluteUri,
			PublicId = result.PublicId,
			ProfilePictureId = user.Id,
		};

		if(user.ProfilePicture != null) {
			await _mediaService.DeleteMediaAsync(user.ProfilePicture.PublicId);
			_userRepository.DeleteProfilePicture(user);
		}

		user.ProfilePicture = photo;
		user.ProfilePic = photo.Url;

		if(await _userRepository.SaveAllAsync()) {
			return CreatedAtAction(nameof(GetUser),
				new { username = user.UserName },
				await _userRepository.GetUserByUsernameAsync(user.UserName));
		}
		return BadRequest("Failed to update profile pic");
	}

	[HttpDelete("profile-pic/delete")] // /api/users/profile-pic
	public async Task<ActionResult> DeleteUserProfilePic() {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound();

		var profilePhoto = user.ProfilePicture;
		if(profilePhoto == null) return NotFound();

		if(profilePhoto != null) {
			var result = await _mediaService.DeleteMediaAsync(profilePhoto.PublicId);

			_userRepository.DeleteProfilePicture(user);
			if(result.Error != null) return BadRequest(result.Error.Message);
		}

		user.ProfilePic = null;

		if(await _userRepository.SaveAllAsync()) return Ok();

		return BadRequest("Failed to remove profile pic");
	}

	[HttpPut("banner-pic/update")] // /api/users/profile-pic
	public async Task<ActionResult> UpdateUserBannerPic(IFormFile file) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound("User not found");

		var result = await _mediaService.AddPhotoAsync(file);
		if(result.Error != null) return BadRequest($"Error {result.Error.Message}");

		var photo = new UserPhoto {
			Url = result.SecureUrl.AbsoluteUri,
			PublicId = result.PublicId,
			BannerPictureId = user.Id
		};

		if(user.BannerPicture != null) {
			await _mediaService.DeleteMediaAsync(user.BannerPicture.PublicId);
			_userRepository.DeleteBannerPicture(user);
		}

		user.BannerPicture = photo;
		user.BannerPic = photo.Url;

		if(await _userRepository.SaveAllAsync())
			return Ok();
		return BadRequest("Failed to update Banner pic");
	}

	
	[HttpPost("block")] // /api/users/block
	public async Task<ActionResult<MemberDTO>> BlockUser(int blockUserId) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var user2Block = await _userRepository.GetUserByIdAsync(blockUserId);
		if(user2Block == null) return BadRequest("User to follow not found");

		var block = new Block {
			User = user,
			UserId = user.Id,
			BlockedUser = user2Block,
			BlockedUserId = user2Block.Id
		};

		_blockRepository.BlockUser(block);

		if(await _blockRepository.SaveAllAsync())
			return _mapper.Map<MemberDTO>(user2Block);

		return BadRequest("Failed to block user");
	}

	[HttpDelete("unblock")] // /api/users/unblock
	public async Task<ActionResult<MemberDTO>> UnblockUser(int blockUserId) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var user2Block = await _userRepository.GetUserByIdAsync(blockUserId);
		if(user2Block == null) return BadRequest("User to find member");

		var block = await _blockRepository.GetBlock(user.Id, blockUserId);
		if(block == null) return BadRequest("member is not blocked");

		_blockRepository.UnblockUser(block);

		if(await _blockRepository.SaveAllAsync())
			return _mapper.Map<MemberDTO>(user2Block);

		return BadRequest("Failed to unblock user");
	}

	//this checks if User has blocked a member
	[HttpGet("member-block-status")] // /api/users/block-status
	public async Task<ActionResult<bool>> MemberBlockStatus(int memberId) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var member = await _userRepository.GetUserByIdAsync(memberId);
		if(member == null) return BadRequest("member not found");

		var isBlocked = _blockRepository.IsUserBlocked(user.Id, memberId);

		return isBlocked;
	}

	//this checks if user has been bloked by a member
	[HttpGet("user-block-status")] // /api/users/block-status
	public async Task<ActionResult<bool>> UserBlockStatus(int memberId) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var member = await _userRepository.GetUserByIdAsync(memberId);
		if(member == null) return BadRequest("member not found");

		var isBlocked = _blockRepository.IsUserBlocked(memberId, user.Id);

		return isBlocked;
	}

	[HttpGet("blocked-users")] // /api/users/blocked-users
	public async Task<ActionResult<List<MemberDTO>>> BlockUsers() {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var blockedMembers = await _blockRepository.GetBlockedMembers(user.Id);
		var blockedMembersDTO = _mapper.Map<List<MemberDTO>>(blockedMembers);

		return blockedMembersDTO ?? new List<MemberDTO>();
	}

}