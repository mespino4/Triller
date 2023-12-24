using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;

public class NotificationRepository : INotificationRepository {
	private readonly DataContext _context;
	private readonly IUserRepository _userRepository;
	private readonly IMapper _mapper;

	public NotificationRepository(DataContext context, IUserRepository userRepository,
		IMapper mapper) {
		_context = context;
		_userRepository = userRepository;
		_mapper = mapper;
	}

	public void AddNotification(Notification notification) {
		_context.Notifications.Add(notification);
	}

	public async Task<IEnumerable<Notification>> GetNotificationsByUserId(int userId) {
		var notifications = await _context.Notifications
			.Include(n => n.User)
			.Include(n => n.Member)
			.Where(n => n.UserId == userId)
			.OrderByDescending(n => n.Timestamp)
			.ToListAsync();

		return notifications;
	}

	public async Task<bool> SaveAllAsync() {
		return await _context.SaveChangesAsync() > 0;
	}
}
