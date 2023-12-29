using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;

public class BookmarkRepository : IBookmarkRepository {
	private readonly DataContext _context;
	private readonly IMapper _mapper;

	public BookmarkRepository(DataContext context, IMapper mapper) {
		_context = context;
		_mapper = mapper;
	}

	public void AddBookmark(Bookmark bookmark) {
		_context.Bookmarks.Add(bookmark);
	}

	public void RemoveBookmark(Bookmark bookmark) {
		_context.Bookmarks.Remove(bookmark);
	}

	public async Task<List<Trill>> GetBookmarksAsync(int userId) {
		return await _context.Bookmarks
			.Where(b => b.UserId == userId)
			.Select(b => b.Trill)
			.ToListAsync();
	}

	public async Task<List<Trill>> GetBookmarks(int userId) {
		var trillEntities = await _context.Bookmarks
			.Where(b => b.UserId == userId)
			.Include(b => b.Trill)
			.OrderByDescending(b => b.CreatedAt)
			.Select(b => b.Trill)
			.ToListAsync();

		return trillEntities;
	}

	public async Task<Bookmark> GetBookmarkByTrillId(int trillId) {
		return await _context.Bookmarks
			.Where(b => b.TrillId == trillId)
			.FirstOrDefaultAsync();
	}
	public async Task<bool> SaveAllAsync() {
		return await _context.SaveChangesAsync() > 0;
	}
}

