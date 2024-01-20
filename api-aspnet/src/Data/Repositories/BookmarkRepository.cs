using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;

public class BookmarkRepository : IBookmarkRepository {
	private readonly DataContext _context;

	public BookmarkRepository(DataContext context) {
		_context = context;
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
		var bookmarks = await _context.Bookmarks
			.Where(b => b.UserId == userId)
			.Include(l => l.Trill.Likes)
			.Include(r => r.Trill.Replies)
			.Include(r => r.Trill.Retrills)
			.OrderByDescending(b => b.CreatedAt)
			.Select(b => b.Trill)
			.ToListAsync();

		return bookmarks;
	}

	public async Task<Bookmark> GetBookmarkByTrillId(int trillId, int userId) {
		return await _context.Bookmarks
			.Where(b => b.TrillId == trillId && b.UserId == userId)
			.FirstOrDefaultAsync();
	}
}

