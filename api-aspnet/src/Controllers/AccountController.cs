using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
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
	private readonly IMapper _mapper;

	public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper) {
		_userManager = userManager;
		_tokenService = tokenService;
		_mapper = mapper;
	}

	[HttpPost("register")] //api/account/register
	public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto) {

		if(await UserExists(registerDto.Username)) return BadRequest("Username already exists");

		var user = _mapper.Map<AppUser>(registerDto);
		user.UserName = registerDto.Username.ToLower(); // Create a new user object with the provided username.

		var result = await _userManager.CreateAsync(user, registerDto.Password); // Add the user to the database
		if(!result.Succeeded) return BadRequest(result.Errors);

		var roleResult = await _userManager.CreateAsync(user, "Member");
		if(!roleResult.Succeeded) return BadRequest(result.Errors);

		// Return the newly registered user.
		return new UserDTO {
			Username = user.UserName,
			Token = await _tokenService.CreateToken(user),
			DisplayName = user.DisplayName,
			ProfilePic = user.ProfilePic,
		};
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
			Username = user.UserName,
			Token = await _tokenService.CreateToken(user),
			DisplayName = user.DisplayName,
			ProfilePic = user.ProfilePic,
		};
	}

	//This method checks to see if the username already exists in the database
	private async Task<bool> UserExists(string username) {
		return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
	}
}
