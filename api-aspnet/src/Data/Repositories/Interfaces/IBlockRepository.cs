using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface IBlockRepository {
	void BlockUser(Block block);
	void UnblockUser(Block block);
	bool IsUserBlocked(int userId, int blockedUserId);
	Task<List<AppUser>> GetBlockedMembers(int userId);
	Task<Block> GetBlock(int userId, int blockedUserId);
}
