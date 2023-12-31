using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Helpers;

namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface ITrillRepository {
	void AddTrill(Trill trill);
	void DeleteTrill(Trill trill);
	void AddTrillReply(TrillReply trillReply);
	void RemoveTrillReply(TrillReply trillReply);
	Task<PagedList<Trill>> GetTrillsAsync(int userId, UserParams userParams); //returns alll the trills
	Task<IEnumerable<Trill>> GetTrillsByUserId(int userId); //returns all trills made by a specific user
	Task<IEnumerable<Trill>> GetTrillsWithRepliesAsync();
	Task<IEnumerable<TrillReply>> GetRepliesFromTrillId(int trillId);
	Task<PagedList<Trill>> GetFollowingTrillsAsync(int userId, UserParams userParams);
	Task<PagedList<Trill>> GetForYouTrillsAsync(int userId, UserParams userParams);

	Task<Trill> GetTrillById(int id); //returns a trill with a specific id
	Task<bool> SaveAllAsync();
}
