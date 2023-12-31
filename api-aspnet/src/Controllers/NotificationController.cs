using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

public class NotificationController : BaseApiController {
	private readonly INotificationRepository _notificationRepository;
	private readonly IUserRepository _userRepository;
	private readonly IMapper _mapper;

	public NotificationController(INotificationRepository notificationRepository, IUserRepository userRepository,
		IMapper mapper){
		_notificationRepository = notificationRepository;
		_userRepository = userRepository;
		_mapper = mapper;
	}

    [HttpGet] ///api/notification
	public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetNotifications() {
		var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var notifications = await _notificationRepository.GetNotificationsByUserId(user.Id);
		return Ok(_mapper.Map<IEnumerable<NotificationDTO>>(notifications));
	}
}
