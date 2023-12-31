using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Helpers;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;

public class TrillRepository : ITrillRepository {
	private readonly DataContext _context;
	private readonly IMapper _mapper;

	public TrillRepository(DataContext context, IMapper mapper) {
		_context = context;
		_mapper = mapper;
	}
	public void AddTrill(Trill trill) {
		_context.Trills.Add(trill);
		//_context.SaveChanges();
	}
	public void DeleteTrill(Trill trill) {
		_context.Trills.Remove(trill);
		//_context.SaveChanges();
	}

	public void AddTrillReply(TrillReply trillReply) {
		_context.TrillReplies.Add(trillReply);
	}

	public void RemoveTrillReply(TrillReply trillReply) {
		_context.TrillReplies.Remove(trillReply);
	}

	public async Task<IEnumerable<Trill>> GetTrillsWithRepliesAsync() {
		return await _context.Trills
		.Include(t => t.Replies)
			.OrderByDescending(trill => trill.Timestamp)
			//.ProjectTo<TrillDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}

	public async Task<PagedList<Trill>> GetTrillsAsync(int currentUserId, UserParams userParams) {
		var query = _context.Trills
			.Include(t => t.Replies)
			.Include(t => t.Likes)
			.Include(t => t.Retrills)
			.OrderByDescending(trill => trill.Timestamp)
		//.ProjectTo<TrillDTO>(_mapper.ConfigurationProvider)
			.AsNoTracking();

		return await PagedList<Trill>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
	}

	public async Task<IEnumerable<Trill>> GetTrillsByUserId(int userId) {
		return await _context.Trills
			.Include(t => t.Likes)
			.Where(trill => trill.AuthorId == userId)
		.OrderByDescending(trill => trill.Timestamp) // Order by Timestamp in descending order
			//.ProjectTo<TrillDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();
	}

	public async Task<PagedList<Trill>> GetForYouTrillsAsync(int currentUserId, UserParams userParams) {
		var query = _context.Trills
			.Include(t => t.Replies)
			.Include(t => t.Likes)
			.Include(t => t.Retrills)
			.Where(t => !t.Author.BlocksReceived
				.Any(b => b.UserId == currentUserId) && !_context.Blocks
				.Any(b => (b.UserId == currentUserId && b.BlockedUserId == t.AuthorId) ||
				(b.UserId == t.AuthorId && b.BlockedUserId == currentUserId)))
			.OrderByDescending(trill => trill.Timestamp)
			.AsNoTracking();

		return await PagedList<Trill>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
	}

	public async Task<PagedList<Trill>> GetFollowingTrillsAsync(int userId, UserParams userParams) {
		var followedUserIds = await _context.Connections
			.Where(c => c.SourceUserId == userId)
			.Select(c => c.TargetUserId)
		.ToListAsync();

		var query = _context.Trills
			.Where(trill => followedUserIds.Contains(trill.AuthorId))
			.Include(t => t.Replies)
			.OrderByDescending(trill => trill.Timestamp)
			//.ProjectTo<TrillDto>(_mapper.ConfigurationProvider)
			.AsNoTracking();

		return await PagedList<Trill>
			.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
	}

	public async Task<Trill> GetTrillById(int trillId) {
		return await _context.Trills
			.Include(t => t.Author)
			.Include(t => t.Likes)
			.Include(t => t.Retrills)
			.Include(t => t.Replies)
			.Where(t => t.Id == trillId)
			.FirstOrDefaultAsync();
	}

	public async Task<IEnumerable<TrillReply>> GetRepliesFromTrillId(int trillId) {
		return await _context.TrillReplies
			.Include(tr => tr.Author)  // Include the Author navigation property
			.Include(tr => tr.Reactions)  // Include the Reactions navigation property
				.ThenInclude(reaction => reaction.User)  // Include the User navigation property within Reactions
			.Where(tr => tr.ParentTrillId == trillId)
			.ToListAsync();
	}

	public async Task<bool> SaveAllAsync() {
		return await _context.SaveChangesAsync() > 0;
	}
}