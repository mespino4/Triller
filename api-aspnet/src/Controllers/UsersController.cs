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
public class UsersController(IUnitOfWork uow, IMediaService mediaService, IMapper mapper) : BaseApiController {
	private readonly IUnitOfWork _uow = uow;
	private readonly IMapper _mapper = mapper;
	private readonly IMediaService _mediaService = mediaService;

    [HttpGet]
	public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers() {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound();

		var members = await _uow.UserRepository.GetUsersAsync(user.Id);
		return Ok(_mapper.Map<IEnumerable<MemberDTO>>(members));
	}


	[HttpGet("username/{username}")] ///api/users/username
	public async Task<ActionResult<MemberDTO>> GetUser(string username) {
		var user =  await _uow.UserRepository.GetUserByUsernameAsync(username);
		return _mapper.Map<MemberDTO>(user);
	}

	[HttpGet("id/{id}")] ///api/users/id
	public async Task<ActionResult<MemberDTO>> GetUserById(int id) {
		var user = await _uow.UserRepository.GetUserByIdAsync(id);
		return _mapper.Map<MemberDTO>(user);
	}

	[HttpGet("timeline")]
	public async Task<ActionResult<IEnumerable<TrillDTO>>> GetUserTimeline(string username) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(username);
		if(user == null) return NotFound();

		var timeline = await _uow.UserRepository.GetUserTimeline(user.Id);
		if(timeline == null) return BadRequest("Timeline not found");

		return Ok(timeline);
	}

	[HttpPut("profile")]
	public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDto) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound();

		_mapper.Map(memberUpdateDto, user);

		if(await _uow.Complete()) return Ok();
		return NoContent();
	}

	//Profile Pic
	[HttpPut("profile-pic/update")] // /api/users/profile-pic
	public async Task<ActionResult> UpdateUserProfilePic(IFormFile file) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
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
			_uow.UserRepository.DeleteProfilePicture(user);
		}

		user.ProfilePicture = photo;
		user.ProfilePic = photo.Url;

		if(await _uow.Complete()) {
			return CreatedAtAction(nameof(GetUser),
				new { username = user.UserName },
				await _uow.UserRepository.GetUserByUsernameAsync(user.UserName));
		}
		return BadRequest("Failed to update profile pic");
	}

	
	[HttpDelete("profile-pic/delete")] // /api/users/profile-pic
	public async Task<ActionResult> DeleteUserProfilePic() {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound();

		var profilePhoto = user.ProfilePicture;
		if(profilePhoto == null) return NotFound();

		if(profilePhoto != null) {
			var result = await _mediaService.DeleteMediaAsync(profilePhoto.PublicId);

			_uow.UserRepository.DeleteProfilePicture(user);
			if(result.Error != null) return BadRequest(result.Error.Message);
		}

		user.ProfilePic = null;

		if(await _uow.Complete()) return Ok();

		return BadRequest("Failed to remove profile pic");
	}
	

	[HttpPut("banner-pic/update")] // /api/users/profile-pic
	public async Task<ActionResult> UpdateUserBannerPic(IFormFile file) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
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
			_uow.UserRepository.DeleteBannerPicture(user);
		}

		user.BannerPicture = photo;
		user.BannerPic = photo.Url;

		if(await _uow.Complete())
			return Ok();
		return BadRequest("Failed to update Banner pic");
	}

	
	[HttpPost("block")] // /api/users/block
	public async Task<ActionResult<MemberDTO>> BlockUser(int blockUserId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var user2Block = await _uow.UserRepository.GetUserByIdAsync(blockUserId);
		if(user2Block == null) return BadRequest("User to follow not found");

		var block = new Block {
			User = user,
			UserId = user.Id,
			BlockedUser = user2Block,
			BlockedUserId = user2Block.Id
		};

		_uow.BlockRepository.BlockUser(block);

		if(await _uow.Complete())
			return _mapper.Map<MemberDTO>(user2Block);

		return BadRequest("Failed to block user");
	}

	[HttpDelete("unblock")] // /api/users/unblock
	public async Task<ActionResult<MemberDTO>> UnblockUser(int blockUserId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var user2Block = await _uow.UserRepository.GetUserByIdAsync(blockUserId);
		if(user2Block == null) return BadRequest("User to find member");

		var block = await _uow.BlockRepository.GetBlock(user.Id, blockUserId);
		if(block == null) return BadRequest("member is not blocked");

		_uow.BlockRepository.UnblockUser(block);

		if(await _uow.Complete())
			return _mapper.Map<MemberDTO>(user2Block);

		return BadRequest("Failed to unblock user");
	}

	//this checks if User has blocked a member
	[HttpGet("member-block-status")] // /api/users/block-status
	public async Task<ActionResult<bool>> MemberBlockStatus(int memberId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var member = await _uow.UserRepository.GetUserByIdAsync(memberId);
		if(member == null) return BadRequest("member not found");

		var isBlocked = _uow.BlockRepository.IsUserBlocked(user.Id, memberId);

		return isBlocked;
	}

	//this checks if user has been bloked by a member
	[HttpGet("user-block-status")] // /api/users/block-status
	public async Task<ActionResult<bool>> UserBlockStatus(int memberId) {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var member = await _uow.UserRepository.GetUserByIdAsync(memberId);
		if(member == null) return BadRequest("member not found");

		var isBlocked = _uow.BlockRepository.IsUserBlocked(memberId, user.Id);

		return isBlocked;
	}

	[HttpGet("blocked-users")] // /api/users/blocked-users
	public async Task<ActionResult<List<MemberDTO>>> BlockUsers() {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("User not found");

		var blockedMembers = await _uow.BlockRepository.GetBlockedMembers(user.Id);
		var blockedMembersDTO = _mapper.Map<List<MemberDTO>>(blockedMembers);

		return blockedMembersDTO ?? new List<MemberDTO>();
	}

	[HttpGet("exploreUsers/{numberOfUsers}")]
	public async Task<ActionResult<IEnumerable<MemberDTO>>> GetRandomUsers(int numberOfUsers) {
		var currentUserId = User.GetUserId();

		var users = await _uow.UserRepository.ExploreUsers(currentUserId, numberOfUsers);

		return Ok(_mapper.Map<IEnumerable<MemberDTO>>(users));
	}

}