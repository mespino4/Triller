using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories.Interfaces;

// This interface represents a repository for managing user-related operations in an application.
public interface IUserRepository {
	void Update(AppUser user);
	Task<bool> SaveAllAsync();
	Task<IEnumerable<AppUser>> GetUsersAsync();
	Task<AppUser> GetUserByIdAsync(int userId);
	Task<AppUser> GetUserByUsernameAsync(string username);
	Task<IEnumerable<MemberDTO>> GetMembersAsync(int currentUserId);
	Task<MemberDTO> GetMemberAsync(string username);
	Task<IEnumerable<TrillDTO>> GetUserTimeline(int userId);
	Task<IEnumerable<TrillDTO>> GetUserTimelineWithReplies(int userId);

	public void DeleteProfilePicture(AppUser user);
	public void DeleteBannerPicture(AppUser user);
}
