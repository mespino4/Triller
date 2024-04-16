using api_aspnet.src.Data.Repositories.Interfaces;
using AutoMapper;

namespace api_aspnet.src.Data.Repositories;

public class UnitOfWork(DataContext context, IMapper mapper) : IUnitOfWork {
	private readonly DataContext _context = context;
	private readonly IMapper _mapper = mapper;

    public IUserRepository UserRepository =>  new UserRepository(_context, _mapper);

	public ITrillRepository TrillRepository => new TrillRepository(_context);

	public IConnectionRepository ConnectionRepository => new ConnectionRepository(_context, _mapper);

	public INotificationRepository NotificationRepository => new NotificationRepository(_context);

	public IMessageRepository MessageRepository => new MessageRepository(_context, _mapper);

	public IBookmarkRepository BookmarkRepository => new BookmarkRepository(_context);

	public IBlockRepository BlockRepository => new BlockRepository(_context);

	public IChatCardRepository ChatCardRepository => new ChatCardRepository(_context);

	public ITrillReplyRepository TrillReplyRepository => new TrillReplyRepository(_context, _mapper);

	public IRetrillRepository RetrillRepository => new RetrillRepository(_context);

	public async Task<bool> Complete() {
		return await _context.SaveChangesAsync() > 0;
	}

	public bool HasChanges() {
		return _context.ChangeTracker.HasChanges();
	}
}
