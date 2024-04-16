using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Entities;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;

public class NotificationRepository(DataContext context) : INotificationRepository {
	private readonly DataContext _context = context;

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
}