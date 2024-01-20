namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface IUnitOfWork {
	IUserRepository UserRepository { get; }
	ITrillRepository TrillRepository { get; }
	IConnectionRepository ConnectionRepository { get; }
	INotificationRepository NotificationRepository { get; }
	IMessageRepository MessageRepository { get; }
	IBookmarkRepository BookmarkRepository { get; }
	IBlockRepository BlockRepository { get; }
	IChatCardRepository ChatCardRepository { get; }
	ITrillReplyRepository TrillReplyRepository { get; }
	IRetrillRepository RetrillRepository { get; }
	Task<bool> Complete();
	bool HasChanges();
}
