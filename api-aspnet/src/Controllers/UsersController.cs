using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

//[Authorize]
public class UsersController : BaseApiController {
	private readonly IUserRepository _userRepository;

	public UsersController(IUserRepository userRepository) {
		_userRepository = userRepository;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers() {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return NotFound();
		var members = await _userRepository.GetMembersAsync(user.Id);
		return Ok(members);
	}

	[HttpGet("{username}")] ///api/users/username
	public async Task<ActionResult<MemberDTO>> GetUser(string username) {
		return await _userRepository.GetMemberAsync(username);
	}
}
