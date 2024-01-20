using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface IConnectionRepository {
	void AddConnection(Connection connection);
	void RemoveConnection(Connection connection);
	Task<List<MemberDTO>> GetConnections(string predicate, int userId);
	Task<Connection> GetUserConnection(int sourceUserId, int targetUserId);
	Task<bool> GetConnectionStatus(int sourceUserId, int targetUserId);
}
