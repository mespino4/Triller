using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface IBookmarkRepository {
	void AddBookmark(Bookmark bookmark);
	void RemoveBookmark(Bookmark bookmark);
	Task<List<Trill>> GetBookmarks(int userId);
	Task<Bookmark> GetBookmarkByTrillId(int trillId);
	Task<bool> SaveAllAsync();
}
