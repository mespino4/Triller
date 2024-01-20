using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

public class ConnectionsController : BaseApiController{
	private readonly IUnitOfWork _uow;
	private readonly IMapper _mapper;

	public ConnectionsController(IUnitOfWork uow, IMapper mapper){
		_uow = uow;
		_mapper = mapper;
	}

	[HttpPost("follow")] // /api/connections/follow
	public async Task<ActionResult<MemberDTO>> FollowUser(int targetUserId) {
		var sourceUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(sourceUser == null) return BadRequest("user not found");

		var targetUser = await _uow.UserRepository.GetUserByIdAsync(targetUserId);
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

		_uow.NotificationRepository.AddNotification(notification);
		//await _uow.NotificationRepository.SaveAllAsync();

		_uow.ConnectionRepository.AddConnection(follow);

		if(await _uow.Complete())
			return _mapper.Map<MemberDTO>(targetUser);

		return BadRequest("Failed to follow user");
	}


	[HttpDelete("unfollow")] //api/connections/unfollow
	public async Task<ActionResult<MemberDTO>> UnfollowUser(int targetUserId) {
		var sourceUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(sourceUser == null) return BadRequest("User not found");

		var targetUser = await _uow.UserRepository.GetUserByIdAsync(targetUserId);
		if(targetUser == null) return BadRequest("Target user not found");
		
		var unfollow = await _uow.ConnectionRepository.GetUserConnection(sourceUser.Id, targetUserId);
		if(unfollow == null) return BadRequest("Connection not found");

		_uow.ConnectionRepository.RemoveConnection(unfollow);

		if(await _uow.Complete()) return _mapper.Map<MemberDTO>(targetUser);
		return BadRequest("Failed to unfollow user");
	}


	[HttpGet] ////api/
	public async Task<ActionResult<List<MemberDTO>>> GetUserConnections(string predicate) {
		var users = await _uow.ConnectionRepository.GetConnections(predicate, User.GetUserId());
		return Ok(users);
	}

	[HttpGet("status")]
	public async Task<ActionResult<bool>> GetConnectionStatus(int targetUserId) {
		var sourceUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(sourceUser == null) return BadRequest("User not found");

		var targetUser = await _uow.UserRepository.GetUserByIdAsync(targetUserId);
		if(targetUser == null) return BadRequest("Target user not found");

		var connection = await _uow.ConnectionRepository
			.GetConnectionStatus(sourceUser.Id, targetUser.Id);

		return connection;
	}

}
