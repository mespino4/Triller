using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Extensions;
using api_aspnet.src.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Controllers;
public class AccountController : BaseApiController {
	private readonly UserManager<AppUser> _userManager;
	private readonly ITokenService _tokenService;
	private readonly IUserRepository _userRepository;
	private readonly IMapper _mapper;

	public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, 
		IUserRepository userRepository, IMapper mapper) {
		_userManager = userManager;
		_tokenService = tokenService;
		_userRepository = userRepository;
		_mapper = mapper;
	}

	[HttpPost("register")]
	public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto) {
		// Check if the username already exists
		if(await UserExists(registerDto.Username)) return BadRequest("Username already exists");

		// Create a new user object with the provided username
		var user = _mapper.Map<AppUser>(registerDto);
		user.UserName = registerDto.Username.ToLower();

		// Add the user to the database
		var result = await _userManager.CreateAsync(user, registerDto.Password);
		if(!result.Succeeded) return BadRequest(result.Errors);
		
		// Assign the 'Member' role to the user
		var roleResult = await _userManager.AddToRoleAsync(user, "Member");
		if(!roleResult.Succeeded) return BadRequest(roleResult.Errors);

		// Return the newly registered user
		var userDto = new UserDTO {
			UserId = user.Id,
			Username = user.UserName,
			Token = await _tokenService.CreateToken(user),
			Language = user.Language,
			Displayname = user.DisplayName,
			ProfilePic = user.ProfilePic,
			BannerPic = user.BannerPic,
		};

		return userDto;
	}



	[HttpPost("login")] // Endpoint for user login (HTTP POST request to /api/account/login)
	public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto) {
		// Find the user in the database by username
		var user = await _userManager.Users
			.SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

		// If the user does not exist, return Unauthorized
		if(user == null) return Unauthorized("Invalid Username");

		var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
		if(!result) return Unauthorized("Invalid Password");

		// If password matches, return the user
		return new UserDTO {
			UserId = user.Id,
			Username = user.UserName,
			Token = await _tokenService.CreateToken(user),
			Language = user.Language,
			Displayname = user.DisplayName,
			ProfilePic = user.ProfilePic,
			BannerPic = user.BannerPic,
		};
	}

	[HttpPut("language/set")]
	public async Task<IActionResult> SetLanguage(bool isEnglish) {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound("User not found");

		user.Language = isEnglish ? "en" : "es";

		await _userRepository.SaveAllAsync();
		return Ok();
		//return StatusCode(500, "Internal server error");
	}

	[HttpGet("language/get")]
	public async Task<string> GetLanguage() {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

		return user.Language;
	}



	//i was gonna let the user delete his account but i ran into problems
	[HttpDelete("delete")]
	public async Task<IActionResult> DeleteUser(int userId) {
		try {
			var user = await _userRepository.GetUserByIdAsync(userId);
			if(user == null) return NotFound("User not found");

			/*
			user.Media.Clear();
			user.Followers.Clear();
			user.Following.Clear();
			user.Retrills.Clear();
			user.Trills.Clear();
			user.TrillsLiked.Clear();
			user.Replies.Clear();
			user.Bookmarks.Clear();
			user.UserReactions.Clear();
			user.UserRoles.Clear();
			user.MessagesSent.Clear();
			user.MessagesReceived.Clear();
			user.BlocksInitiated.Clear();
			user.BlocksReceived.Clear();
			user.Notifications.Clear();
			*/

			// Save changes to make sure TrillsLiked is cleared in the database
			await _userManager.UpdateAsync(user);

			// Delete the user
			var result = await _userManager.DeleteAsync(user);

			if(result.Succeeded) {
				return Ok("User deleted successfully");
			} else {
				// Log or handle errors from the deletion operation
				var errors = string.Join(", ", result.Errors.Select(e => e.Description));
				return BadRequest($"Failed to delete user. Errors: {errors}");
			}
		} catch(Exception ex) {
			// Log or handle unexpected errors
			// _logger.LogError($"Error deleting user: {ex.Message}");
			return StatusCode(500, ex);
		}
	}




	//This method checks to see if the username already exists in the database
	private async Task<bool> UserExists(string username) {
		return await _userManager.Users
			.AnyAsync(x => x.UserName == username.ToLower());
	}

}
