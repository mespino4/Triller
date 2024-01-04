using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

public class ConnectionsController : BaseApiController{
	private readonly IUserRepository _userRepository;
	private readonly INotificationRepository _notificationRepository;
	private readonly IConnectionRepository _connectionRepository;
	private readonly IMapper _mapper;

	public ConnectionsController(IUserRepository userRepository, 
		INotificationRepository notificationRepository,
		IConnectionRepository connectionRepository, IMapper mapper){
		_userRepository = userRepository;
		_notificationRepository = notificationRepository;
		_connectionRepository = connectionRepository;
		_mapper = mapper;
	}

	[HttpPost("follow")] // /api/connections/follow
	public async Task<ActionResult<MemberDTO>> FollowUser(int targetUserId) {
		var sourceUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(sourceUser == null) return BadRequest("user not found");

		var targetUser = await _userRepository.GetUserByIdAsync(targetUserId);
		if(targetUser == null) return BadRequest("User to follow not found");

		if(sourceUser == targetUser) return BadRequest("you cannot follow yourself");

		var follow = new Connection {
			SourceUser = sourceUser,
			SourceUserId = sourceUser.Id,
			TargetUser = targetUser,
			TargetUserId = targetUser.Id
		};

		var notification = new Notification {
			//User = user,
			UserId = targetUser.Id,
			//Member, = null,
			MemberId = sourceUser.Id,
			Type = "Follow",
			//TrillId = trillId,
			Timestamp = DateTime.Now
		};

		_notificationRepository.AddNotification(notification);
		await _notificationRepository.SaveAllAsync();

		_connectionRepository.AddConnection(follow);

		if(await _connectionRepository.SaveAllAsync())
			return _mapper.Map<MemberDTO>(targetUser);

		return BadRequest("Failed to follow user");
	}


	[HttpDelete("unfollow")] //api/connections/unfollow
	public async Task<ActionResult<MemberDTO>> UnfollowUser(int targetUserId) {
		var sourceUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(sourceUser == null) return BadRequest("user not found");

		var targetUser = await _userRepository.GetUserByIdAsync(targetUserId);
		if(targetUser == null) return BadRequest("target user not found");

		var unfollow = await _connectionRepository.GetUserConnection(sourceUser.Id, targetUserId);
		if(unfollow == null) return BadRequest("connection not found");

		_connectionRepository.RemoveConnection(unfollow);

		if(await _connectionRepository.SaveAllAsync())
			return _mapper.Map<MemberDTO>(targetUser);

		return BadRequest("Failed to unfollow user");
	}

	[HttpGet] ////api/
	public async Task<ActionResult<List<MemberDTO>>> GetUserConnections(string predicate) {
		var users = await _connectionRepository.GetConnections(predicate, User.GetUserId());
		return Ok(users);
	}

	[HttpGet("status")]
	public async Task<ActionResult<bool>> GetConnectionStatus(int targetUserId) {
		var sourceUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(sourceUser == null) return BadRequest("User not found");

		var targetUser = await _userRepository.GetUserByIdAsync(targetUserId);
		if(targetUser == null) return BadRequest("Target user not found");

		var connection = await _connectionRepository.GetUserConnection(sourceUser.Id, targetUserId);

		// Return true if connection exists, false otherwise
		return Ok(connection != null);
	}
}
