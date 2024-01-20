using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface INotificationRepository {
	void AddNotification(Notification notification);
	Task<IEnumerable<Notification>> GetNotificationsByUserId(int userId);
}
