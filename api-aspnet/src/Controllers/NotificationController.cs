using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;

public class NotificationController(IUnitOfWork uow, IMapper mapper) : BaseApiController {
	private readonly IUnitOfWork _uow = uow;
	private readonly IMapper _mapper = mapper;

    [HttpGet] ///api/notification
	public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetNotifications() {
		var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(user == null) return BadRequest("user not found");

		var notifications = await _uow.NotificationRepository.GetNotificationsByUserId(user.Id);
		return Ok(_mapper.Map<IEnumerable<NotificationDTO>>(notifications));
	}
}
